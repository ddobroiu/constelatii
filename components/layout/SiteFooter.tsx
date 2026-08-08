import Link from "next/link";
import ConstellationMark from "./ConstellationMark";
import { PILLARS } from "@/lib/seo/pillars";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-20 mt-auto border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/90">
            <ConstellationMark />
            <span>Constelații Familiale</span>
          </div>
          <p className="text-sm text-foreground/50">
            O hartă vie a relațiilor tale, construită printr-o tablă interactivă și citită printr-o interpretare AI
            antrenată pe metoda constelațiilor familiale.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">Explorează</span>
          <div className="flex flex-col gap-2 text-sm text-foreground/60">
            {PILLARS.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="transition-colors hover:text-foreground">
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">Produs</span>
          <div className="flex flex-col gap-2 text-sm text-foreground/60">
            <Link href="/chestionar" className="transition-colors hover:text-foreground">
              Chestionar
            </Link>
            <Link href="/harta" className="transition-colors hover:text-foreground">
              Tablă interactivă
            </Link>
            <Link href="/cont" className="transition-colors hover:text-foreground">
              Contul meu
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-2 border-t border-white/5 pt-6 text-xs text-foreground/40 sm:flex-row sm:justify-between">
        <p>Nu înlocuiește terapia sau consilierea psihologică — este un instrument de auto-reflecție.</p>
        <p>© {year} Constelații Familiale</p>
      </div>
    </footer>
  );
}
