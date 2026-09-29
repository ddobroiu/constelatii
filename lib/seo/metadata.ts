import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/legal";

/**
 * Metadata comune pentru o pagină publică: titlu (sufixul „| Constelații
 * Familiale” vine din template-ul din layout), descriere, canonical pe calea
 * paginii (absolut prin metadataBase) și Open Graph / Twitter cu aceleași
 * texte. Imaginea OG e generată de app/opengraph-image.tsx; o referim explicit
 * pentru că un openGraph definit în pagină ascunde imaginea din segmentul rădăcină.
 *
 * openGraph se îmbină superficial între segmente (un openGraph din pagină îl
 * înlocuiește complet pe cel din layout), de aceea îl construim complet aici.
 */
export const OG_IMAGE_ALT = "Constelații Familiale — constelația familiei tale, pe o tablă interactivă";
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: OG_IMAGE_ALT };

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ro_RO",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Pagini utilitare (autentificare, cont): fără index, dar linkurile se urmează. */
export const NOINDEX: Metadata["robots"] = { index: false, follow: true };
