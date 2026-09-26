// Consimțământul pentru cookies, păstrat într-un cookie first-party ca să-l
// poată citi și serverul (ex. /api/checkout nu trimite ID-ul de vizitator
// mydashboard către Stripe fără acord pentru statistici).

export const CONSENT_COOKIE = "cookie_consent";
/** Crește când se schimbă categoriile — alegerile vechi se cer din nou. */
export const CONSENT_VERSION = 1;
/** 6 luni, apoi întrebăm din nou. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
/** Evenimentul pe care îl emite linkul „Setări cookies” din footer. */
export const OPEN_CONSENT_EVENT = "open-cookie-settings";

export interface ConsentState {
  v: number;
  analytics: boolean;
  marketing: boolean;
  /** ms since epoch */
  ts: number;
}

export function parseConsent(raw: string | null | undefined): ConsentState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>;
    if (data.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      analytics: data.analytics === true,
      marketing: data.marketing === true,
      ts: Number(data.ts) || 0,
    };
  } catch {
    return null;
  }
}

export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}

/** Citește un cookie dintr-un header `Cookie` (server). */
export function readCookieHeader(header: string | null, name: string): string | null {
  for (const part of (header ?? "").split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name && v.length) return v.join("=");
  }
  return null;
}
