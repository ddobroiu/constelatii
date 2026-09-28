import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getPack } from "@/lib/billing/packs";
import { appUrl, getStripe, stripeConfigured } from "@/lib/stripe/client";
import { CONSENT_COOKIE, parseConsent, readCookieHeader } from "@/lib/consent";
import { LEGAL_VERSION } from "@/lib/legal";

// `consent`: bifa obligatorie de pe /pachete (furnizare imediata + pierderea dreptului de retragere,
// OUG 34/2014 art. 16 lit. a si m). Fara ea nu pornim plata.
const RequestSchema = z.object({ pack: z.string(), consent: z.literal(true) });

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
    const missingConsent = (body as { consent?: unknown } | null)?.consent !== true;
    return NextResponse.json(
      {
        error: missingConsent
          ? "Trebuie să bifezi acordul cu Termenii și solicitarea furnizării imediate înainte de plată."
          : "Date invalide.",
      },
      { status: 400 },
    );
  }
  const consentAt = new Date();

  const pack = await getPack(parsed.data.pack);
  if (!pack) {
    return NextResponse.json({ error: "Pachet inexistent." }, { status: 404 });
  }

  // Contul Stripe „Applications” e comun aplicatiilor: eticheta de proiect separa platile in mydashboard
  // ID-ul de vizitator mydashboard se trimite doar cu acordul pentru statistici (bannerul de cookies)
  const cookieConsent = parseConsent(readCookieHeader(request.headers.get("cookie"), CONSENT_COOKIE));
  const vid = cookieConsent?.analytics ? readCookie(request, "_md_vid") : null;
  const tag = { project: "constelatii", ...(vid && { md_vid: vid }) };
  const legal = { consent_at: consentAt.toISOString(), terms_version: LEGAL_VERSION };
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
    metadata: { ...tag, ...legal, userId: session.user.id, pack: pack.code },
    success_url: `${appUrl()}/cont?plata=succes&sid={CHECKOUT_SESSION_ID}`,
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
      consentAt,
      termsVersion: LEGAL_VERSION,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
