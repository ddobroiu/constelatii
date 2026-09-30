import { administrativeUnitPhrase, type County } from "./counties";

/**
 * Content for a county page is assembled from real facts (name, seat, region)
 * combined with rotating phrasing variants, rather than one fixed template
 * with only the county name swapped — the goal is genuine lexical variation
 * across all 42 pages, grounded in facts that are actually true per county
 * (nothing about local presence is invented, since the service is 100% online).
 */

const INTRO_VARIANTS: ((c: County) => string)[] = [
  (c) =>
    `Dacă ești din ${c.name} — ${c.seat} sau oricare altă localitate din județ — poți face o constelație familială completă online, fără să te deplasezi nicăieri. Serviciul e disponibil în toată România, inclusiv în regiunea ${c.region}.`,
  (c) =>
    `Locuiești în ${administrativeUnitPhrase(c)}? Constelația familială digitală funcționează identic, indiferent unde te afli — de la ${c.seat} până în cea mai mică localitate din regiunea ${c.region}. Tot ce ai nevoie e o conexiune la internet și 15-20 de minute.`,
  (c) =>
    `Pentru cineva din ${c.name}, accesul la un exercițiu de autocunoaștere precum constelațiile familiale înseamnă, de obicei, drum până la ${c.seat} sau chiar mai departe. Varianta online elimină complet acest obstacol — participi din orice colț al județului, oricând.`,
  (c) =>
    `Constelațiile familiale online sunt gândite exact pentru situații ca a ta, din ${c.name}: nu ai nevoie de un facilitator fizic aproape, nici de programare cu săptămâni înainte. Construiești tabla, completezi chestionarul, primești interpretarea — de acasă, din ${c.seat} sau oriunde altundeva în regiunea ${c.region}.`,
];

const AVAILABILITY_VARIANTS: ((c: County) => string[])[] = [
  (c) => [
    `Aplicația e complet online — nu există un birou fizic în ${c.seat} sau altundeva, și asta e intenționat. Metoda funcționează la fel de bine la distanță, pentru că tot ce contează e configurația pe care o construiești tu, nu prezența fizică a unui facilitator lângă tine.`,
    `Practic, diferența față de o ședință clasică de constelații (în grup, cu reprezentanți umani) e că tu ești cel care plasează figurile pe tablă, iar interpretarea vine de la un model AI antrenat pe principiile metodei — nu de la un facilitator uman. Avantajul: acces imediat, fără cost de deplasare din ${c.name} și fără programare.`,
  ],
  (c) => [
    `Nu promitem practicieni locali în ${c.name} — am prefera să fim onești: serviciul e 100% online, identic indiferent din ce județ te conectezi. Ce câștigi în schimb e accesul imediat, fără listă de așteptare.`,
    `Pentru locuitorii din regiunea ${c.region}, asta înseamnă că nu mai contează cât de aproape sau departe ești de un centru cu terapeuți specializați — construiești constelația de pe telefon sau laptop, oricând ai timp.`,
  ],
];

const NEIGHBOR_SECTION_HEADING = "Căutat și în județele învecinate";

export interface CountySection {
  heading: string;
  body: string[];
}

export interface CountyFaq {
  question: string;
  answer: string;
}

export interface CountyContent {
  intro: string[];
  sections: CountySection[];
  faq: CountyFaq[];
}

function variantIndex(county: County, poolSize: number, salt: number): number {
  // Deterministic per-county index (not random) so content is stable across builds.
  const base = county.slug.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return (base + salt) % poolSize;
}

export function buildCountyContent(county: County): CountyContent {
  const intro = INTRO_VARIANTS[variantIndex(county, INTRO_VARIANTS.length, 0)](county);
  const availabilityBody = AVAILABILITY_VARIANTS[variantIndex(county, AVAILABILITY_VARIANTS.length, 7)](county);

  return {
    intro: [intro],
    sections: [
      {
        heading: `Cum funcționează pentru cineva din ${county.name}`,
        body: availabilityBody,
      },
      {
        heading: "Ce construiești, practic",
        body: [
          `Răspunzi la un chestionar scurt ca să identifici tema (relația cu un părinte, cu un partener, cu un frate sau o soră, sau familia extinsă), apoi plasezi figurile relevante pe o tablă interactivă — la distanța și orientarea pe care le simți real. Alegi o culoare și un simbol pentru fiecare figură și, dacă e cazul, un conector explicit între două dintre ele — o barieră, o inimă, un lanț.`,
          `O interpretare AI, antrenată pe principiile constelațiilor familiale, analizează configurația completă și îți oferă o interpretare specifică situației tale — nu un text generic. Poți adăuga opțional și data nașterii, pentru un strat suplimentar din harta ta natală astrologică.`,
        ],
      },
    ],
    faq: [
      {
        question: `Trebuie să fiu chiar în ${county.seat} ca să folosesc serviciul?`,
        answer: `Nu — funcționează identic din orice localitate din ${administrativeUnitPhrase(county)}, sau din oricare alt județ din România. E complet online.`,
      },
      {
        question: "Cât costă?",
        answer:
          "Interpretarea inițială (teaser) e gratuită. Raportul complet, cu analiză detaliată pe secțiuni, se deblochează separat.",
      },
      {
        question: "Cât durează?",
        answer: "10-20 de minute pentru a construi constelația, plus timpul de generare a interpretării (sub un minut pentru varianta gratuită).",
      },
    ],
  };
}

export { NEIGHBOR_SECTION_HEADING };
