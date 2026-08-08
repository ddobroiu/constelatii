import { NextResponse } from "next/server";
import { BirthDataSchema } from "@/lib/astrology/types";
import { computeNatalChart } from "@/lib/astrology/chart";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = BirthDataSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Date de naștere invalide.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const chart = computeNatalChart(parsed.data);
    return NextResponse.json(chart);
  } catch (err) {
    console.error("Eroare la calculul hărții natale:", err);
    const message = err instanceof Error ? err.message : "Nu am putut calcula harta natală.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
