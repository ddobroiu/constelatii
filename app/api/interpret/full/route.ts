import { NextResponse } from "next/server";
import { z } from "zod";
import { BoardConfigSchema } from "@/lib/board/types";
import { QuestionnaireAnswersSchema } from "@/lib/questionnaire/schema";
import { generateFullReport } from "@/lib/claude/generateFullReport";

const RequestSchema = z.object({
  board: BoardConfigSchema,
  questionnaire: QuestionnaireAnswersSchema,
});

// TODO(Faza 5): gate this route behind a paid session token before going live —
// right now anyone who clicks the button on /harta can trigger this expensive
// (Opus 5, high effort) generation. Fine for local dev/testing, not for production.
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide.", details: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.board.figures.length < 2) {
    return NextResponse.json({ error: "Ai nevoie de cel puțin două figuri pe tablă." }, { status: 400 });
  }

  try {
    const full = await generateFullReport({
      board: parsed.data.board,
      questionnaire: parsed.data.questionnaire,
      natalChart: null,
    });

    return NextResponse.json(full);
  } catch (err) {
    console.error("Eroare la generarea raportului complet:", err);
    return NextResponse.json({ error: "Nu am putut genera raportul complet. Încearcă din nou." }, { status: 502 });
  }
}
