import { redirect } from "next/navigation";
import Link from "next/link";
import GaPurchase from "@/components/account/GaPurchase";
import TikTokPurchase from "@/components/account/TikTokPurchase";
import ReferralLink from "@/components/account/ReferralLink";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getUserAccountData } from "@/lib/db/queries";
import { SITE_URL } from "@/lib/site";

const dateFormatter = new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "long", year: "numeric" });

export default async function ContPage({
  searchParams,
}: {
  searchParams: Promise<{ plata?: string; sid?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/autentificare?callbackUrl=/cont");

  const account = await getUserAccountData(session.user.id);
  if (!account) redirect("/autentificare?callbackUrl=/cont");

  const { plata, sid } = await searchParams;

  // Pentru evenimentul GA4 `purchase`: cumpărarea din sesiunea Stripe din URL, doar dacă e a acestui cont
  const paid =
    plata === "succes" && typeof sid === "string" && sid
      ? await prisma.packPurchase.findFirst({
          where: { stripeCheckoutSessionId: sid, userId: session.user.id },
          select: { id: true, packCode: true, amountCents: true, currency: true },
        })
      : null;

  const appUrl = SITE_URL;
  const referralUrl = `${appUrl}/inregistrare?ref=${account.referralCode}`;

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-10">
        <header className="text-center">
          <h1 className="text-3xl font-semibold">Contul tău</h1>
          <p className="text-foreground/60">
            {account.name} · {account.email}
          </p>
        </header>

        {plata === "succes" && (
          <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm text-accent">
            Plată confirmată — creditele sunt în cont.
          </p>
        )}
        {paid && (
          <>
            <GaPurchase
              transactionId={paid.id}
              value={paid.amountCents / 100}
              currency={paid.currency.toUpperCase()}
              pack={paid.packCode}
            />
            <TikTokPurchase
              orderId={paid.id}
              value={paid.amountCents / 100}
              currency={paid.currency.toUpperCase()}
              pack={paid.packCode}
            />
          </>
        )}

        <section className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <p className="text-sm text-foreground/60">Credite pentru rapoarte complete</p>
            <p className="text-2xl font-semibold text-accent">{account.wallet?.creditsBalance ?? 0}</p>
          </div>
          <Link
            href="/pachete"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-soft"
          >
            Cumpără credite
          </Link>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-2 text-lg font-semibold">Recomandă un prieten</h2>
          <p className="mb-4 text-sm text-foreground/60">
            Trimite linkul tău personal — vezi mai jos exact cine s-a înregistrat prin recomandarea ta.
          </p>
          <ReferralLink url={referralUrl} />

          {account.referrals.length > 0 ? (
            <ul className="mt-6 flex flex-col gap-2">
              {account.referrals.map((r) => (
                <li key={r.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80">{r.name ?? r.email}</span>
                  <span className="text-foreground/40">{dateFormatter.format(r.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-foreground/40">Nimeni încă — trimite linkul de mai sus.</p>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Constelațiile tale salvate</h2>
            <Link href="/harta" className="text-sm text-accent hover:underline">
              + Constelație nouă
            </Link>
          </div>

          {account.constellations.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {account.constellations.map((c) => {
                const unlocked = c.fullReport !== null;
                return (
                  <li key={c.id}>
                    <Link
                      href={`/cont/constelatii/${c.id}`}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <p className="text-sm text-foreground/50">{dateFormatter.format(c.createdAt)}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          unlocked ? "bg-accent/20 text-accent" : "border border-white/10 text-foreground/50"
                        }`}
                      >
                        {unlocked ? "Raport complet" : "Doar teaser"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-foreground/40">
              Nu ai nicio constelație salvată încă. <Link href="/harta" className="text-accent hover:underline">Construiește-o pe prima</Link>.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
