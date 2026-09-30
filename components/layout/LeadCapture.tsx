"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { CONSENT_COOKIE, parseConsent } from "@/lib/consent";
import { LEGAL_LINKS } from "@/lib/legal";
import { LEAD_CONSENT_TEXT } from "@/lib/lifecycle/consent";

/**
 * Oferta pentru vizitatorii fără cont: ghidul primei constelații pe e-mail —
 * pașii reali ai fluxului gratuit (pregătire, chestionar, tablă, interpretarea
 * inițială) și linkul de unde îl încep, când au liniște.
 *
 * O singură dată pe browser: după 30 de secunde pe pagină sau când mouse-ul
 * pleacă spre bara de adrese. Nu pentru cei autentificați, nu în fluxul
 * constelației, pe cont, plată sau autentificare, și nu peste bannerul de
 * cookies. Închiderea se ține minte în localStorage (dacă browserul îl permite).
 */

const STORAGE_KEY = "cf_lead_offer";
const DELAY_MS = 30_000;
const EXCLUDED = ["/cont", "/autentificare", "/inregistrare", "/pachete", "/dezabonare", "/chestionar", "/harta"];

function remembered(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function remember(value: "closed" | "sent") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // stocare blocată: nimic de făcut
  }
}

function cookieAnswered(): boolean {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
    return parseConsent(match?.[1]) !== null;
  } catch {
    return false;
  }
}

const INPUT =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent";

export default function LeadCapture() {
  const pathname = usePathname();
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const excluded = EXCLUDED.some((p) => pathname.startsWith(p)) || status !== "unauthenticated";

  useEffect(() => {
    if (excluded || remembered()) return;
    let shown = false;
    const startedAt = Date.now();

    function show() {
      if (shown || remembered() || !cookieAnswered()) return;
      shown = true;
      setOpen(true);
    }

    const timer = window.setTimeout(show, DELAY_MS);
    function onLeave(event: MouseEvent) {
      if (event.clientY <= 0 && !event.relatedTarget && Date.now() - startedAt > 5_000) show();
    }
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [excluded]);

  if (!open || excluded) return null;

  function close() {
    remember(sent ? "sent" : "closed");
    setOpen(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("Bifează acordul ca să-ți putem trimite ghidul.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, consent, website, source: pathname }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Ceva n-a mers. Încearcă din nou.");
      }
      remember("sent");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ceva n-a mers. Încearcă din nou.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-labelledby="lead-title"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-2xl border border-white/10 bg-background/95 p-5 text-sm shadow-2xl backdrop-blur sm:right-6 sm:left-auto sm:mx-0"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Închide"
        className="absolute top-3 right-3 rounded-full px-2 text-lg leading-none text-foreground/50 hover:text-foreground"
      >
        ×
      </button>

      {sent ? (
        <>
          <p id="lead-title" className="text-base font-medium text-foreground">
            Verifică e-mailul.
          </p>
          <p className="mt-2 text-foreground/60">
            Ghidul e pe drum. Dacă nu apare în câteva minute, uită-te și în dosarul de mesaje nedorite.
          </p>
        </>
      ) : (
        <form onSubmit={submit}>
          <p id="lead-title" className="pr-6 text-base font-medium text-foreground">
            Prima ta constelație, pas cu pas
          </p>
          <p className="mt-2 text-foreground/60">
            Îți trimitem pe e-mail pașii primei constelații — pregătirea, chestionarul, tabla — și linkul de unde o
            începi când ai liniște. Interpretarea inițială e gratuită.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <input
              type="text"
              autoComplete="given-name"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Prenumele (opțional)"
              aria-label="Prenumele"
              className={INPUT}
            />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresa@exemplu.ro"
              aria-label="Adresa de email"
              className={INPUT}
            />
            {/* capcană pentru roboți, ascunsă oamenilor */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              name="website"
            />
          </div>
          <label className="mt-3 flex items-start gap-2 text-xs text-foreground/60">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 shrink-0 accent-accent"
            />
            <span>
              {LEAD_CONSENT_TEXT} Detalii în{" "}
              <Link href={LEGAL_LINKS.privacy} target="_blank" className="text-accent hover:underline">
                Politica de confidențialitate
              </Link>
              .
            </span>
          </label>
          {error && <p className="mt-2 text-xs text-red-300/80">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Un moment…" : "Trimite-mi ghidul"}
          </button>
        </form>
      )}
    </div>
  );
}
