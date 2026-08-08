import type { Metadata } from "next";
import Link from "next/link";
import { PILLARS } from "@/lib/seo/pillars";

export const metadata: Metadata = {
  title: "Articole — Constelații Familiale, Astrologie, Blocaje | Constelații Familiale",
  description:
    "Ghiduri despre constelații familiale, blocaje în relații și bani, astrologie și autocunoaștere — explicate clar, pornind de la metoda lui Bert Hellinger.",
};

export default function ArticolePage() {
  return (
    <div className="relative flex flex-1 flex-col items-center px-6 py-16">
      <div className="flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm tracking-wide text-accent">
            Articole
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ghiduri despre constelații și blocaje</h1>
          <p className="max-w-xl text-balance text-foreground/70">
            Explicații pe înțelesul tuturor despre metoda constelațiilor familiale, blocajele care se repetă și ce
            spune, real, astrologia.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
            >
              <h2 className="text-lg font-medium text-foreground/90">{p.label}</h2>
              <p className="text-sm text-foreground/60">{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
