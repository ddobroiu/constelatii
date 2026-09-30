import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { generateReferralCode } from "@/lib/auth/referralCode";
import { LEGAL_VERSION } from "@/lib/legal";
import { MARKETING_CHOICE_COOKIE } from "@/lib/lifecycle/consent";
import { sendWelcomeNow } from "@/lib/lifecycle/run";

/**
 * „Continuă cu Google” (OAuth2/OIDC prin providerul Google din Auth.js).
 * Pornire: GET /api/auth/google. Întoarcere: /api/auth/callback/google — URI-ul
 * autorizat în Google Cloud trebuie să fie exact <NEXT_PUBLIC_APP_URL>/api/auth/callback/google.
 * Fără GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET butonul nu apare, iar rutele răspund 404.
 */
export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/** Codul de recomandare de pe „Creează cont”, păstrat cât durează drumul prin Google. */
export const GOOGLE_REF_COOKIE = "cf_g_ref";

/**
 * Găsește contul după e-mail (fără diferență de litere mari/mici) sau îl creează.
 * Contul existent, cu parolă, se leagă automat: Google a confirmat adresa.
 * Întoarce id-ul contului sau null dacă nu s-a putut crea.
 */
export async function findOrCreateGoogleUser(profile: { email: string; name: string | null }): Promise<string | null> {
  const email = profile.email.toLowerCase().trim();

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, name: true },
  });
  if (existing) {
    if (!existing.name && profile.name) {
      await prisma.user.update({ where: { id: existing.id }, data: { name: profile.name.slice(0, 100) } });
    }
    return existing.id;
  }

  const jar = await cookies();
  // Alegerea de pe „Creează cont” (cookie scris de formular): „in” / „out”. Fără ea
  // (pornit din „Autentificare”), omul n-a văzut anunțul, deci marketingChoiceAt
  // rămâne NULL și contul nu primește e-mailurile periodice — doar bun venit.
  const choice = jar.get(MARKETING_CHOICE_COOKIE)?.value;
  const chose = choice === "in" || choice === "out";

  let referredById: string | null = null;
  const ref = jar.get(GOOGLE_REF_COOKIE)?.value;
  if (ref) {
    const referrer = await prisma.user.findUnique({ where: { referralCode: ref }, select: { id: true } });
    if (referrer) referredById = referrer.id;
  }

  const name = profile.name ? profile.name.slice(0, 100) : null;

  // Retry la coliziunea (foarte improbabilă) a codului de recomandare.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: null,
          name,
          referralCode: generateReferralCode(),
          referredById,
          // Butonul are sub el mențiunea că, continuând, accepți Termenii.
          termsAcceptedAt: new Date(),
          termsVersion: LEGAL_VERSION,
          marketingOptOut: choice === "out",
          marketingChoiceAt: chose ? new Date() : null,
          wallet: { create: {} },
        },
        select: { id: true, email: true, name: true },
      });
      void sendWelcomeNow(user).catch((error) => console.error("[google] bun venit:", error));
      return user.id;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const target = (err.meta?.target as string[] | undefined) ?? [];
        if (target.includes("referral_code")) continue;
        // Același e-mail creat în paralel (dublu click): folosim contul deja creat.
        const again = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
          select: { id: true },
        });
        return again?.id ?? null;
      }
      throw err;
    }
  }
  return null;
}

/** Id-ul contului pentru un e-mail (la emiterea JWT-ului după Google). */
export async function userForEmail(email: string) {
  return prisma.user.findFirst({
    where: { email: { equals: email.toLowerCase().trim(), mode: "insensitive" } },
    select: { id: true, name: true, email: true },
  });
}
