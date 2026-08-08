import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic } from "./client";
import { SYSTEM_PROMPT, buildUserContent } from "./promptBuilder";
import { TeaserSchema, type Teaser } from "./schema";
import type { BoardConfig } from "@/lib/board/types";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import type { NatalChart } from "@/lib/astrology/types";

interface GenerateTeaserInput {
  board: BoardConfig;
  questionnaire: QuestionnaireAnswers;
  natalChart: NatalChart | null;
}

/**
 * Cheap, free-tier generation — shown to every visitor without payment.
 * Deliberately smaller model + lower effort + tight max_tokens: this call
 * happens on every visit (not just paying ones), so cost must stay low
 * while still being specific enough to create real curiosity. The expensive
 * full report (Opus 5, high effort) only runs on explicit user action —
 * see generateFullReport.ts.
 */
export async function generateTeaser({ board, questionnaire, natalChart }: GenerateTeaserInput): Promise<Teaser> {
  const userContent = buildUserContent({ board, questionnaire, natalChart });

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-5",
    max_tokens: 4000,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `${userContent}\n\nGenerează DOAR teaser-ul (2-3 propoziții) — nu raportul complet.`,
      },
    ],
    output_config: {
      effort: "medium",
      format: zodOutputFormat(TeaserSchema),
    },
  });

  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new Error("Claude a refuzat cererea de interpretare.");
  }

  if (!message.parsed_output) {
    throw new Error("Răspunsul Claude nu a putut fi parsat conform schemei așteptate.");
  }

  return message.parsed_output;
}
