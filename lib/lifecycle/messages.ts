import type { Pack } from "@/lib/billing/packs";
import { SITE_URL } from "@/lib/site";

import type { Message } from "./send";
import type { UserSnapshot } from "./snapshot";

/**
 * Textele e-mailurilor din ciclul de viață.
 *
 * Nimic inventat: nici rezultate, nici cifre, nici mărturii. Tot ce e personal
 * vine din bază (`UserSnapshot`). Nu promitem vindecare, deblocare sau
 * schimbare garantată: constelația e un instrument de auto-reflecție, nu
 * terapie. Fără reduceri și fără grabă.
 */

const START = () => `${SITE_URL}/chestionar`;
const ACCOUNT = () => `${SITE_URL}/cont`;
const SIGNUP = () => `${SITE_URL}/inregistrare`;

const lei = new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** Prenumele din „Nume”: primul cuvânt, curățat. */
function firstName(name: string | null | undefined): string {
  return (name ?? "").trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
}

function hello(name: string | null | undefined, text: string): string {
  const n = firstName(name);
  return n ? `${text}, ${n}.` : `${text}.`;
}

function credits(n: number): string {
  return n === 1 ? "un credit" : `${n} credite`;
}

const STEPS = [
  "1. Pregătirea: câteva minute de liniște, cu telefonul pe silențios (ai un ecran cu cronometru pentru asta).",
  "2. Chestionarul: pe ce relație sau situație vrei să te uiți și ce te frământă acum.",
  "3. Tabla: adaugi figurile — tu, un părinte, un partener —, le așezi la distanța pe care o simți real și le arăți încotro privesc.",
  "4. Interpretarea inițială, gratuită, despre ce ai așezat.",
];

const MARKETING_FOOTNOTE =
  "Primești acest e-mail pentru că ți-ai creat un cont pe constelatii.com. Te poți dezabona oricând, cu linkul de mai jos; contul rămâne neatins.";

const LEAD_FOOTNOTE =
  "Primești acest e-mail pentru că ai cerut ghidul primei constelații pe constelatii.com. Te poți dezabona oricând, cu linkul de mai jos.";

// ---------------------------------------------------------------- cont

export function welcomeMessage(name: string | null): Message {
  return {
    subject: "Bine ai venit la Constelații Familiale",
    heading: hello(name, "Bine ai venit"),
    paragraphs: [
      "Contul tău e gata. Primul pas e prima ta constelație. Nu cere nimic pregătit dinainte, iar interpretarea inițială e gratuită.",
      ...STEPS,
      "Constelația se salvează în cont, ca s-o poți relua oricând. Raportul complet al unei constelații se deblochează cu un credit, dacă vrei să mergi mai departe.",
    ],
    cta: { label: "Începe prima constelație", url: START() },
    footnote:
      "Primești acest mesaj pentru că ți-ai creat un cont pe constelatii.com. Dacă n-ai fost tu, răspunde la acest e-mail și ștergem contul.",
  };
}

/** Ziua 1, doar dacă n-a salvat încă nicio constelație. */
export function day1Message(name: string | null): Message {
  return {
    subject: "Prima ta constelație, pas cu pas",
    heading: hello(name, "Prima constelație te așteaptă"),
    paragraphs: [
      "Ți-ai făcut contul ieri, dar încă n-ai așezat nicio constelație. Iată cum arată, concret:",
      ...STEPS,
      "Un sfat: așază figurile după ce simți, nu după cum „ar trebui” să fie. Nu există o așezare corectă — doar una sinceră.",
    ],
    cta: { label: "Începe acum", url: START() },
    footnote: MARKETING_FOOTNOTE,
  };
}

/** Ziua 3: ce a făcut, din date reale, și ce poate urma. */
export function day3Message(name: string | null, s: UserSnapshot): Message {
  const paragraphs: string[] = [];

  if (s.constellations === 0) {
    paragraphs.push(
      "Încă n-ai salvat nicio constelație. Dacă te întrebi ce aduce: tabla îți arată cum așezi, fără cuvinte, oamenii din jurul unei situații — cine e aproape, cine e departe, cine privește în altă parte. Interpretarea inițială numește ce ai așezat deja intuitiv.",
      "E un exercițiu de auto-reflecție: o oglindă, nu un verdict.",
    );
  } else {
    paragraphs.push(
      s.constellations === 1
        ? "Ai salvat o constelație în cont."
        : `Ai salvat ${s.constellations} constelații în cont.`,
    );
    if (s.unlocked === 0) {
      paragraphs.push(
        "Ce poți face acum: recitește interpretarea inițială la câteva zile distanță — ce ți se pare altfel? Poți face și o constelație nouă pe aceeași temă, ca să vezi dacă așezarea s-a schimbat.",
        s.credits > 0
          ? `Ai ${credits(s.credits)} în cont: îl poți folosi pentru raportul complet al oricărei constelații salvate.`
          : "Dacă vrei mai mult decât interpretarea inițială, raportul complet al unei constelații se deblochează cu un credit.",
      );
    } else {
      paragraphs.push(
        s.unlocked === 1
          ? "Ai deblocat raportul complet al uneia dintre ele. Merită recitit la câteva zile distanță: ce ai observat între timp?"
          : `Ai deblocat rapoartele complete pentru ${s.unlocked} dintre ele. Merită recitite la câteva zile distanță: ce ai observat între timp?`,
      );
    }
  }

  return {
    subject: s.constellations > 0 ? "Constelațiile tale, câteva zile mai târziu" : "Ce arată o constelație",
    heading: hello(name, "Salut din nou"),
    paragraphs,
    cta: s.constellations > 0 ? { label: "Deschide contul", url: ACCOUNT() } : { label: "Începe o constelație", url: START() },
    footnote: MARKETING_FOOTNOTE,
  };
}

