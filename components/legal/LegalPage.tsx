import type { ReactNode } from "react";
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSION } from "@/lib/legal";

/** Cadrul comun al paginilor legale: titlu, versiune, dată, text lizibil. */
export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col items-center px-6 py-16">
      <article className="relative z-10 flex w-full max-w-3xl flex-col gap-4 text-foreground/80">
        <header className="mb-4 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-foreground/50">
            Versiunea {LEGAL_VERSION}, în vigoare de la {LEGAL_EFFECTIVE_DATE}
          </p>
        </header>
        {children}
      </article>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-6 text-xl font-semibold text-foreground">{children}</h2>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-1.5 pl-6">{children}</ul>;
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className="text-accent underline-offset-2 hover:underline"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
