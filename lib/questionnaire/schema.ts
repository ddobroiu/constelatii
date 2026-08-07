import { z } from "zod";
import { FIGURE_ROLES, type FigureRole } from "../board/types";

export const FOCUS_RELATIONSHIPS = [
  { value: "tata", label: "Relația cu tata", description: "Apropiere, distanță, autoritate, moștenire emoțională" },
  { value: "mama", label: "Relația cu mama", description: "Atașament, grijă, așteptări, tipare preluate" },
  { value: "partener", label: "O relație de cuplu", description: "Dinamica actuală cu partenerul/partenera" },
  { value: "frate_sora", label: "Relația cu un frate/soră", description: "Rivalitate, alianțe, loc în familie" },
  { value: "familie_extinsa", label: "Familia extinsă", description: "Bunici, tipare care se repetă peste generații" },
  { value: "altceva", label: "Altceva", description: "O situație care nu se potrivește exact mai sus" },
] as const;

export type FocusRelationship = (typeof FOCUS_RELATIONSHIPS)[number]["value"];

export const PRESENTING_THEMES = [
  "Conflict nerezolvat",
  "Distanță emoțională",
  "Lipsă de comunicare",
  "Pierdere sau doliu",
  "Tensiune care se repetă",
  "Vreau doar claritate",
] as const;

export type PresentingTheme = (typeof PRESENTING_THEMES)[number];

export const QuestionnaireAnswersSchema = z.object({
  focusRelationship: z.enum(FOCUS_RELATIONSHIPS.map((f) => f.value) as [FocusRelationship, ...FocusRelationship[]]),
  presentingThemes: z.array(z.enum(PRESENTING_THEMES)),
  presentingIssue: z.string().max(600).optional(),
  selectedFigures: z
    .array(z.enum(FIGURE_ROLES.map((r) => r.value) as [FigureRole, ...FigureRole[]]))
    .min(2, "Alege cel puțin o persoană pe lângă tine"),
  freeText: z.string().max(600).optional(),
});

export type QuestionnaireAnswers = z.infer<typeof QuestionnaireAnswersSchema>;

export function focusRelationshipLabel(value: FocusRelationship): string {
  return FOCUS_RELATIONSHIPS.find((f) => f.value === value)?.label ?? value;
}
