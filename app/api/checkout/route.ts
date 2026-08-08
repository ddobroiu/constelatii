import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getStripe } from "@/lib/stripe/client";

const RequestSchema = z.object({ constellationId: z.string() });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Trebuie să fii autentificat." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const constellation = await prisma.savedConstellation.findUnique({
    where: { id: parsed.data.constellationId },
    include: { payments: { select: { status: true } } },
  });

  if (!constellation || constellation.userId !== session.user.id) {
    return NextResponse.json({ error: "Constelația nu a fost găsită." }, { status: 404 });
  }

  if (constellation.payments.some((p) => p.status === "paid")) {
    return NextResponse.json({ error: "Această constelație are deja raportul deblocat." }, { status: 409 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    customer_email: session.user.email ?? undefined,
    metadata: { constellationId: constellation.id, userId: session.user.id },
    success_url: `${appUrl}/cont/constelatii/${constellation.id}?plata=succes`,
    cancel_url: `${appUrl}/cont/constelatii/${constellation.id}`,
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Nu am putut crea sesiunea de plată." }, { status: 502 });
  }

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      constellationId: constellation.id,
      stripeCheckoutSessionId: checkoutSession.id,
      amountCents: checkoutSession.amount_total ?? 0,
      currency: checkoutSession.currency ?? "ron",
      status: "pending",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
