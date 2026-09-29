import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

// page.tsx e client component, deci metadatele stau aici.
export const metadata: Metadata = pageMetadata({
  path: "/chestionar",
  title: "Chestionar: primul pas al constelației",
  description:
    "Câteva întrebări despre situația ta și relația pe care vrei s-o explorezi, plus datele de naștere (opțional), înainte să-ți așezi familia pe tabla interactivă.",
});

export default function ChestionarLayout({ children }: LayoutProps<"/chestionar">) {
  return children;
}
