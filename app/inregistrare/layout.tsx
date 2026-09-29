import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/inregistrare",
  title: "Creează cont",
  description: "Creează un cont ca să-ți salvezi constelațiile și să deblochezi rapoartele complete.",
  noindex: true,
});

export default function InregistrareLayout({ children }: LayoutProps<"/inregistrare">) {
  return children;
}
