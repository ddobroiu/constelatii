// Fără importuri de server — se folosește și în formularele din browser.

/** Doar căi relative de pe același site („/cont”), niciodată „//alt-site” sau URL-uri absolute. */
export function safeRedirect(value: string | null | undefined, fallback = "/cont"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if ([...value].some((c) => c.charCodeAt(0) < 32 || c === "\\")) return fallback;
  return value;
}
