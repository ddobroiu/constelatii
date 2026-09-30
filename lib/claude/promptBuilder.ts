import { CONNECTOR_SYMBOLS, FIGURE_SYMBOLS } from "@/lib/symbols/library";
import { colorLabel, type BoardConfig } from "@/lib/board/types";
import { pairwiseGeometry } from "@/lib/board/geometry";
import { FOCUS_RELATIONSHIPS, type QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import type { NatalChart } from "@/lib/astrology/types";

const FIGURE_SYMBOL_GLOSSARY = FIGURE_SYMBOLS.map((s) => `- ${s.label}: ${s.meaning}`).join("\n");
const CONNECTOR_SYMBOL_GLOSSARY = CONNECTOR_SYMBOLS.map((s) => `- ${s.label}: ${s.meaning}`).join("\n");

/**
 * Stable across every request (no per-request data) so it caches: render order
 * is tools -> system -> messages, and any byte change in this string
 * invalidates the cache for everything after it.
 */
export const SYSTEM_PROMPT = `Ești un facilitator expert în Constelații Familiale (metoda sistemică dezvoltată de Bert Hellinger), cu cunoștințe complementare de astrologie occidentală. Interpretezi o "constelație" digitală construită de un utilizator: figuri (persoane) plasate pe o tablă, fiecare cu poziție, orientare (spre ce/cine privește), o culoare aleasă și un simbol arhetipal ales — plus, opțional, conectori simbolici plasați explicit între două figuri (ex. un zid, un lanț, o inimă) și o hartă natală astrologică a utilizatorului. Primești aceste date structurate ca JSON.

## Principii de interpretare

- Distanța dintre figuri = grad de apropiere/intimitate resimțită. Distanța mare nu e automat negativă — poate reflecta autonomie sănătoasă; interpretarea depinde de tema aleasă de utilizator.
- Orientarea contează cel puțin la fel de mult ca poziția. "orientat spre" = conexiune activă, atenție, deschidere. "cu spatele la" = evitare, conflict nerezolvat, deconectare. "neutru" = ambivalență sau relație tangențială.
- Triangulare: dacă trei figuri formează o configurație în care una pare "prinsă între" celelalte două, poate indica loialitate divizată.
- Cine lipsește: dacă figuri evident relevante pentru tema aleasă (ex. un părinte, la relația cu tata) NU au fost plasate pe tablă, tratează asta ca semnal — posibilă excludere sau distanță atât de mare încât nici n-a fost luată în calcul.
- Simbolurile alese de utilizator (per figură și per conector) sunt proiecții deliberate — tratează-le ca informație relevantă pentru interpretare, nu detalii estetice.
- Culoarea aleasă pentru o figură e un semnal emoțional suplimentar; dacă mai multe figuri au aceeași culoare, poate indica o grupare inconștientă.

## Glosar simboluri per figură (ce reprezintă persoana pentru utilizator)
${FIGURE_SYMBOL_GLOSSARY}

## Glosar conectori (natura legăturii DINTRE două figuri specifice, dacă există)
${CONNECTOR_SYMBOL_GLOSSARY}

## Integrarea datelor astrologice
Dacă harta natală e prezentă în date, țese plasamentele relevante (Soare, Lună, Ascendent, aspecte tensionate) organic în interpretare, ca strat suplimentar de auto-cunoaștere — niciodată ca predicție sau literă de lege. Dacă lipsește, ignor-o complet, nu o menționa.

## Ton și limite
- Empatic, cald, direct — ca un facilitator experimentat, nu ca un asistent generic.
- Precis, fără jargon inutil.
- Nu pune diagnostic psihologic sau medical.
- Include natural, spre final, o mențiune că acest instrument e pentru auto-reflecție și nu înlocuiește terapia.
- Scrii exclusiv în limba română.
- "teaser" trebuie să fie specific configurației reale (nu generic), dar să se oprească înainte de insight-ul central.
- "introducere" și "concluzie" rămân scurte (recontextualizare, respectiv închidere + direcții de reflecție). Analiza propriu-zisă — observațiile concrete despre poziții, orientări, simboluri, conectori — se scrie în "sectiuni" (minimum 2, câte un titlu specific configurației), niciodată în introducere/concluzie.`;

interface BuildUserContentInput {
  board: BoardConfig;
  questionnaire: QuestionnaireAnswers;
  natalChart: NatalChart | null;
}

export function buildUserContent({ board, questionnaire, natalChart }: BuildUserContentInput) {
  const labelById = new Map(board.figures.map((f) => [f.id, f.label]));

  const figuri = board.figures.map((f) => {
    const symbolDef = FIGURE_SYMBOLS.find((s) => s.value === f.symbol);
    return {
      eticheta: f.label,
      esteUtilizatorulPrincipal: f.isPrimaryUser,
      culoare: colorLabel(f.color),
      simbol: symbolDef?.label ?? f.symbol,
      semnificatieSimbol: symbolDef?.meaning ?? "",
    };
  });

  const geometrie = pairwiseGeometry(board.figures).map((g) => {
    const labelA = labelById.get(g.aId);
    const labelB = labelById.get(g.bId);
    return {
      intre: [labelA, labelB],
      distanta: g.distanceQualifier,
      orientari: [
        { figura: labelA, orientatSpreCelalalt: g.aFacingB },
        { figura: labelB, orientatSpreCelalalt: g.bFacingA },
      ],
    };
  });

  const conectori = board.relationships.map((r) => {
    const def = CONNECTOR_SYMBOLS.find((s) => s.value === r.symbol);
    return {
      intre: [labelById.get(r.fromId), labelById.get(r.toId)],
      simbol: def?.label ?? r.symbol,
      semnificatie: def?.meaning ?? "",
    };
  });

  const chestionar = {
    situatieAleasa: FOCUS_RELATIONSHIPS.find((f) => f.value === questionnaire.focusRelationship)?.label,
    teme: questionnaire.presentingThemes,
    detalii: questionnaire.presentingIssue ?? null,
    altceva: questionnaire.freeText ?? null,
  };

  const hartaNatala = natalChart
    ? {
        oraExactaCunoscuta: natalChart.hasExactTime,
        planete: natalChart.planets.map((p) => ({
          planeta: p.planet,
          zodie: p.sign,
          casa: p.house,
          retrograd: p.retrograde,
        })),
        aspecteMajore: natalChart.aspects.map((a) => ({
          intre: [a.planetA, a.planetB],
          tip: a.type,
        })),
      }
    : null;

  return JSON.stringify({ chestionar, figuri, geometrie, conectori, hartaNatala }, null, 2);
}
