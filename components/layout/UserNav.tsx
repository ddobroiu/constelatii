"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function UserNav() {
  const { data: session, status } = useSession();

  return (
    <nav className="relative z-20 flex w-full items-center justify-end gap-4 px-6 py-4 text-sm">
      {status === "loading" ? null : session?.user ? (
        <>
          <Link href="/cont" className="text-foreground/70 transition-colors hover:text-foreground">
            {session.user.name ?? session.user.email}
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-foreground/50 transition-colors hover:text-foreground"
          >
            Ieși din cont
          </button>
        </>
      ) : (
        <>
          <Link href="/autentificare" className="text-foreground/70 transition-colors hover:text-foreground">
            Autentificare
          </Link>
          <Link
            href="/inregistrare"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:bg-white/10"
          >
            Creează cont
          </Link>
        </>
      )}
    </nav>
  );
}
