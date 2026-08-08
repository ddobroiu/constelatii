import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const { id } = await params;
  const constellation = await prisma.savedConstellation.findUnique({
    where: { id },
    include: { payments: { select: { status: true } } },
  });

  if (!constellation || constellation.userId !== session.user.id) {
    return NextResponse.json({ error: "Nu a fost găsită." }, { status: 404 });
  }

  return NextResponse.json({
    id: constellation.id,
    title: constellation.title,
    teaserText: constellation.teaserText,
    fullReport: constellation.fullReport,
    paid: constellation.payments.some((p) => p.status === "paid"),
  });
}
