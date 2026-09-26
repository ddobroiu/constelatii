"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
  OPEN_CONSENT_EVENT,
  parseConsent,
  serializeConsent,
  type ConsentState,
} from "@/lib/consent";
import { LEGAL_LINKS } from "@/lib/legal";

const GA_ID = "G-8CD8R3GESM";
const MYDASHBOARD_SITE = "e042bf6033475cf2";

type Gtag = (...args: unknown[]) => void;

function readConsent(): ConsentState | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
    return parseConsent(match?.[1]);
  } catch {
    return null;
  }
}

function writeConsent(state: ConsentState) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(state)}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
}

function gtag(...args: unknown[]) {
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.(...args);
}

function injectScript(id: string, src: string, attrs: Record<string, string> = {}) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.appendChild(s);
}

/** Încarcă scripturile non-esențiale doar pentru categoriile acceptate. */
function applyConsent(state: ConsentState) {
  gtag("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
  });
  if (state.analytics) {
    // Google Analytics 4 (proprietatea „Constelatii.com”)
    if (!document.getElementById("ga4-gtag")) {
      gtag("js", new Date());
      gtag("config", GA_ID);
      injectScript("ga4-gtag", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
    }
    // mydashboard.ro: vizite, surse de trafic și legătura cu plățile
    injectScript("mydashboard-tracker", "https://mydashboard.ro/t.js", { "data-site": MYDASHBOARD_SITE });
  }
}

/** La retragerea acordului: șterge ce au lăsat în urmă scripturile de statistici. */
function clearAnalyticsStorage() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name === "_md_vid" || name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      for (const d of domains) {
        document.cookie = `${name}=; path=/; max-age=0${d ? `; domain=${d}` : ""}`;
      }
    }
  }
  try {
    for (const k of ["_md_vid", "_md_sid", "_md_last"]) localStorage.removeItem(k);
  } catch {
    /* storage indisponibil */
  }
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [current, setCurrent] = useState<ConsentState | null>(null);

  useEffect(() => {
    const saved = readConsent();
    /* eslint-disable react-hooks/set-state-in-effect -- starea vine din cookie, disponibil doar în browser */
    setCurrent(saved);
    if (saved) {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
      applyConsent(saved);
    } else {
      setOpen(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    function reopen() {
      const s = readConsent();
      setAnalytics(s?.analytics ?? false);
      setMarketing(s?.marketing ?? false);
      setShowDetails(true);
      setOpen(true);
    }
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const save = useCallback(
    (next: { analytics: boolean; marketing: boolean }) => {
      const state: ConsentState = { v: CONSENT_VERSION, ...next, ts: Date.now() };
      writeConsent(state);
      const withdrew = (current?.analytics && !next.analytics) || (current?.marketing && !next.marketing);
      setCurrent(state);
      setOpen(false);
      setShowDetails(false);
      if (withdrew) {
        clearAnalyticsStorage();
        // scripturile deja încărcate nu se pot descărca: reîncărcăm pagina fără ele
        window.location.reload();
        return;
      }
      if (!next.analytics) clearAnalyticsStorage();
      applyConsent(state);
    },
    [current],
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-background/95 p-5 text-sm shadow-2xl backdrop-blur">
        <h2 id="cookie-consent-title" className="text-base font-medium text-foreground">
          Cookies și confidențialitate
        </h2>
        <p className="mt-2 text-foreground/70">
          Folosim cookies strict necesare pentru funcționarea site-ului (autentificare, securitate, salvarea
          alegerii tale). Cu acordul tău, folosim și cookies de statistici (Google Analytics, mydashboard.ro) ca să
          înțelegem cum este folosit site-ul. Detalii în{" "}
          <Link href={LEGAL_LINKS.cookies} className="text-accent underline-offset-2 hover:underline">
            Politica de cookies
          </Link>
          .
        </p>

        {showDetails && (
          <fieldset className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <legend className="sr-only">Categorii de cookies</legend>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked disabled className="mt-1 accent-accent" />
              <span>
                <span className="font-medium text-foreground">Strict necesare</span>
                <span className="block text-xs text-foreground/50">
                  Autentificare, securitate, memorarea acestei alegeri. Mereu active.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 accent-accent"
              />
              <span>
                <span className="font-medium text-foreground">Statistici (analitice)</span>
                <span className="block text-xs text-foreground/50">
                  Google Analytics 4 și mydashboard.ro — pagini vizitate, sursa vizitei, legătura cu plățile.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 accent-accent"
              />
              <span>
                <span className="font-medium text-foreground">Marketing</span>
                <span className="block text-xs text-foreground/50">
                  Măsurarea campaniilor publicitare Google. În prezent nu folosim pixeli de reclame.
                </span>
              </span>
            </label>
          </fieldset>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {showDetails ? (
            <button
              type="button"
              onClick={() => save({ analytics, marketing })}
              className="rounded-full border border-white/10 px-5 py-2 text-foreground/80 transition-colors hover:bg-white/10"
            >
              Salvează alegerea
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="rounded-full border border-white/10 px-5 py-2 text-foreground/80 transition-colors hover:bg-white/10"
            >
              Setări
            </button>
          )}
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            className="rounded-full border border-white/10 px-5 py-2 text-foreground/80 transition-colors hover:bg-white/10"
          >
            Refuză
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true })}
            className="rounded-full bg-accent px-5 py-2 font-medium text-background transition-colors hover:bg-accent-soft"
          >
            Accept toate
          </button>
        </div>
      </div>
    </div>
  );
}

/** Link-ul „Setări cookies” din footer: redeschide bannerul. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className={className}
    >
      Setări cookies
    </button>
  );
}
