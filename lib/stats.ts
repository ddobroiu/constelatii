import { prisma } from "@/lib/db/prisma";

/**
 * Cifrele aplicației pentru mydashboard.ro (contractul comun din mydashboard.ro/lib/app-stats.ts:
 * { project, generatedAt, kpi[], recent[] }). Zilele sunt cele din România.
 * Tabelele se citesc fără schemă în față, ca restul aplicației (schema vine din search_path-ul rolului).
 */

export type StatsPeriod = "h24" | "today" | "d7" | "d30" | "total";

const PERIODS: Record<StatsPeriod, string> = {
  h24: "now() - interval '24 hours'",
  today: "date_trunc('day', now() at time zone 'Europe/Bucharest') at time zone 'Europe/Bucharest'",
  d7: "now() - interval '7 days'",
  d30: "now() - interval '30 days'",
  total: "'1970-01-01'::timestamptz",
};

type KpiRow = {
  period: string;
  users: number;
  leads: number;
  emails: number;
  unsubscribes: number;
  converted: number;
  payers: number;
  orders: number;
  revenue: number;
  active: number;
  unbilled: number;
};

export type KpiKey = Exclude<keyof KpiRow, "period">;

export type Kpi = {
  key: KpiKey;
  label: string;
  unit: "count" | "money" | "percent";
  hint?: string;
  h24: number;
  today: number;
  d7: number;
  d30: number;
  total: number;
};

type RecentRow = {
  at: Date;
  kind: "signup" | "lead" | "purchase";
  email: string;
  name: string | null;
  label: string | null;
  amount: number | null;
  status: string | null;
  invoice: string | null;
  invoice_error: string | null;
};

/** „a***@gmail.com”: destul ca să recunoști un cont, fără adresa întreagă. */
export function maskEmail(email: string): string {
  const [user, domain] = String(email || "").split("@");
  if (!domain) return "***";
  return `${user.slice(0, 1)}***@${domain}`;
}

/** Rândurile de KPI (azi / 7 / 30 zile / total), folosite de mydashboard și de pagina /admin. */
export async function getKpis(): Promise<Kpi[]> {
  const parts = Object.entries(PERIODS).map(
    ([key, since]) => `
      select '${key}' as period,
        (select count(*) from users where created_at >= ${since})::int as users,
        (select count(*) from leads where created_at >= ${since})::int as leads,
        (select count(*) from email_log where error is null and sent_at >= ${since})::int as emails,
        (select count(*) from email_unsubscribes where unsubscribed_at >= ${since})::int as unsubscribes,
        (select count(distinct p.user_id) from pack_purchases p
           join (select user_id, min(sent_at) as at from email_log
                  where user_id is not null and error is null and kind <> 'post_purchase'
                  group by user_id) f on f.user_id = p.user_id
          where p.status = 'paid' and p.completed_at > f.at and p.completed_at >= ${since})::int as converted,
        (select count(distinct user_id) from pack_purchases where status = 'paid' and completed_at >= ${since})::int as payers,
        (select count(*) from pack_purchases where status = 'paid' and completed_at >= ${since})::int as orders,
        (select coalesce(sum(amount_cents), 0) / 100.0 from pack_purchases where status = 'paid' and completed_at >= ${since})::float8 as revenue,
        (select count(distinct user_id) from saved_constellations where created_at >= ${since})::int as active,
        (select count(*) from pack_purchases where status = 'paid' and amount_cents > 0 and invoice_number is null and completed_at >= ${since})::int as unbilled`,
  );
  const rows = await prisma.$queryRawUnsafe<KpiRow[]>(parts.join(" union all "));
  const kpi = Object.fromEntries(rows.map((r) => [r.period, r])) as Record<string, KpiRow>;

  const row = (key: KpiKey, label: string, unit: Kpi["unit"], hint?: string): Kpi => ({
    key,
    label,
    unit,
    ...(hint && { hint }),
    h24: Number(kpi.h24?.[key] ?? 0),
    today: Number(kpi.today?.[key] ?? 0),
    d7: Number(kpi.d7?.[key] ?? 0),
    d30: Number(kpi.d30?.[key] ?? 0),
    total: Number(kpi.total?.[key] ?? 0),
  });

  return [
    row("users", "Conturi noi", "count"),
    row("leads", "Vizitatori care au cerut ghidul", "count", "formularul de pe site, cu acord"),
    row("emails", "E-mailuri trimise", "count", "bun venit, ziua 1/3/7, după plată, revenire, vizitatori"),
    row("unsubscribes", "Dezabonări", "count"),
    row("converted", "Au plătit după un e-mail", "count", "plată după primul e-mail primit; ordine în timp, nu atribuire"),
    row("payers", "Clienți plătitori", "count"),
    row("orders", "Pachete vândute", "count", "plăți confirmate"),
    row("revenue", "Încasat în aplicație", "money", "aceleași plăți vin și din Stripe (project=constelatii)"),
    row("unbilled", "Facturi neemise", "count", "pachete plătite fără factură Oblio (vezi /admin, Plăți); se emit manual din Oblio"),
    row("active", "Oameni care au salvat o constelație", "count"),
  ];
}

