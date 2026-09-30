import Link from "next/link";
import ConstellationMark from "./ConstellationMark";
import { PILLARS } from "@/lib/seo/pillars";
import { CookieSettingsLink } from "./CookieConsent";
import { ANPC_SAL_URL, ANPC_URL, LEGAL_LINKS, OPERATOR, OPERATOR_ADDRESS_LINE } from "@/lib/legal";

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
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">Articole</span>
          <div className="flex flex-col gap-2 text-sm text-foreground/60">
            {PILLARS.slice(0, 4).map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="transition-colors hover:text-foreground">
                {p.shortLabel}
              </Link>
            ))}
            <Link href="/articole" className="text-accent transition-colors hover:text-accent-soft">
              Toate articolele →
            </Link>
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

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">Legal</span>
          <div className="flex flex-col items-start gap-2 text-sm text-foreground/60">
            <Link href={LEGAL_LINKS.terms} className="transition-colors hover:text-foreground">
              Termeni și condiții
            </Link>
            <Link href={LEGAL_LINKS.privacy} className="transition-colors hover:text-foreground">
              Politica de confidențialitate
            </Link>
            <Link href={LEGAL_LINKS.cookies} className="transition-colors hover:text-foreground">
              Politica de cookies
            </Link>
            <CookieSettingsLink className="text-left transition-colors hover:text-foreground" />
            <Link href={LEGAL_LINKS.contact} className="transition-colors hover:text-foreground">
              Contact
            </Link>
            <a href={ANPC_SAL_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
              ANPC – SAL (Soluționarea alternativă a litigiilor)
            </a>
            <a href={ANPC_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
              ANPC
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-5xl text-xs leading-relaxed text-foreground/40">
        <p>
          Site operat de {OPERATOR.name} · CUI {OPERATOR.cui} ({OPERATOR.vatStatus}) · Nr. Reg. Com. {OPERATOR.regCom}{" "}
          · EUID {OPERATOR.euid} · Sediu: {OPERATOR_ADDRESS_LINE} ·{" "}
          <a href={`mailto:${OPERATOR.email}`} className="hover:text-foreground">
            {OPERATOR.email}
          </a>
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-2 border-t border-white/5 pt-6 text-xs text-foreground/40 sm:flex-row sm:justify-between">
        <p>Nu este terapie psihologică sau medicală și nu înlocuiește un specialist — este un instrument de auto-reflecție.</p>
        <p>
          © {year} Constelații Familiale · Realizat de{" "}
          <a href="https://e-web.ro" target="_blank" rel="noopener" className="underline-offset-2 hover:underline">
            e-web.ro
          </a>
        </p>
      </div>
    </footer>
  );
}
