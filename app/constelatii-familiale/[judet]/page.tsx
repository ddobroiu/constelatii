import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "@/components/seo/ArticlePage";
import { COUNTIES, getCountyBySlug, neighborCounties } from "@/lib/seo/counties";
import { buildCountyContent } from "@/lib/seo/countyContent";
import { PILLARS } from "@/lib/seo/pillars";

export function generateStaticParams() {
  return COUNTIES.map((c) => ({ judet: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ judet: string }>;
}): Promise<Metadata> {
  const { judet } = await params;
  const county = getCountyBySlug(judet);
  if (!county) return {};

  return {
    alternates: { canonical: `/constelatii-familiale/${county.slug}` },
    title: `Constelații Familiale Online — ${county.name} | Interpretare AI`,
    description: `Constelație familială interactivă, disponibilă online pentru locuitorii din ${county.name} (${county.seat}). Chestionar ghidat, tablă interactivă, interpretare AI — gratuit pentru început.`,
  };
}

export default async function CountyPage({ params }: { params: Promise<{ judet: string }> }) {
  const { judet } = await params;
  const county = getCountyBySlug(judet);
  if (!county) notFound();

  const content = buildCountyContent(county);
  const neighbors = neighborCounties(county);

  return (
    <ArticlePage
      eyebrow="Constelații Familiale Online"
      title={`Constelații Familiale Online — ${county.name}`}
      intro={content.intro}
      sections={content.sections}
      faq={content.faq}
      relatedLinksTitle="Explorează și"
      relatedLinks={[
        ...PILLARS.map((p) => ({ href: `/${p.slug}`, label: p.label })),
        ...neighbors.map((c) => ({
          href: `/constelatii-familiale/${c.slug}`,
          label: `Constelații în ${c.name}`,
        })),
      ]}
    />
  );
}
