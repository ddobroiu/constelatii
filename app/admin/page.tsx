import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { emailKindCounts, getKpis, type Kpi } from "@/lib/stats";

// Pagina internă pentru proprietar (doar ADMIN_EMAILS, vezi lib/auth/admin.ts): conturi, vizitatori, plăți, e-mailuri.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("ro-RO", {
  timeZone: "Europe/Bucharest",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const fmtDate = (d: Date | null) => (d ? dateFmt.format(d) : "–");
const fmtMoney = (amount: number, currency = "RON") =>
  `${amount.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} ${currency.toUpperCase()}`;
const fmtKpi = (k: Kpi, v: number) => (k.unit === "money" ? fmtMoney(v) : v.toLocaleString("ro-RO"));

const KIND_LABELS: Record<string, string> = {
  welcome: "Bun venit",
  day1: "Ziua 1",
  day3: "Ziua 3",
  day7: "Ziua 7 (pachete)",
  post_purchase: "După plată",
  reengage: "Revenire (30 de zile)",
  lead_welcome: "Ghid pentru vizitator",
  lead_followup: "Vizitator: invitație la cont",
};

const th = "px-4 py-2 font-normal";
const td = "px-4 py-2.5 align-top";
const num = "px-4 py-2.5 text-right tabular-nums whitespace-nowrap";
const sub = "block text-xs text-foreground/50";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-4">
      <h2 className="px-4 pb-3 text-base font-semibold">{title}</h2>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin) notFound();

  const [kpis, kinds, optOuts, leadUnsubs, purchases, pending, users, leads] = await Promise.all([
    getKpis(),
    emailKindCounts(),
    prisma.user.count({ where: { marketingOptOut: true } }),
    prisma.lead.count({ where: { unsubscribedAt: { not: null } } }),
    prisma.packPurchase.findMany({
      where: { status: "paid" },
      orderBy: { completedAt: "desc" },
      take: 100,
      select: {
        id: true,
        amountCents: true,
        currency: true,
        completedAt: true,
        createdAt: true,
        invoiceSeries: true,
        invoiceNumber: true,
        invoiceUrl: true,
        pack: { select: { name: true, credits: true } },
        user: { select: { email: true, name: true } },
      },
    }),
    prisma.packPurchase.findMany({
      where: { status: { not: "paid" } },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        status: true,
        amountCents: true,
        currency: true,
        createdAt: true,
        pack: { select: { name: true } },
        user: { select: { email: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        marketingOptOut: true,
        _count: { select: { constellations: true, packPurchases: { where: { status: "paid" } } } },
      },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, email: true, name: true, sourcePage: true, createdAt: true, unsubscribedAt: true },
    }),
  ]);
  const unsubscribes = kpis.find((k) => k.key === "unsubscribes")?.total ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="text-sm text-foreground/60">
          Conectat ca {admin.email}. Zile după ora României; plățile vin din tabelul aplicației (pack_purchases).
        </p>
      </header>

      <Section title="Pe perioade">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-foreground/60">
            <tr className="border-b border-foreground/10">
              <th className={th}>Indicator</th>
              <th className={`${th} text-right`}>Azi</th>
              <th className={`${th} text-right`}>7 zile</th>
              <th className={`${th} text-right`}>30 de zile</th>
              <th className={`${th} text-right`}>Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {kpis.map((k) => (
              <tr key={k.key}>
                <td className={td}>
                  {k.label}
                  {k.hint && <span className={sub}>{k.hint}</span>}
                </td>
                {[k.today, k.d7, k.d30, k.total].map((v, i) => (
                  <td key={i} className={num}>
                    {fmtKpi(k, v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="E-mailuri din ciclul de viață">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-foreground/60">
            <tr className="border-b border-foreground/10">
              <th className={th}>Tip</th>
              <th className={`${th} text-right`}>Azi</th>
              <th className={`${th} text-right`}>7 zile</th>
              <th className={`${th} text-right`}>30 de zile</th>
              <th className={`${th} text-right`}>Total trimise</th>
              <th className={`${th} text-right`}>Eșuate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {kinds.map((k) => (
              <tr key={k.kind}>
                <td className={td}>
                  {KIND_LABELS[k.kind] ?? k.kind}
                  <span className={sub}>{k.kind}</span>
                </td>
                <td className={num}>{k.today}</td>
                <td className={num}>{k.d7}</td>
                <td className={num}>{k.d30}</td>
                <td className={num}>{k.total}</td>
                <td className={num}>{k.failed}</td>
              </tr>
            ))}
            {kinds.length === 0 && (
              <tr>
                <td colSpan={6} className={`${td} text-foreground/60`}>
                  Niciun e-mail trimis încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="px-4 pt-3 text-sm text-foreground/60">
          Dezabonări (link din e-mail): {unsubscribes} · vizitatori dezabonați: {leadUnsubs} · conturi cu „Nu vreau
          emailuri”: {optOuts}
        </p>
      </Section>

      <Section title={`Clienți plătitori (${purchases.length}${purchases.length === 100 ? "+" : ""} plăți)`}>
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-xs text-foreground/60">
            <tr className="border-b border-foreground/10">
              <th className={th}>Data</th>
              <th className={th}>Client</th>
              <th className={th}>Pachet</th>
              <th className={`${th} text-right`}>Sumă</th>
              <th className={th}>Factură</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {purchases.map((p) => (
              <tr key={p.id}>
                <td className={`${td} whitespace-nowrap`}>{fmtDate(p.completedAt ?? p.createdAt)}</td>
                <td className={td}>
                  {p.user.email}
                  {p.user.name && <span className={sub}>{p.user.name}</span>}
                </td>
                <td className={td}>
                  {p.pack.name}
                  <span className={sub}>{p.pack.credits} deblocări</span>
                </td>
                <td className={num}>{fmtMoney(p.amountCents / 100, p.currency)}</td>
                <td className={td}>
                  {p.invoiceNumber ? (
                    p.invoiceUrl ? (
                      <a href={p.invoiceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                        {p.invoiceSeries} {p.invoiceNumber}
                      </a>
                    ) : (
                      `${p.invoiceSeries ?? ""} ${p.invoiceNumber}`
                    )
                  ) : (
                    <span className="text-foreground/50">fără factură</span>
                  )}
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td colSpan={5} className={`${td} text-foreground/60`}>
                  Nicio plată încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <Section title="Checkout-uri neplătite">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-foreground/60">
            <tr className="border-b border-foreground/10">
              <th className={th}>Început</th>
              <th className={th}>Client</th>
              <th className={th}>Pachet</th>
              <th className={`${th} text-right`}>Sumă</th>
              <th className={th}>Stare</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {pending.map((p) => (
              <tr key={p.id}>
                <td className={`${td} whitespace-nowrap`}>{fmtDate(p.createdAt)}</td>
                <td className={td}>{p.user.email}</td>
                <td className={td}>{p.pack.name}</td>
                <td className={num}>{fmtMoney(p.amountCents / 100, p.currency)}</td>
                <td className={`${td} text-foreground/60`}>{p.status === "pending" ? "neplătit" : p.status}</td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr>
                <td colSpan={5} className={`${td} text-foreground/60`}>
                  Niciun checkout neplătit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <Section title={`Conturi noi (ultimele ${users.length})`}>
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-foreground/60">
            <tr className="border-b border-foreground/10">
              <th className={th}>Înregistrat</th>
              <th className={th}>Email</th>
              <th className={`${th} text-right`}>Constelații</th>
              <th className={`${th} text-right`}>Plăți</th>
              <th className={th}>E-mailuri</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {users.map((u) => (
              <tr key={u.id}>
                <td className={`${td} whitespace-nowrap`}>{fmtDate(u.createdAt)}</td>
                <td className={td}>
                  {u.email}
                  {u.name && <span className={sub}>{u.name}</span>}
                </td>
                <td className={num}>{u._count.constellations}</td>
                <td className={num}>{u._count.packPurchases}</td>
                <td className={`${td} text-foreground/60`}>{u.marketingOptOut ? "nu vrea" : "da"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title={`Vizitatori care au cerut ghidul (ultimii ${leads.length})`}>
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-foreground/60">
            <tr className="border-b border-foreground/10">
              <th className={th}>Data</th>
              <th className={th}>Email</th>
              <th className={th}>Pagina</th>
              <th className={th}>Dezabonat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {leads.map((l) => (
              <tr key={l.id}>
                <td className={`${td} whitespace-nowrap`}>{fmtDate(l.createdAt)}</td>
                <td className={td}>
                  {l.email}
                  {l.name && <span className={sub}>{l.name}</span>}
                </td>
                <td className={`${td} text-foreground/60`}>{l.sourcePage ?? "–"}</td>
                <td className={`${td} whitespace-nowrap text-foreground/60`}>
                  {l.unsubscribedAt ? fmtDate(l.unsubscribedAt) : "–"}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className={`${td} text-foreground/60`}>
                  Niciun vizitator încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
