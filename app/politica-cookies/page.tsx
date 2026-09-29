import type { Metadata } from "next";
import LegalPage, { A, H2, UL } from "@/components/legal/LegalPage";
import { CookieSettingsLink } from "@/components/layout/CookieConsent";
import { LEGAL_LINKS, OPERATOR, SITE_NAME } from "@/lib/legal";

export const metadata: Metadata = {
  alternates: { canonical: "/politica-cookies" },
  title: `Politica de cookies — ${SITE_NAME}`,
  description: `Ce cookies și ce date locale folosește ${SITE_NAME} și cum îți poți schimba alegerea.`,
};

const ROWS: { name: string; category: string; provider: string; purpose: string; duration: string }[] = [
  {
    name: "authjs.session-token, __Secure-authjs.session-token",
    category: "Strict necesar",
    provider: SITE_NAME,
    purpose: "Menține autentificarea în cont.",
    duration: "Până la deconectare (maxim 30 de zile)",
  },
  {
    name: "authjs.csrf-token, __Host-authjs.csrf-token, authjs.callback-url",
    category: "Strict necesar",
    provider: SITE_NAME,
    purpose: "Protecție împotriva atacurilor CSRF și redirecționare după autentificare.",
    duration: "Sesiune",
  },
  {
    name: "cookie_consent",
    category: "Strict necesar",
    provider: SITE_NAME,
    purpose: "Memorează alegerea ta privind cookies (versiune, categorii, dată).",
    duration: "6 luni",
  },
  {
    name: "constelatii:questionnaire, constelatii:natalChart (sessionStorage)",
    category: "Strict necesar",
    provider: SITE_NAME,
    purpose: "Păstrează răspunsurile chestionarului și harta natală între pași, doar în browserul tău.",
    duration: "Până închizi fila",
  },
  {
    name: "_ga, _ga_*",
    category: "Statistici",
    provider: "Google Analytics 4 (Google Ireland Ltd.)",
    purpose: "Numărarea vizitelor și a paginilor vizitate, statistici agregate.",
    duration: "Până la 2 ani",
  },
  {
    name: "_md_vid (cookie și localStorage), _md_sid, _md_last (localStorage)",
    category: "Statistici",
    provider: `mydashboard.ro (${OPERATOR.name})`,
    purpose:
      "Identificator aleator de vizitator și de vizită, sursa traficului și legătura dintre vizită și o plată (ID-ul se transmite în metadatele plății Stripe doar cu acord).",
    duration: "_md_vid: 1 an; celelalte până le ștergi",
  },
  {
    name: "_ttp",
    category: "Marketing",
    provider: "TikTok Pixel (TikTok Technology Limited, Irlanda)",
    purpose:
      "Măsurarea eficienței reclamelor TikTok (ce vizite și plăți provin din reclame) și retargeting. Pot exista transferuri în afara UE, în baza clauzelor contractuale standard.",
    duration: "Aproximativ 13 luni",
  },
  {
    name: "_tt_enable_cookie",
    category: "Marketing",
    provider: "TikTok Pixel (TikTok Technology Limited, Irlanda)",
    purpose: "Verifică dacă browserul acceptă cookies pentru TikTok Pixel.",
    duration: "Aproximativ 13 luni",
  },
];

export default function CookiesPage() {
  return (
    <LegalPage title="Politica de cookies">
      <p>
        Cookies sunt fișiere mici pe care un site le salvează în browserul tău. Folosim și tehnologii similare
        (localStorage, sessionStorage). Această politică descrie ce folosim, în conformitate cu Legea nr. 506/2004 și
        GDPR. Operator: {OPERATOR.name} — detalii în <A href={LEGAL_LINKS.privacy}>Politica de confidențialitate</A>.
      </p>

      <H2>Categorii</H2>
      <UL>
        <li>
          <strong>Strict necesare</strong> — fără ele site-ul nu funcționează (autentificare, securitate, memorarea
          alegerii tale). Nu necesită consimțământ și nu pot fi dezactivate.
        </li>
        <li>
          <strong>Statistici (analitice)</strong> — ne ajută să înțelegem cum este folosit site-ul. Se încarcă doar
          dacă le accepți.
        </li>
        <li>
          <strong>Marketing / reclame</strong> — măsurarea eficienței reclamelor și afișarea de reclame relevante
          (TikTok Pixel). Se încarcă doar dacă le accepți și niciodată pe paginile de cont, autentificare sau plată
          (cu excepția confirmării unei plăți, când transmitem doar evenimentul de plată, fără date personale).
          Acordul pentru această categorie controlează și semnalele Google Consent Mode (ad_storage, ad_user_data,
          ad_personalization).
        </li>
      </UL>

      <H2>Ce folosim</H2>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5 text-foreground/60">
            <tr>
              <th className="p-3 font-medium">Nume</th>
              <th className="p-3 font-medium">Categorie</th>
              <th className="p-3 font-medium">Furnizor</th>
              <th className="p-3 font-medium">Scop</th>
              <th className="p-3 font-medium">Durată</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name} className="border-t border-white/10 align-top">
                <td className="p-3 font-mono text-xs">{r.name}</td>
                <td className="p-3">{r.category}</td>
                <td className="p-3">{r.provider}</td>
                <td className="p-3">{r.purpose}</td>
                <td className="p-3">{r.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Plata se face pe pagina Stripe Checkout (checkout.stripe.com), unde Stripe folosește propriile cookies
        necesare pentru plată și prevenirea fraudei, conform politicii Stripe. Pe site-ul nostru nu încărcăm
        scripturi Stripe.
      </p>

      <H2>Cum îți schimbi alegerea</H2>
      <p>
        Îți poți modifica sau retrage oricând consimțământul din{" "}
        <CookieSettingsLink className="text-accent underline-offset-2 hover:underline" /> (link disponibil și în
        subsolul fiecărei pagini). La retragere, ștergem cookies de statistici și de marketing (_ttp,
        _tt_enable_cookie) setate pe domeniul nostru și reîncărcăm pagina fără ele. Poți șterge cookies și din setările browserului.
      </p>
    </LegalPage>
  );
}
