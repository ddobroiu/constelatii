import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getPack } from "@/lib/billing/packs";
import { appUrl, getStripe, stripeConfigured } from "@/lib/stripe/client";

const RequestSchema = z.object({ pack: z.string() });

/**
 * Pornește plata unui pachet de credite.
 *
 * Prețul se ia din catalogul nostru (tabelul `packs`), nu din cererea
 * clientului: altfel oricine ar putea cumpăra cinci credite cu un leu,
 * schimbând suma trimisă aici. Un credit se cheltuiește mai târziu, separat,
 * pe orice constelație — vezi /api/constellations/[id]/unlock.
 */
/** Un cookie din cerere (vizitatorul mydashboard, `_md_vid`), ca plata să fie legată de sursa vizitei. */
function readCookie(request: Request, name: string): string | null {
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name && v.length) return decodeURIComponent(v.join("=")).slice(0, 64);
  }
  return null;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Trebuie să fii autentificat." }, { status: 401 });
  }

  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Plățile nu sunt încă active. Revino în curând." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const pack = await getPack(parsed.data.pack);
  if (!pack) {
    return NextResponse.json({ error: "Pachet inexistent." }, { status: 404 });
  }

  // Contul Stripe „Applications” e comun aplicatiilor: eticheta de proiect separa platile in mydashboard
  const vid = readCookie(request, "_md_vid");
  const tag = { project: "constelatii", ...(vid && { md_vid: vid }) };
  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    // Numele, adresa si (pentru firme) CUI-ul pentru factura Oblio
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    payment_intent_data: { metadata: { ...tag, userId: session.user.id, pack: pack.code } },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "ron",
          unit_amount: pack.priceCents,
          product_data: {
            name: `Constelații Familiale — ${pack.name}`,
            description:
              pack.credits === 1
                ? "1 raport complet, pentru orice constelație."
                : `${pack.credits} rapoarte complete, pentru orice constelații. Nu expiră.`,
          },
        },
      },
    ],
    metadata: { ...tag, userId: session.user.id, pack: pack.code },
    success_url: `${appUrl()}/cont?plata=succes`,
    cancel_url: `${appUrl()}/pachete?plata=anulata`,
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Nu am putut crea sesiunea de plată." }, { status: 502 });
  }

  // Cumpărarea se înregistrează ca „pending" acum, ca webhook-ul să aibă ce
  // confirma — fără acest rând, o plată reușită nu ar avea unde să aterizeze.
  await prisma.packPurchase.create({
    data: {
      userId: session.user.id,
      packCode: pack.code,
      stripeCheckoutSessionId: checkoutSession.id,
      amountCents: checkoutSession.amount_total ?? pack.priceCents,
      currency: checkoutSession.currency ?? "ron",
      status: "pending",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