/** Ziua 7, doar fără nicio plată: pachetele, cu prețurile reale din bază. */
export function day7Message(name: string | null, packs: Pack[]): Message {
  const lines = packs.map(
    (p) =>
      `${p.name} — ${lei.format(p.priceCents / 100)} lei: ${credits(p.credits)}${
        p.credits > 1 ? ` (${lei.format(p.priceCents / p.credits / 100)} lei/credit)` : ""
      }.`,
  );
  return {
    subject: "Raportul complet: cum funcționează creditele",
    heading: hello(name, "Dacă vrei să mergi mai departe"),
    paragraphs: [
      "Interpretarea inițială rămâne gratuită, pentru orice constelație. Un credit deblochează raportul complet al unei constelații — pe orice temă: bani, relații, rolul de părinte.",
      ...lines,
      "Plătești o singură dată, fără abonament, iar creditele nu expiră. Prețul e final; furnizorul nu este plătitor de TVA.",
      "Dacă acum nu e momentul, nu e nimic de făcut: constelațiile tale rămân salvate în cont.",
    ],
    cta: { label: "Vezi pachetele", url: `${SITE_URL}/pachete` },
    footnote: MARKETING_FOOTNOTE,
  };
}

/** A doua zi după plată: cum folosești creditele. */
export function postPurchaseMessage(name: string | null, s: UserSnapshot): Message {
  return {
    subject: s.lastPack ? `Cum folosești „${s.lastPack}”` : "Cum folosești creditele",
    heading: hello(name, "Câteva lucruri care ajută"),
    paragraphs: [
      `Acum ai ${credits(s.credits)} în cont. Creditele nu expiră.`,
      s.constellations > s.unlocked
        ? "Pentru o constelație deja salvată: deschide-o din cont și alege deblocarea raportului complet. Un credit, o constelație."
        : "Pentru un raport complet ai nevoie de o constelație salvată: fă una nouă, iar după interpretarea inițială o deblochezi din cont.",
      "Citește raportul în liniște, nu între două sarcini, și revino la el după câteva zile. Ce te atinge la a doua citire spune adesea mai mult decât prima impresie.",
      "Dacă ce apare redeschide ceva greu, un specialist cu care să vorbești direct e pasul potrivit — constelația de aici e un instrument de auto-reflecție, nu terapie.",
      "Ai o întrebare despre credite sau plată? Răspunde la acest e-mail.",
    ],
    cta: { label: "Deschide contul", url: ACCOUNT() },
    footnote: MARKETING_FOOTNOTE,
  };
}

/** O singură dată, după 30 de zile fără activitate. */
export function reengageMessage(name: string | null, s: UserSnapshot): Message {
  const paragraphs: string[] = [];
  if (s.constellations > 0) {
    paragraphs.push(
      s.constellations === 1
        ? "Constelația ta e salvată în cont, unde ai lăsat-o."
        : `Cele ${s.constellations} constelații ale tale sunt salvate în cont, unde le-ai lăsat.`,
      "Uneori ajută să faci din nou aceeași constelație după o vreme: dacă așezarea s-a schimbat, e un lucru de observat.",
    );
  } else {
    paragraphs.push(
      "Contul tău e aici, dar prima constelație n-a pornit încă. Nu cere nimic pregătit dinainte, iar interpretarea inițială e gratuită.",
    );
  }
  if (s.credits > 0) paragraphs.push(`Ai ${credits(s.credits)} nefolosite în cont; nu expiră.`);
  paragraphs.push("Fără presiune. Acesta e singurul e-mail de acest fel pe care ți-l trimitem.");

  return {
    subject: "Constelațiile tale sunt unde le-ai lăsat",
    heading: hello(name, "Salut din nou"),
    paragraphs,
    cta: s.constellations > 0 ? { label: "Deschide contul", url: ACCOUNT() } : { label: "Începe o constelație", url: START() },
    footnote: MARKETING_FOOTNOTE,
  };
}

// ---------------------------------------------------------------- vizitatori

export function leadWelcomeMessage(name: string | null): Message {
  return {
    subject: "Ghidul primei tale constelații",
    heading: hello(name, "Prima constelație, pas cu pas"),
    paragraphs: [
      "Ai cerut ghidul primei constelații. Iată cum decurge, pe constelatii.com:",
      ...STEPS,
      "Chestionarul, tabla și interpretarea inițială sunt gratuite și nu cer cont. Contul (tot gratuit) îți salvează constelația, ca s-o poți relua.",
      "Alege un moment liniștit, nu între două sarcini: diferența dintre „cred că” și „simt că” se aude doar când încetinești.",
    ],
    cta: { label: "Începe prima constelație", url: START() },
    footnote: LEAD_FOOTNOTE,
  };
}

export function leadFollowupMessage(name: string | null): Message {
  return {
    subject: "Constelația ta, salvată",
    heading: hello(name, "Ai apucat să o faci?"),
    paragraphs: [
      "Acum trei zile ți-am trimis pașii primei constelații. Dacă ai făcut-o, o poți păstra: cu un cont gratuit, constelațiile se salvează și le poți relua oricând.",
      "Dacă n-ai apucat, e în regulă — pașii sunt aceiași, iar interpretarea inițială rămâne gratuită.",
      "Nu este terapie; e un instrument de auto-reflecție.",
      "Acesta e ultimul e-mail pe care ți-l trimitem despre ghid.",
    ],
    cta: { label: "Creează un cont gratuit", url: SIGNUP() },
    footnote: LEAD_FOOTNOTE,
  };
}
