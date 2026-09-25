import { NextResponse } from "next/server";
import Stripe from "stripe";
import { creditPurchase } from "@/lib/billing/packs";
import { getStripe, stripeConfigured } from "@/lib/stripe/client";

/**
 * Confirmarea plății, venită de la Stripe.
 *
 * Nu ne bazăm pe întoarcerea utilizatorului în `success_url`: acolo poate să
 * nu ajungă niciodată — închide fereastra, pică netul — iar plata ar rămâne
 * neonorată. Webhook-ul este singurul loc unde se creditează portofelul;
 * generarea raportului complet e o acțiune separată, ulterioară, cerută de
 * utilizator din contul lui (vezi /api/constellations/[id]/unlock) — nu se
 * mai întâmplă automat aici.
 */
export async function POST(request: Request) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Plățile nu sunt configurate." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Lipsește semnătura." }, { status: 400 });
  }

  // Corpul brut, nu cel parsat: semnătura se verifică pe octeții exacți.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Semnătură webhook Stripe invalidă:", err);
    return NextResponse.json({ error: "Semnătură invalidă." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const checkoutSession = event.data.object as Stripe.Checkout.Session;
  if (checkoutSession.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  try {
    const result = await creditPurchase(checkoutSession.id);
    return NextResponse.json({ received: true, credited: result.credited });
  } catch (err) {
    console.error("Eroare la creditarea portofelului:", err);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
