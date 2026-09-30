import { prisma } from "@/lib/db/prisma";

/**
 * Ce a făcut omul până acum, din bază, pentru e-mailurile personalizate.
 * Doar cifre și stări — nu temele constelațiilor, care pot fi personale și
 * n-au ce căuta într-un e-mail pe care îl mai poate vedea cineva.
 */
export interface UserSnapshot {
  constellations: number;
  /** Constelații cu raportul complet deblocat. */
  unlocked: number;
  credits: number;
  lastPack: string | null;
}

export async function loadSnapshot(userId: string): Promise<UserSnapshot> {
  const [constellations, unlocked, wallet, pack] = await Promise.all([
    prisma.savedConstellation.count({ where: { userId } }),
    prisma.savedConstellation.count({ where: { userId, reportUnlock: { isNot: null } } }),
    prisma.wallet.findUnique({ where: { userId }, select: { creditsBalance: true } }),
    prisma.packPurchase.findFirst({
      where: { userId, status: "paid" },
      orderBy: { completedAt: "desc" },
      select: { pack: { select: { name: true } } },
    }),
  ]);
  return {
    constellations,
    unlocked,
    credits: wallet?.creditsBalance ?? 0,
    lastPack: pack?.pack.name ?? null,
  };
}
