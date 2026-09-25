import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

/** Câte credite are contul curent. */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json({ creditsBalance: wallet?.creditsBalance ?? 0 });
}
