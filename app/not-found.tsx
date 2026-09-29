import Link from "next/link";
import type { Metadata } from "next";

// Pagina 404 (inclusiv pentru notFound() din rute dinamice). Next trimite
// statusul 404 și meta robots noindex automat.
export const metadata: Metadata = {
  title: "Pagina nu a fost găsită",
};

export default function NotFound() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="relative z-10 flex max-w-xl flex-col items-center gap-5 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Pagina nu a fost găsită</h1>
        <p className="text-foreground/70">
          Adresa nu există sau a fost mutată. Poți începe o constelație sau poți citi ghidurile noastre.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/chestionar"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft"
          >
            Începe explorarea
          </Link>
          <Link
            href="/articole"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm transition-colors hover:bg-white/10"
          >
            Articole
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm transition-colors hover:bg-white/10"
          >
            Pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
}
