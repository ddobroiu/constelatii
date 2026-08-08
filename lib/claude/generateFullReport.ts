import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic } from "./client";
import { SYSTEM_PROMPT, buildUserContent } from "./promptBuilder";
import { FullReportSchema, type FullReport } from "./schema";
import type { BoardConfig } from "@/lib/board/types";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import type { NatalChart } from "@/lib/astrology/types";

interface GenerateFullReportInput {
  board: BoardConfig;
  questionnaire: QuestionnaireAnswers;
  natalChart: NatalChart | null;
}

/**
 * Expensive, paid-tier generation — Opus 5 at high effort with a generous
 * thinking/output budget. Only call this on explicit user action (post-teaser,
 * eventually post-payment once Stripe is wired) — never automatically on
 * every page load, unlike the cheap teaser.
 */
export async function generateFullReport({
  board,
  questionnaire,
  natalChart,
}: GenerateFullReportInput): Promise<FullReport> {
  const userContent = buildUserContent({ board, questionnaire, natalChart });

  const stream = anthropic.messages.stream({
    model: "claude-opus-5",
    max_tokens: 32000,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `${userContent}\n\nGenerează raportul complet (introducere, 2-5 secțiuni, concluzie).`,
      },
    ],
    output_config: {
      effort: "high",
      format: zodOutputFormat(FullReportSchema),
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
