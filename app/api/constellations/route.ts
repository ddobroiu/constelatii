import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { BoardConfigSchema } from "@/lib/board/types";
import { QuestionnaireAnswersSchema, focusRelationshipLabel } from "@/lib/questionnaire/schema";
import { NatalChartSchema } from "@/lib/astrology/types";

const CreateSchema = z.object({
  board: BoardConfigSchema,
  questionnaire: QuestionnaireAnswersSchema,
  natalChart: NatalChartSchema.nullable().optional(),
  teaserText: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Trebuie să fii autentificat." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide.", details: parsed.error.flatten() }, { status: 400 });
  }

  const constellation = await prisma.savedConstellation.create({
    data: {
      userId: session.user.id,
      title: focusRelationshipLabel(parsed.data.questionnaire.focusRelationship),
      boardConfig: parsed.data.board,
      questionnaire: parsed.data.questionnaire,
      natalChart: (parsed.data.natalChart as unknown as object) ?? undefined,
      teaserText: parsed.data.teaserText,
    },
    select: { id: true },
  });

  return NextResponse.json(constellation, { status: 201 });
}
