import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/legal";

/**
 * „Continuă cu Google”: un link simplu spre /api/auth/google (care pornește
 * fluxul OAuth). Buton alb cu „G”-ul Google, conform regulilor de brand Google.
 */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
      <path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.74Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

export default function GoogleButton({ redirect, refCode }: { redirect: string; refCode?: string }) {
  const params = new URLSearchParams({ redirect });
  if (refCode) params.set("ref", refCode);

  return (
    <div className="flex flex-col gap-4">
      {/* <a>, nu <Link>: ruta API trimite mai departe la Google, fără prefetch. */}
      <a
        href={`/api/auth/google?${params.toString()}`}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-[#747775] bg-white px-6 py-2.5 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#f2f2f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <GoogleIcon />
        Continuă cu Google
      </a>
      <p className="text-center text-[11px] leading-relaxed text-foreground/40">
        Continuând cu Google, confirmi că ai cel puțin 18 ani și ești de acord cu{" "}
        <Link href={LEGAL_LINKS.terms} target="_blank" className="text-accent hover:underline">
          Termenii și condițiile
        </Link>{" "}
        și că ai citit{" "}
        <Link href={LEGAL_LINKS.privacy} target="_blank" className="text-accent hover:underline">
          Politica de confidențialitate
        </Link>
        .
      </p>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase text-foreground/40">sau</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}