export type EmailKindRow = { kind: string; today: number; d7: number; d30: number; total: number; failed: number };

/** E-mailurile din ciclul de viață pe tip (email_log.kind): trimise pe perioade și eșuate (total). */
export async function emailKindCounts(): Promise<EmailKindRow[]> {
  const rows = await prisma.$queryRawUnsafe<EmailKindRow[]>(`
    select kind,
      (count(*) filter (where error is null and sent_at >= ${PERIODS.today}))::int as today,
      (count(*) filter (where error is null and sent_at >= ${PERIODS.d7}))::int as d7,
      (count(*) filter (where error is null and sent_at >= ${PERIODS.d30}))::int as d30,
      (count(*) filter (where error is null))::int as total,
      (count(*) filter (where error is not null))::int as failed
    from email_log
    group by kind
    order by total desc, kind
  `);
  return rows.map((r) => ({
    kind: r.kind,
    today: Number(r.today),
    d7: Number(r.d7),
    d30: Number(r.d30),
    total: Number(r.total),
    failed: Number(r.failed),
  }));
}

/** Starea facturii pe scurt: „factura SERIE 123” / „FĂRĂ FACTURĂ: <motiv>” (null pentru plățile neconfirmate sau gratuite). */
function facturaPeScurt(r: RecentRow): string | null {
  if (r.kind !== "purchase" || r.status !== "paid" || !(Number(r.amount) > 0)) return null;
  if (r.invoice) return `factura ${r.invoice}`;
  return `FĂRĂ FACTURĂ${r.invoice_error ? `: ${String(r.invoice_error).slice(0, 60)}` : ""}`;
}

export async function statsMydashboard() {
  const kpi = await getKpis();

  const recent = await prisma.$queryRawUnsafe<RecentRow[]>(`
    (select created_at as at, 'signup' as kind, email, null::text as name, null::text as label, null::float8 as amount, null::text as status,
            null::text as invoice, null::text as invoice_error
       from users order by created_at desc limit 15)
    union all
    (select created_at, 'lead', email, null, source_page, null, null, null, null
       from leads order by created_at desc limit 15)
    union all
    (select coalesce(pp.completed_at, pp.created_at), 'purchase', u.email, u.name, pk.name, pp.amount_cents / 100.0, pp.status,
            nullif(trim(coalesce(pp.invoice_series, '') || ' ' || coalesce(pp.invoice_number, '')), ''), pp.invoice_error
       from pack_purchases pp join users u on u.id = pp.user_id join packs pk on pk.code = pp.pack_code
      order by coalesce(pp.completed_at, pp.created_at) desc limit 20)
    order by at desc
    limit 50
  `);

  return {
    project: "constelatii",
    generatedAt: new Date().toISOString(),
    currency: "RON",
    kpi,
    recent: recent.map((r) => ({
      at: new Date(r.at).toISOString(),
      title:
        r.kind === "signup"
          ? `Cont nou: ${maskEmail(r.email)}`
          : r.kind === "lead"
            ? `Ghid cerut: ${maskEmail(r.email)}`
            : `${r.label ?? "Pachet"}: ${maskEmail(r.email)}`,
      detail:
        r.kind === "lead"
          ? r.label
            ? `de pe ${r.label}`
            : null
          : r.kind === "purchase"
            ? [r.name, maskEmail(r.email), facturaPeScurt(r)].filter(Boolean).join(" · ").slice(0, 200)
            : null,
      amount: r.amount === null ? null : Number(r.amount),
      ...(r.kind === "purchase" && r.status ? { status: r.status } : {}),
    })),
  };
}
