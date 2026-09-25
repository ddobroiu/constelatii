import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { generateFullReport } from "@/lib/claude/generateFullReport";
import type { BoardConfig } from "@/lib/board/types";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import type { NatalChart } from "@/lib/astrology/types";

/**
 * Deblochează raportul complet al unei constelații, cheltuind un credit din
 * portofel.
 *
 * Cheltuirea e atomică: `updateMany` cu `creditsBalance: { gt: 0 }` în where
 * se traduce într-un singur UPDATE ... WHERE, deci două cereri simultane nu
 * pot cheltui amândouă ultimul credit. Dacă generarea eșuează după ce
 * creditul a fost scăzut, se rambursează — omul nu pierde un credit pentru
 * un raport pe care nu l-a primit.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  const constellation = await prisma.savedConstellation.findUnique({ where: { id } });
  if (!constellation || constellation.userId !== userId) {
    return NextResponse.json({ error: "Nu a fost găsită." }, { status: 404 });
  }
  if (constellation.fullReport) {
    return NextResponse.json({ fullReport: constellation.fullReport });
  }

  const spent = await prisma.wallet.updateMany({
    where: { userId, creditsBalance: { gt: 0 } },
    data: { creditsBalance: { decrement: 1 } },
  });
  if (spent.count === 0) {
    return NextResponse.json(
      { error: "Nu mai ai credite. Alege un pachet ca să continui.", code: "no_credits" },
      { status: 402 },
    );
  }

  try {
    const fullReport = await generateFullReport({
      board: constellation.boardConfig as unknown as BoardConfig,
      questionnaire: constellation.questionnaire as unknown as QuestionnaireAnswers,
      natalChart: (constellation.natalChart as unknown as NatalChart | null) ?? null,
    });

    await prisma.$transaction([
      prisma.savedConstellation.update({ where: { id }, data: { fullReport: fullReport as unknown as object } }),
      prisma.reportUnlock.create({ data: { userId, constellationId: id, creditsSpent: 1 } }),
    ]);

    return NextResponse.json({ fullReport });
  } catch (err) {
    // Generarea a eșuat (refuz, eroare de la Claude): creditul se rambursează,
    // nimic nu se marchează deblocat. Omul poate încerca din nou.
    await prisma.wallet.update({ where: { userId }, data: { creditsBalance: { increment: 1 } } });
    console.error("Eroare la generarea raportului complet:", err);
    return NextResponse.json(
      { error: "Nu am putut genera raportul. Creditul nu a fost cheltuit — încearcă din nou." },
      { status: 502 },
    );
  }
}
