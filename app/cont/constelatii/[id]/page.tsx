import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import ConstellationDetail from "@/components/account/ConstellationDetail";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import type { FullReport } from "@/lib/claude/schema";

export default async function ConstellationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect(`/autentificare?callbackUrl=/cont/constelatii/${id}`);

  const constellation = await prisma.savedConstellation.findUnique({
    where: { id },
    include: { payments: { select: { status: true } } },
  });

  if (!constellation || constellation.userId !== session.user.id) notFound();

  const paid = constellation.payments.some((p) => p.status === "paid");

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">
      <Starfield count={70} />

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <div>
            <Link href="/cont" className="text-sm text-accent hover:underline">
              ← Contul tău
            </Link>
            <h1 className="mt-2 text-2xl font-semibold">{constellation.title}</h1>
          </div>
        </header>

        <ConstellationDetail
          id={constellation.id}
          teaserText={constellation.teaserText}
          initialFullReport={constellation.fullReport as unknown as FullReport | null}
          initialPaid={paid}
        />
      </div>
    </div>
  );
}
