"use client";

import { useEffect } from "react";
import { loadMetaPixel, trackMeta } from "@/lib/meta-pixel";
import { marketingAccepted } from "@/lib/tiktok";

/**
 * Evenimentul Meta `Purchase` la întoarcerea de la Stripe (/cont?plata=succes).
 * /cont e exclus pentru pixel; îl încărcăm doar pentru acest eveniment, doar cu acord
 * pentru marketing. eventID = id-ul cumpărării, ca la Conversions API (fără dubluri).
 */
export default function MetaPurchase({
  orderId,
  value,
  currency,
  pack,
}: {
  orderId: string;
  value: number;
  currency: string;
  pack: string;
}) {
  useEffect(() => {
    const key = `fb_purchase_${orderId}`;
    try {
      if (localStorage.getItem(key) === "1") return;
    } catch {
      /* storage indisponibil */
    }

    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (marketingAccepted() && loadMetaPixel({ trackPage: false })) {
        clearInterval(timer);
        trackMeta(
          "Purchase",
          { value, currency, content_type: "product", content_ids: [pack], num_items: 1 },
          orderId,
        );
        try {
          localStorage.setItem(key, "1");
        } catch {
          /* storage indisponibil */
        }
      } else if (tries >= 120) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [orderId, value, currency, pack]);

  return null;
}
