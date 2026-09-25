import { prisma } from "@/lib/db/prisma";

export interface Pack {
  code: string;
  name: string;
  priceCents: number;
  credits: number;
  sortOrder: number;
}

function toPack(row: { code: string; name: string; priceCents: number; credits: number; sortOrder: number }): Pack {
  return {
    code: row.code,
    name: row.name,
    priceCents: row.priceCents,
    credits: row.credits,
    sortOrder: row.sortOrder,
  };
}

/** Catalogul e public: nu are nevoie de sesiune. */
export async function listPacks(): Promise<Pack[]> {
  const rows = await prisma.pack.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toPack);
}

export async function getPack(code: string): Promise<Pack | null> {
  const row = await prisma.pack.findFirst({ where: { code, active: true } });
  return row ? toPack(row) : null;
}

/**
 * Creditează portofelul după o plată Stripe confirmată.
 *
 * Idempotent: `stripeCheckoutSessionId` e unic, iar trecerea la `paid` are
 * condiția `status = 'pending'` în where. Stripe retrimite același eveniment
 * prin proiectare — a doua livrare nu trebuie să crediteze de două ori.
 *
 * `updateMany` (nu `update`) tocmai ca să poată întoarce 0 rânduri afectate în
 * loc să arunce, când plata a fost deja onorată sau id-ul nu există.
 */
export async function creditPurchase(
  stripeCheckoutSessionId: string,
): Promise<{ credited: boolean; userId: string | null; pack: Pack | null }> {
  const purchase = await prisma.packPurchase.findUnique({
    where: { stripeCheckoutSessionId },
    include: { pack: true },
  });
  if (!purchase) return { credited: false, userId: null, pack: null };

  const updated = await prisma.packPurchase.updateMany({
    where: { stripeCheckoutSessionId, status: "pending" },
    data: { status: "paid", completedAt: new Date() },
  });
  if (updated.count === 0) {
    // Deja creditat la o livrare anterioară a webhook-ului.
    return { credited: false, userId: purchase.userId, pack: toPack(purchase.pack) };
  }

  await prisma.wallet.upsert({
    where: { userId: purchase.userId },
    create: { userId: purchase.userId, creditsBalance: purchase.pack.credits },
    update: { creditsBalance: { increment: purchase.pack.credits } },
  });

  return { credited: true, userId: purchase.userId, pack: toPack(purchase.pack) };
}
