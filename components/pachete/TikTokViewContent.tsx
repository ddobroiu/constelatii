"use client";

import { useEffect } from "react";
import { trackTikTok } from "@/lib/tiktok";
import { trackMeta } from "@/lib/meta-pixel";

type Content = { content_id: string; content_name: string; quantity: number; price: number };

/** TikTok + Meta `ViewContent` pe pagina pachetelor — doar cu acord pentru marketing (vezi lib/tiktok). */
export default function TikTokViewContent({ currency, contents }: { currency: string; contents: Content[] }) {
  useEffect(() => {
    trackTikTok("ViewContent", { currency, content_type: "product", contents });
    trackMeta("ViewContent", {
      currency,
      content_type: "product",
      content_ids: contents.map((c) => c.content_id),
      contents: contents.map((c) => ({ id: c.content_id, quantity: c.quantity, item_price: c.price })),
    });
    // o singură dată la montare
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
