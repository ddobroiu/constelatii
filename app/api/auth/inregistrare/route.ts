import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { generateReferralCode } from "@/lib/auth/referralCode";

const SignupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8, "Parola trebuie să aibă minimum 8 caractere"),
  ref: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide.", details: parsed.error.flatten() }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Există deja un cont cu acest email." }, { status: 409 });
  }

  let referredById: string | null = null;
  if (parsed.data.ref) {
    const referrer = await prisma.user.findUnique({ where: { referralCode: parsed.data.ref } });
    if (referrer) referredById = referrer.id;
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  // Retry on the (very unlikely) referral code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: parsed.data.name,
          referralCode: generateReferralCode(),
          referredById,
        },
        select: { id: true, email: true, name: true },
      });
      return NextResponse.json(user, { status: 201 });
    } catch (err) {
      const isReferralCodeCollision =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        (err.meta?.target as string[] | undefined)?.includes("referral_code");
      if (isReferralCodeCollision) continue;
      throw err;
    }
  }

  return NextResponse.json({ error: "Nu am putut crea contul. Încearcă din nou." }, { status: 500 });
}
