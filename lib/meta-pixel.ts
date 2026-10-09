// Meta Pixel (datasetul „constelatii.com”) — se încarcă DOAR cu acord pentru categoria
// „Marketing / reclame”, niciodată pe localhost și niciodată pe paginile de cont,
// autentificare, plată sau admin (aceleași căi ca TikTok). Folosit doar din componente client.
// Cumpărarea pleacă și de pe server (lib/meta-capi.ts) cu același eventID = id-ul cumpărării.

import { isLocalHost } from "@/lib/consent";
import { isTikTokExcludedPath, marketingAccepted } from "@/lib/tiktok";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1588971046060899";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[] };

function fbq(): Fbq | undefined {
  return (window as unknown as { fbq?: Fbq }).fbq;
}

export const isMetaExcludedPath = isTikTokExcludedPath;

let loaded = false;
let revoked = false;
let pending: [string, Record<string, unknown>, string | undefined][] = [];

export function isMetaLoaded(): boolean {
  return loaded;
}

/* eslint-disable */
function injectBaseCode(f: any, b: Document, e: string, v: string) {
  if (f.fbq) return;
  var n: any = (f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = "2.0";
  n.queue = [];
  var t = b.createElement(e) as HTMLScriptElement;
  t.async = !0;
  t.src = v;
  var s = b.getElementsByTagName(e)[0];
  s.parentNode!.insertBefore(t, s);
}
/* eslint-enable */

/**
 * Încarcă pixelul (o singură dată pe durata paginii), doar cu acord pentru marketing.
 * `trackPage: false` — încărcare doar pentru un eveniment (ex. Purchase pe /cont?plata=succes).
 */
export function loadMetaPixel({ trackPage = true }: { trackPage?: boolean } = {}): boolean {
  if (typeof window === "undefined" || !META_PIXEL_ID || isLocalHost() || !marketingAccepted()) return false;
  if (loaded) {
    if (revoked) {
      fbq()?.("consent", "grant");
      revoked = false;
    }
    return true;
  }
  injectBaseCode(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  const f = fbq()!;
  f("consent", "grant");
  f("init", META_PIXEL_ID);
  if (trackPage) f("track", "PageView");
  loaded = true;
  revoked = false;
  const queued = pending;
  pending = [];
  for (const [event, params, eventId] of queued) {
    f("track", event, params, eventId ? { eventID: eventId } : undefined);
  }
  return true;
}

/** PageView la navigarea client-side (App Router). */
export function metaPage() {
  if (loaded && !revoked && marketingAccepted()) fbq()?.("track", "PageView");
}

/**
 * Eveniment standard Meta. Nu face nimic fără acord pentru marketing; dacă pixelul
 * nu e încă încărcat, evenimentul așteaptă încărcarea.
 */
export function trackMeta(event: string, params: Record<string, unknown> = {}, eventId?: string) {
  if (typeof window === "undefined" || isLocalHost() || !marketingAccepted()) return;
  if (loaded && !revoked) fbq()?.("track", event, params, eventId ? { eventID: eventId } : undefined);
  else if (!loaded) pending.push([event, params, eventId]);
}

/** La retragerea acordului: revocă și șterge cookies Meta (host + domeniul părinte). */
export function revokeMeta() {
  pending = [];
  if (loaded && !revoked) {
    fbq()?.("consent", "revoke");
    revoked = true;
  }
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of ["_fbp", "_fbc"]) {
    for (const d of domains) {
      document.cookie = `${name}=; path=/; max-age=0${d ? `; domain=${d}` : ""}`;
    }
  }
}
