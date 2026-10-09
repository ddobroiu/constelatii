// TikTok Pixel — se încarcă DOAR cu acord pentru categoria „Marketing / reclame”
// din bannerul de cookies și niciodată pe paginile de cont, autentificare,
// plată sau admin. Folosit doar din componente client.

import { CONSENT_COOKIE, isLocalHost, parseConsent } from "@/lib/consent";

export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "DATG4B3C77U0AVP512Q0";

/** Căi pe care pixelul nu se încarcă (cont, autentificare, plată, admin, API). */
export const TIKTOK_EXCLUDED_PATHS = [
  "/admin",
  "/dashboard",
  "/cont",
  "/autentificare",
  "/inregistrare",
  "/login",
  "/register",
  "/checkout",
  "/plata",
  "/api",
];

export function isTikTokExcludedPath(pathname: string): boolean {
  return TIKTOK_EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ttq = any;

function ttq(): Ttq | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ttq;
}

// tt_ttclid: id-ul de click TikTok din URL-ul unei reclame, păstrat (doar cu acord pentru
// marketing) ca plata să-l poată trimite prin Events API (lib/tiktok-events.ts, server)
const TTCLID_COOKIE = "tt_ttclid";
const TIKTOK_COOKIES = ["_ttp", "_tt_enable_cookie", TTCLID_COOKIE];

/** Păstrează ?ttclid= din URL 30 de zile (apelat doar cu acord pentru marketing). */
function captureTtclid() {
  try {
    const ttclid = new URLSearchParams(location.search).get("ttclid");
    if (ttclid && ttclid.length <= 500) {
      document.cookie = `${TTCLID_COOKIE}=${encodeURIComponent(ttclid)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    }
  } catch {
    /* nu strică niciodată pagina */
  }
}

let loaded = false;
let revoked = false;
let pending: [string, Record<string, unknown>][] = [];

/** Acordul pentru marketing, citit din cookie-ul de consimțământ. */
export function marketingAccepted(): boolean {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
    return parseConsent(match?.[1])?.marketing === true;
  } catch {
    return false;
  }
}

export function isTikTokLoaded(): boolean {
  return loaded;
}

/* eslint-disable */
function injectBaseCode(w: any, d: Document, t: string) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t: any,e: any){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t: any){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e: any,n: any){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
}
/* eslint-enable */

/**
 * Încarcă pixelul (o singură dată pe durata paginii), doar cu acord pentru marketing.
 * `trackPage: false` — încărcare doar pentru un eveniment (ex. CompletePayment pe
 * /cont?plata=succes), fără page view pe o pagină exclusă.
 */
export function loadTikTok({ trackPage = true }: { trackPage?: boolean } = {}): boolean {
  if (typeof window === "undefined" || isLocalHost() || !marketingAccepted()) return false;
  captureTtclid();
  if (loaded) {
    if (revoked) {
      ttq()?.grantConsent();
      revoked = false;
    }
    return true;
  }
  injectBaseCode(window, document, "ttq");
  const t = ttq();
  t.holdConsent();
  t.load(TIKTOK_PIXEL_ID);
  if (trackPage) t.page();
  t.grantConsent();
  loaded = true;
  revoked = false;
  const queued = pending;
  pending = [];
  for (const [event, params] of queued) t.track(event, params);
  return true;
}

/** Page view la navigarea client-side (App Router). */
export function tiktokPage() {
  if (loaded && !revoked && marketingAccepted()) ttq()?.page();
}

/**
 * Eveniment TikTok. Nu face nimic fără acord pentru marketing; dacă pixelul nu e
 * încă încărcat, evenimentul așteaptă încărcarea (pe paginile excluse nu pleacă).
 */
export function trackTikTok(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !marketingAccepted()) return;
  if (loaded && !revoked) ttq()?.track(event, params);
  else if (!loaded) pending.push([event, params]);
}

/** La retragerea acordului: revocă și șterge cookies TikTok (host + domeniul părinte). */
export function revokeTikTok() {
  pending = [];
  if (loaded && !revoked) {
    ttq()?.revokeConsent();
    revoked = true;
  }
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of TIKTOK_COOKIES) {
    for (const d of domains) {
      document.cookie = `${name}=; path=/; max-age=0${d ? `; domain=${d}` : ""}`;
    }
  }
}
