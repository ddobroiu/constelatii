import { NextResponse } from "next/server";
import { z } from "zod";
import { BoardConfigSchema } from "@/lib/board/types";
import { QuestionnaireAnswersSchema } from "@/lib/questionnaire/schema";
import { NatalChartSchema } from "@/lib/astrology/types";
import { generateTeaser } from "@/lib/claude/generateTeaser";
import { alerta, faraCredite } from "@/lib/alerts";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const RequestSchema = z.object({
  board: BoardConfigSchema,
  questionnaire: QuestionnaireAnswersSchema,
  natalChart: NatalChartSchema.nullable().optional(),
  // consimtamantul explicit (art. 9 GDPR) pentru trimiterea datelor catre furnizorul AI
  aiConsent: z.literal(true),
});

export async function POST(request: Request) {
  // Ruta e publică și cheamă Claude: limită per IP + plafon global (IP-ul din X-Forwarded-For se poate falsifica)
  const ip = getClientIp(request);
  const checks = [
    () => rateLimit(`teaser:10m:${ip}`, { limit: 5, windowMs: 10 * 60_000 }),
    () => rateLimit(`teaser:zi:${ip}`, { limit: 20, windowMs: 24 * 3600_000 }),
    () => rateLimit("teaser:global:ora", { limit: 300, windowMs: 3600_000 }),
  ];
  let blocked: ReturnType<typeof rateLimit> | undefined;
  for (const check of checks) {
    const r = check();
    if (!r.ok) {
      blocked = r;
      break;
    }
  }
  if (blocked) {
    return NextResponse.json(
      { error: "Prea multe cereri. Încearcă din nou puțin mai târziu." },
      { status: 429, headers: { "Retry-After": String(blocked.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success && (body as { aiConsent?: unknown } | null)?.aiConsent !== true) {
    return NextResponse.json(
      { error: "Pentru interpretare este nevoie de acordul tău pentru prelucrarea datelor prin AI." },
      { status: 400 },
    );
  }
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
