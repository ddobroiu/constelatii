import { prisma } from "./prisma";

export async function getUserAccountData(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      referralCode: true,
      createdAt: true,
      referrals: {
        select: { id: true, name: true, email: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      wallet: { select: { creditsBalance: true } },
      constellations: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          teaserText: true,
          fullReport: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
