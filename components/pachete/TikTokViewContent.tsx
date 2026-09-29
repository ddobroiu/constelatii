"use client";

import { useEffect } from "react";
import { trackTikTok } from "@/lib/tiktok";

type Content = { content_id: string; content_name: string; quantity: number; price: number };

/** TikTok `ViewContent` pe pagina pachetelor — doar cu acord pentru marketing (vezi lib/tiktok). */
export default function TikTokViewContent({ currency, contents }: { currency: string; contents: Content[] }) {
  useEffect(() => {
    trackTikTok("ViewContent", { currency, content_type: "product", contents });
    // o singură dată la montare
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
