import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo/metadata";

// Zona de cont (inclusiv /cont/constelatii/[id]) e privată: fără index.
export const metadata: Metadata = {
  title: "Contul tău",
  robots: NOINDEX,
};

export default function ContLayout({ children }: LayoutProps<"/cont">) {
  return children;
}
