// Meta Conversions API (server): „Purchase” după o plată confirmată, complementar
// pixelului din browser (lib/meta-pixel.ts). Se trimite DOAR dacă cumpărătorul a
// acceptat cookies de marketing la crearea plății: acordul, _fbp, _fbc, IP-ul și
// browserul călătoresc în metadatele sesiunii Stripe (metaCheckoutMetadata) și se
// citesc la creditare (sendMetaPurchase). Fără acord sau fără META_CAPI_ACCESS_TOKEN
// nu pleacă nimic. Deduplicat cu pixelul prin event_id = id-ul cumpărării
// (components/account/MetaPurchase.tsx). Datele personale pleacă doar SHA-256.
// Nu aruncă niciodată, timeout 8 s; erorile se loghează.
import { createHash } from "node:crypto";
import { toE164 } from "@/lib/tiktok-events";

const API_VERSION = "v21.0";
const DEFAULT_PIXEL_ID = "1588971046060899";

// chei în metadatele Stripe (valori max. 500 caractere)
const META = { consent: "fb_consent", fbp: "fb_fbp", fbc: "fb_fbc", ip: "fb_ip", ua: "fb_ua" } as const;

export function metaPixelId(): string {
  return process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_PIXEL_ID;
}

function clean(value: string | null | undefined, max: number): string | undefined {
  const v = (value ?? "").trim();
  return v ? v.slice(0, max) : undefined;
}

/** Metadate pentru sesiunea Stripe; goale fără acord de marketing. */
export function metaCheckoutMetadata(input: {
  marketing: boolean;
  fbp?: string | null;
  fbc?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}): Record<string, string> {
  if (!input.marketing) return {};
  const meta: Record<string, string> = { [META.consent]: "1" };
  const fbp = clean(input.fbp, 200);
  const fbc = clean(input.fbc, 500);
  const ip = clean(input.ip, 64);
  const ua = clean(input.userAgent, 500);
  if (fbp) meta[META.fbp] = fbp;
  if (fbc) meta[META.fbc] = fbc;
  if (ip) meta[META.ip] = ip;
  if (ua) meta[META.ua] = ua;
  return meta;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export interface MetaPurchase {
  /** Același id ca eventID-ul din browser (id-ul cumpărării). */
  eventId: string;
  value: number;
  currency: string;
  contentIds: string[];
  pageUrl?: string;
  email?: string | null;
  phone?: string | null;
  externalId?: string | null;
  metadata?: Record<string, string> | null;
  eventTime?: number;
}

export function buildMetaPurchasePayload(p: MetaPurchase): Record<string, unknown> {
  const m: Record<string, string> = p.metadata ?? {};
  const user: Record<string, unknown> = {};
  const email = p.email?.trim().toLowerCase();
  if (email) user.em = [sha256(email)];
  const phone = toE164(p.phone);
  if (phone) user.ph = [sha256(phone.replace(/^\+/, ""))];
  if (p.externalId) user.external_id = [sha256(String(p.externalId))];
  if (m[META.ip]) user.client_ip_address = m[META.ip];
  if (m[META.ua]) user.client_user_agent = m[META.ua];
  if (m[META.fbp]) user.fbp = m[META.fbp];
  if (m[META.fbc]) user.fbc = m[META.fbc];

  const event: Record<string, unknown> = {
    event_name: "Purchase",
    event_time: p.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: p.eventId,
    action_source: "website",
    user_data: user,
    custom_data: {
      currency: p.currency.toUpperCase(),
      value: Math.round(p.value * 100) / 100,
      content_type: "product",
      content_ids: p.contentIds,
      order_id: p.eventId,
    },
  };
  if (p.pageUrl) event.event_source_url = p.pageUrl;
  const body: Record<string, unknown> = { data: [event] };
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;
  return body;
}

/** Trimite Purchase. Nu face nimic fără token sau fără acordul din metadate. Nu aruncă. */
export async function sendMetaPurchase(p: MetaPurchase): Promise<boolean> {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token || p.metadata?.[META.consent] !== "1") return false;
  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${metaPixelId()}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildMetaPurchasePayload(p)),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (res.ok) return true;
    const data = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    console.error("[meta-capi] Purchase rejected:", p.eventId, res.status, data?.error?.message ?? "");
  } catch (error: unknown) {
    console.error("[meta-capi] Purchase failed:", p.eventId, error instanceof Error ? error.message : error);
  }
  return false;
}
