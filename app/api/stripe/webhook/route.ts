import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { prisma } from "@/lib/db/prisma";
import { generateFullReport } from "@/lib/claude/generateFullReport";
import type { BoardConfig } from "@/lib/board/types";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import type { NatalChart } from "@/lib/astrology/types";

async function unlockAndGenerateReport(checkoutSession: Stripe.Checkout.Session) {
  const paymentIntentId =
    typeof checkoutSession.payment_intent === "string"
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id;

  const payment = await prisma.payment.update({
    where: { stripeCheckoutSessionId: checkoutSession.id },
    data: {
      status: "paid",
      unlockedAt: new Date(),
      stripePaymentIntentId: paymentIntentId,
    },
    include: { constellation: true },
  });

  if (payment.constellation.fullReport) return;

  const fullReport = await generateFullReport({
    board: payment.constellation.boardConfig as unknown as BoardConfig,
    questionnaire: payment.constellation.questionnaire as unknown as QuestionnaireAnswers,
    natalChart: (payment.constellation.natalChart as unknown as NatalChart | null) ?? null,
  });

  await prisma.savedConstellation.update({
    where: { id: payment.constellationId },
    data: { fullReport: fullReport as unknown as object },
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Lipsește semnătura." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch (err) {
    console.error("Semnătură webhook Stripe invalidă:", err);
    return NextResponse.json({ error: "Semnătură invalidă." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    try {
      await unlockAndGenerateReport(checkoutSession);
    } catch (err) {
      console.error("Eroare la deblocarea plății / generarea raportului complet:", err);
      return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
