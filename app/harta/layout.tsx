import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

// page.tsx e client component, deci metadatele stau aici.
export const metadata: Metadata = pageMetadata({
  path: "/harta",
  title: "Tabla interactivă: așază-ți constelația",
  description:
    "Adaugă figurile familiei tale pe tablă — tu, părinți, partener, copii, frați, bunici — poziționează-le cum le simți, setează-le direcția și cere interpretarea constelației.",
});

export default function HartaLayout({ children }: LayoutProps<"/harta">) {
  return children;
}
