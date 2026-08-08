import Link from "next/link";
import { PILLARS } from "@/lib/seo/pillars";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">

      <main className="relative z-10 flex max-w-2xl flex-col items-center gap-8 text-center">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm tracking-wide text-accent">
          Constelații Familiale
        </span>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Vezi dinamica familiei tale,{" "}
          <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
            printr-o hartă vie
          </span>
        </h1>

        <p className="text-balance text-lg leading-8 text-foreground/70">
          Alege pe cine reprezinți, așează figurile pe tablă exact cum le simți în relație —
          distanță, apropiere, direcție — și primește o interpretare personalizată, îmbogățită
          cu harta ta natală astrologică.
        </p>

        <Link
          href="/chestionar"
          className="rounded-full bg-accent px-8 py-3 text-base font-medium text-background transition-colors hover:bg-accent-soft"
        >
          Începe explorarea
        </Link>

        <p className="text-xs text-foreground/40">
          Nu înlocuiește terapia sau consilierea psihologică — este un instrument de auto-reflecție.
        </p>

        <nav className="flex flex-wrap justify-center gap-2 pt-4">
          {PILLARS.slice(0, 4).map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-white/10"
            >
              {p.label}
            </Link>
          ))}
          <Link
            href="/articole"
            className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm text-accent transition-colors hover:bg-accent/20"
          >
            Toate articolele →
          </Link>
        </nav>
      </main>
    </div>
  );
}
