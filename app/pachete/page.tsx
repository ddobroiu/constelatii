import type { Metadata } from "next";
import { listPacks } from "@/lib/billing/packs";
import BuyPackButton from "@/components/pachete/BuyPackButton";
import CheckoutConsent from "@/components/pachete/CheckoutConsent";
import TikTokViewContent from "@/components/pachete/TikTokViewContent";
import { PRICE_NOTE } from "@/lib/legal";

export const metadata: Metadata = {
  alternates: { canonical: "/pachete" },
  title: "Pachete de credite — Constelații Familiale",
  description:
    "Un credit deblochează raportul complet al oricărei constelații. Pachetele nu expiră — le folosești când vrei, pe orice temă.",
};

const lei = new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default async function PachetePage({
  searchParams,
}: {
  searchParams: Promise<{ plata?: string }>;
}) {
  const { plata } = await searchParams;
  const packs = await listPacks();

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10">
        <header className="max-w-xl text-center">
          <h1 className="text-3xl font-semibold">Pachete de credite</h1>
          <p className="mt-3 text-foreground/60">
            Interpretarea inițială e mereu gratuită. Un credit deblochează raportul complet al oricărei
            constelații — bani, relații, rolul de părinte, orice temă exploatezi. Creditele nu expiră.
          </p>
        </header>

        {plata === "anulata" && (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground/60">
            Plata a fost anulată — nimic nu s-a debitat.
          </p>
        )}

        <TikTokViewContent
          currency="RON"
          contents={packs.map((p) => ({
            content_id: p.code,
            content_name: p.name,
            quantity: 1,
            price: p.priceCents / 100,
          }))}
        />

        <CheckoutConsent>
          <div className="grid w-full gap-4 sm:grid-cols-3">
            {packs.map((pack) => {
              const perCredit = pack.priceCents / pack.credits / 100;
              return (
                <div
                  key={pack.code}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <div>
                    <p className="text-sm text-foreground/50">{pack.name}</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {lei.format(pack.priceCents / 100)} <span className="text-base font-normal text-foreground/50">lei</span>
                    </p>
                    <p className="mt-1 text-xs text-foreground/40">
                      {pack.credits} {pack.credits === 1 ? "credit" : "credite"} · {lei.format(perCredit)} lei/credit
                    </p>
                    <p className="mt-1 text-[11px] text-foreground/40">{PRICE_NOTE}</p>
                  </div>
                  <BuyPackButton code={pack.code} label="Cumpără" name={pack.name} price={pack.priceCents / 100} />
                </div>
              );
            })}
          </div>
        </CheckoutConsent>

        <p className="max-w-lg text-center text-xs text-foreground/40">
          Fără abonament — plată unică, pachetul rămâne în cont până îl folosești. {PRICE_NOTE}
        </p>
      </div>
    </div>
  );
}
