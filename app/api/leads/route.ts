import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { LEAD_CONSENT_TEXT } from "@/lib/lifecycle/consent";
import { sendLeadWelcomeNow } from "@/lib/lifecycle/run";

/**
 * Formularul pentru vizitatorii fără cont: ghidul primei constelații pe e-mail.
 * Acordul e o bifă explicită; fără ea nu se salvează nimic. Răspunsul e același
 * pentru orice adresă (nouă, existentă, cu cont, dezabonată), ca formularul să
 * nu spună cine e înscris. `website` e o capcană pentru roboți.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 60) : "";
  const source = typeof body?.source === "string" ? body.source.slice(0, 200) : null;

  if (typeof body?.website === "string" && body.website !== "") {
    return NextResponse.json({ ok: true });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return NextResponse.json({ error: "Adresa de email nu pare validă." }, { status: 400 });
  }
  if (body?.consent !== true) {
    return NextResponse.json({ error: "Bifează acordul ca să-ți putem trimite ghidul." }, { status: 400 });
  }

  // Cine are deja cont primește e-mailurile contului, nu pe cele de vizitator.
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (user) return NextResponse.json({ ok: true });

  const lead = await prisma.lead.upsert({
    where: { email },
    create: { email, name: name || null, sourcePage: source, consentAt: new Date(), consentText: LEAD_CONSENT_TEXT },
    update: name ? { name } : {},
    select: { id: true, name: true, unsubscribedAt: true },
  });

  const blocked =
    lead.unsubscribedAt !== null || (await prisma.emailUnsubscribe.findUnique({ where: { email } })) !== null;

  if (!blocked) {
    await sendLeadWelcomeNow({ id: lead.id, email, name: lead.name }).catch((error) =>
      console.error("[leads] ghid:", error),
    );
  }

  return NextResponse.json({ ok: true });
}
