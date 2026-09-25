import Link from "next/link";
import ConstellationMark from "./ConstellationMark";
import UserNav from "./UserNav";

export default function SiteHeader() {
  return (
    <header className="relative z-20 flex w-full items-center justify-between gap-4 px-6 py-4">
      <Link href="/" className="flex items-center gap-2 text-sm font-medium tracking-wide text-foreground/90">
        <ConstellationMark />
        <span>Constelații Familiale</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-foreground/70 sm:flex">
        <Link href="/chestionar" className="transition-colors hover:text-foreground">
          Chestionar
        </Link>
        <Link href="/harta" className="transition-colors hover:text-foreground">
          Tablă
        </Link>
        <Link href="/pachete" className="transition-colors hover:text-foreground">
          Pachete
        </Link>
      </nav>

      <UserNav />
    </header>
  );
}
