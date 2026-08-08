import { z } from "zod";

export const TeaserSchema = z.object({
  teaser: z
    .string()
    .describe(
      "2-3 propoziții în română, specifice configurației reale (nu generice) — suficient de precise cât să arate valoare reală, dar care se opresc înainte de insight-ul central, ca să creeze dorința reală de a citi raportul complet."
    ),
});

export type Teaser = z.infer<typeof TeaserSchema>;

export const FullReportSchema = z.object({
  introducere: z.string().describe("Un paragraf scurt care recontextualizează situația așa cum a descris-o utilizatorul."),
  sectiuni: z
    .array(
      z.object({
        titlu: z.string(),
        continut: z.string(),
      })
    )
    .min(2)
    .max(5)
    .describe(
      "OBLIGATORIU 2-5 secțiuni tematice, cu conținutul propriu-zis al analizei — nu lăsa acest array gol și nu muta conținutul lor în introducere/concluzie. Titluri relevante pentru CONFIGURAȚIA SPECIFICĂ (nu un șablon fix) — de ex. dinamica centrală, ce arată pozițiile/orientările, ce spun simbolurile alese, integrare astrologică dacă e cazul."
    ),
  concluzie: z.string().describe("Închidere empatică + 1-2 direcții de reflecție, cu mențiunea că nu înlocuiește terapia."),
});

export type FullReport = z.infer<typeof FullReportSchema>;

export interface Interpretation {
  teaser: string;
  full: FullReport;
}
