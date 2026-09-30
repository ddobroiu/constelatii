import { listPacks } from "@/lib/billing/packs";
import { prisma } from "@/lib/db/prisma";

import {
  day1Message,
  day3Message,
  day7Message,
  leadFollowupMessage,
  leadWelcomeMessage,
  postPurchaseMessage,
  reengageMessage,
  welcomeMessage,
} from "./messages";
import { EXEMPT_FROM_SPACING, sendLogged, type EmailKind, type Message } from "./send";
import { loadSnapshot } from "./snapshot";

/**
 * Cronul e-mailurilor: cine ce primește acum. Reguli, verificate la fiecare rulare:
 *   - doar conturile și vizitatorii creați după lansare (`email_settings`);
 *   - niciodată cui a bifat „Nu vreau…”, s-a dezabonat sau e pe lista de dezabonări;
 *   - fiecare fel o singură dată pe adresă (`email_log.dedupe_key`);
 *   - cel mult un e-mail la 48 de ore pe adresă, în afară de bun venit;
 *   - fiecare fel are o fereastră: după o pauză a cronului, nu pleacă „ziua 1”
 *     cuiva care e de 10 zile în cont.
 */

const DAY = 24 * 60 * 60 * 1000;
const SPACING_MS = 48 * 60 * 60 * 1000;
const PAUSE_MS = 600;
const MAX_FAILURES = 3;

interface History {
  sent: Set<string>;
  failed: Map<string, number>;
  lastSpacedAt: number | null;
}

async function histories(emails: string[]): Promise<Map<string, History>> {
  const map = new Map<string, History>();
  if (emails.length === 0) return map;
  const logs = await prisma.emailLog.findMany({
    where: { email: { in: emails } },
    select: { email: true, kind: true, sentAt: true, error: true },
  });
  for (const log of logs) {
    const h = map.get(log.email) ?? { sent: new Set(), failed: new Map(), lastSpacedAt: null };
    if (log.error) {
      h.failed.set(log.kind, (h.failed.get(log.kind) ?? 0) + 1);
    } else {
      h.sent.add(log.kind);
      if (!EXEMPT_FROM_SPACING.includes(log.kind as EmailKind)) {
        h.lastSpacedAt = Math.max(h.lastSpacedAt ?? 0, log.sentAt.getTime());
      }
    }
    map.set(log.email, h);
  }
  return map;
}

function checker(h: History | undefined) {
  return (k: EmailKind) => !h?.sent.has(k) && (h?.failed.get(k) ?? 0) < MAX_FAILURES;
}

interface Job {
  kind: EmailKind;
  email: string;
  name: string | null;
  userId?: string;
  leadId?: string;
}

