import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/autentificare",
  title: "Autentificare",
  description: "Intră în contul tău pentru constelațiile salvate și rapoartele complete.",
  noindex: true,
});

export default function AutentificareLayout({ children }: LayoutProps<"/autentificare">) {
  return children;
}
