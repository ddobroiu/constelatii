import { NextResponse } from "next/server";
import { z } from "zod";
import { BoardConfigSchema } from "@/lib/board/types";
import { QuestionnaireAnswersSchema } from "@/lib/questionnaire/schema";
import { NatalChartSchema } from "@/lib/astrology/types";
import { generateTeaser } from "@/lib/claude/generateTeaser";
import { alerta, faraCredite } from "@/lib/alerts";

const RequestSchema = z.object({
  board: BoardConfigSchema,
  questionnaire: QuestionnaireAnswersSchema,
  natalChart: NatalChartSchema.nullable().optional(),
});

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
    const teaser = await generateTeaser({
      board: parsed.data.board,
      questionnaire: parsed.data.questionnaire,
      natalChart: parsed.data.natalChart ?? null,
    });

    return NextResponse.json(teaser);
  } catch (err) {
    console.error("Eroare la generarea teaser-ului:", err);
    if (faraCredite(err)) {
      const short = err instanceof Error ? err.message : String(err);
      void alerta(
        "credits",
        "anthropic",
        `Constelatii Familiale: Anthropic a refuzat cererea - credite terminate. Generarea nu merge pana nu reincarci contul: ${short.slice(0, 300)}`,
      );
    }
    return NextResponse.json({ error: "Nu am putut genera interpretarea. Încearcă din nou." }, { status: 502 });
  }
}
