// Adresa publică a site-ului, o singură sursă pentru robots, sitemap,
// metadataBase, JSON-LD și linkurile absolute (Stripe, referral).
//
// NEXT_PUBLIC_APP_URL se coace în bundle la build (inclusiv în codul de
// server), deci trebuie să existe la `npm run build` — vezi Dockerfile.
// Fallback-ul e domeniul de producție, nu localhost: un build fără variabilă
// nu mai publică `http://localhost:3000` în robots.txt și sitemap.xml.
// Local, .env.local setează http://localhost:3000.
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://constelatii.com").replace(/\/+$/, "");
