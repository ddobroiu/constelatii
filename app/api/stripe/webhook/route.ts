import { NextResponse } from "next/server";
import Stripe from "stripe";
import { creditPurchase } from "@/lib/billing/packs";
import { appUrl, getStripe, stripeConfigured } from "@/lib/stripe/client";
import { isOblioConfigured, issueInvoice } from "@/lib/billing/oblio";
import { prisma } from "@/lib/db/prisma";
import { sendPurchaseEmail } from "@/lib/email";

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
  // contul Stripe e comun aplicatiilor: evenimentele altor proiecte nu sunt ale noastre
  if (checkoutSession.metadata?.project && checkoutSession.metadata.project !== "constelatii") {
    return NextResponse.json({ received: true });
  }

  try {
    const result = await creditPurchase(checkoutSession.id);
    if (result.credited) await afterCredit(checkoutSession, result.pack);
    return NextResponse.json({ received: true, credited: result.credited });
  } catch (err) {
    console.error("Eroare la creditarea portofelului:", err);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

// Dupa prima creditare: factura Oblio (pe datele cerute de Stripe la plata) si e-mailul de confirmare.
// Nimic de aici nu blocheaza creditarea.
async function afterCredit(session: Stripe.Checkout.Session, pack: { name: string; credits: number } | null) {
  let invoiceUrl: string | null = null;
  if (isOblioConfigured()) {
    try {
      const inv = await issueInvoice(session, {
        name: `Constelații Familiale - ${pack?.name ?? "pachet de credite"}`,
        amountCents: session.amount_total ?? 0,
        currency: session.currency ?? "ron",
      });
      invoiceUrl = inv.url;
      await prisma.packPurchase.update({
        where: { stripeCheckoutSessionId: session.id },
        data: { invoiceSeries: inv.series, invoiceNumber: inv.number, invoiceUrl: inv.url, invoiceError: null },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[oblio] factura:", session.id, message);
      await prisma.packPurchase
        .update({ where: { stripeCheckoutSessionId: session.id }, data: { invoiceError: message.slice(0, 500) } })
        .catch(() => {});
    }
  }
  const email = session.customer_details?.email ?? session.customer_email;
  if (email) await sendPurchaseEmail(email, pack, appUrl(), invoiceUrl);
}
