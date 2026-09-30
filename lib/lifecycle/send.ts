import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { sendEmailResult, type EmailContent } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

/**
 * Trimiterea cu jurnal: fiecare e-mail din ciclul de viață se rezervă întâi în
 * `email_log` (cheia unică „adresă:fel”), apoi pleacă. Dacă înregistrarea și
 * cronul încearcă același e-mail în același timp, doar unul primește rândul.
 * O trimitere eșuată își eliberează cheia (NULL), ca să poată fi reîncercată.
 * Id-ul rândului (uuid aleator) devine linkul de dezabonare din mesaj.
 */

export type EmailKind =
  | "welcome"
  | "day1"
  | "day3"
  | "day7"
  | "post_purchase"
  | "reengage"
  | "lead_welcome"
  | "lead_followup";

export const EMAIL_KINDS: EmailKind[] = [
  "welcome",
  "day1",
  "day3",
  "day7",
  "post_purchase",
  "reengage",
  "lead_welcome",
  "lead_followup",
];

/** Nu intră în regula „cel mult un e-mail la 48 de ore”. */
export const EXEMPT_FROM_SPACING: EmailKind[] = ["welcome", "lead_welcome"];

export type Message = Omit<EmailContent, "to" | "unsubscribe">;
export type LoggedResult = "sent" | "failed" | "duplicate";

export function unsubscribeLinks(logId: string) {
  return {
    pageUrl: `${SITE_URL}/dezabonare?id=${logId}`,
    oneClickUrl: `${SITE_URL}/api/dezabonare?id=${logId}`,
  };
}

export async function sendLogged(
  target: { email: string; kind: EmailKind; userId?: string | null; leadId?: string | null },
  build: () => Message,
): Promise<LoggedResult> {
  const email = target.email.trim().toLowerCase();
  const dedupeKey = `${email}:${target.kind}`;

  let logId: string;
  try {
    const row = await prisma.emailLog.create({
      data: { email, kind: target.kind, dedupeKey, userId: target.userId ?? null, leadId: target.leadId ?? null },
      select: { id: true },
    });
    logId = row.id;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") return "duplicate";
    throw err;
  }

  const unsubscribe = unsubscribeLinks(logId);
  let result;
  try {
    result = await sendEmailResult({ ...build(), to: email, unsubscribe });
  } catch (error) {
    result = { ok: false, id: null, error: error instanceof Error ? error.message : String(error) };
  }

  await prisma.emailLog.update({
    where: { id: logId },
    data: result.ok
      ? { resendId: result.id }
      : { error: (result.error ?? "necunoscut").slice(0, 500), dedupeKey: null },
  });

  return result.ok ? "sent" : "failed";
}