async function collectJobs(now: number): Promise<Job[]> {
  const settings = await prisma.emailSettings.findUnique({ where: { id: 1 } });
  // Fără rândul de lansare (migrarea n-a rulat), nu trimitem nimic.
  if (!settings) return [];
  const launchedAt = settings.lifecycleLaunchedAt;

  const unsubscribed = new Set(
    (await prisma.emailUnsubscribe.findMany({ select: { email: true } })).map((u) => u.email),
  );

  const users = await prisma.user.findMany({
    // marketingChoiceAt NULL: cont creat cu Google din „Autentificare”, fără să fi
    // văzut anunțul despre e-mailuri — primește doar bun venit (trimis imediat).
    where: { createdAt: { gte: launchedAt }, marketingOptOut: false, marketingChoiceAt: { not: null } },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      constellations: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
      packPurchases: {
        where: { status: "paid" },
        select: { completedAt: true },
        orderBy: { completedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const leads = await prisma.lead.findMany({
    where: { createdAt: { gte: launchedAt }, unsubscribedAt: null },
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const userEmails = new Set(
    (
      await prisma.user.findMany({
        where: { email: { in: leads.map((l) => l.email) } },
        select: { email: true },
      })
    ).map((u) => u.email.toLowerCase()),
  );

  const history = await histories([
    ...users.map((u) => u.email.toLowerCase()),
    ...leads.map((l) => l.email.toLowerCase()),
  ]);

  const jobs: Job[] = [];
  const seen = new Set<string>();

  for (const u of users) {
    const email = u.email.toLowerCase();
    if (unsubscribed.has(email) || seen.has(email)) continue;
    const h = history.get(email);
    const can = checker(h);
    const age = now - u.createdAt.getTime();
    const lastConstellation = u.constellations[0]?.createdAt.getTime() ?? null;
    const paidAt = u.packPurchases[0]?.completedAt?.getTime() ?? null;

    let kind: EmailKind | null = null;
    if (can("welcome") && age < 2 * DAY) kind = "welcome";
    else if (h?.lastSpacedAt && now - h.lastSpacedAt < SPACING_MS) kind = null;
    else if (paidAt && now - paidAt >= DAY && now - paidAt < 10 * DAY && can("post_purchase")) kind = "post_purchase";
    else if (!lastConstellation && age >= DAY && age < 3 * DAY && can("day1")) kind = "day1";
    else if (age >= 3 * DAY && age < 7 * DAY && can("day3")) kind = "day3";
    else if (!paidAt && age >= 7 * DAY && age < 14 * DAY && can("day7")) kind = "day7";
    else {
      const lastActivity = Math.max(u.createdAt.getTime(), lastConstellation ?? 0, paidAt ?? 0);
      if (now - lastActivity >= 30 * DAY && can("reengage")) kind = "reengage";
    }

    if (kind) {
      seen.add(email);
      jobs.push({ kind, email, name: u.name, userId: u.id });
    }
  }

  for (const l of leads) {
    const email = l.email.toLowerCase();
    if (unsubscribed.has(email) || seen.has(email) || userEmails.has(email)) continue;
    const h = history.get(email);
    const can = checker(h);
    const age = now - l.createdAt.getTime();

    let kind: EmailKind | null = null;
    if (can("lead_welcome") && age < 2 * DAY) kind = "lead_welcome";
    else if (h?.lastSpacedAt && now - h.lastSpacedAt < SPACING_MS) kind = null;
    else if (age >= 3 * DAY && age < 14 * DAY && can("lead_followup")) kind = "lead_followup";

    if (kind) {
      seen.add(email);
      jobs.push({ kind, email, name: l.name, leadId: l.id });
    }
  }

  const order: EmailKind[] = [
    "welcome",
    "lead_welcome",
    "post_purchase",
    "day1",
    "day3",
    "day7",
    "lead_followup",
    "reengage",
  ];
  return jobs.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
}

export interface RunReport {
  dry: boolean;
  due: Partial<Record<EmailKind, number>>;
  sent: Partial<Record<EmailKind, number>>;
  failed: Partial<Record<EmailKind, number>>;
  skipped: number;
  remaining: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runLifecycle({ dry, limit }: { dry: boolean; limit: number }): Promise<RunReport> {
  const jobs = await collectJobs(Date.now());
  const report: RunReport = { dry, due: {}, sent: {}, failed: {}, skipped: 0, remaining: 0 };
  for (const job of jobs) report.due[job.kind] = (report.due[job.kind] ?? 0) + 1;

  if (dry) {
    report.remaining = jobs.length;
    return report;
  }

  const batch = jobs.slice(0, limit);
  report.remaining = jobs.length - batch.length;
  const packs = batch.some((j) => j.kind === "day7") ? await listPacks() : [];

  for (const [index, job] of batch.entries()) {
    if (index > 0) await sleep(PAUSE_MS);

    let result;
    try {
      const snapshot =
        job.userId && ["day3", "post_purchase", "reengage"].includes(job.kind)
          ? await loadSnapshot(job.userId)
          : null;

      const build = (): Message => {
        switch (job.kind) {
          case "welcome":
            return welcomeMessage(job.name);
          case "day1":
            return day1Message(job.name);
          case "day3":
            return day3Message(job.name, snapshot!);
          case "day7":
            return day7Message(job.name, packs);
          case "post_purchase":
            return postPurchaseMessage(job.name, snapshot!);
          case "reengage":
            return reengageMessage(job.name, snapshot!);
          case "lead_welcome":
            return leadWelcomeMessage(job.name);
          case "lead_followup":
            return leadFollowupMessage(job.name);
        }
      };

      result = await sendLogged(
        { email: job.email, kind: job.kind, userId: job.userId, leadId: job.leadId },
        build,
      );
    } catch (error) {
      console.error(`[lifecycle] ${job.kind} către ${job.email}:`, error);
      result = "failed" as const;
    }

    if (result === "sent") report.sent[job.kind] = (report.sent[job.kind] ?? 0) + 1;
    else if (result === "failed") report.failed[job.kind] = (report.failed[job.kind] ?? 0) + 1;
    else report.skipped += 1;
  }

  return report;
}

/** La înregistrare: bun venit imediat, jurnalizat, fără să aștepte cronul. */
export function sendWelcomeNow(user: { id: string; email: string; name: string | null }) {
  return sendLogged({ email: user.email, kind: "welcome", userId: user.id }, () => welcomeMessage(user.name));
}

/** La formularul pentru vizitatori: ghidul promis, imediat. */
export function sendLeadWelcomeNow(lead: { id: string; email: string; name: string | null }) {
  return sendLogged({ email: lead.email, kind: "lead_welcome", leadId: lead.id }, () =>
    leadWelcomeMessage(lead.name),
  );
}
