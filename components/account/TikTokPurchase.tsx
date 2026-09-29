"use client";

import { useEffect } from "react";
import { loadTikTok, marketingAccepted, trackTikTok } from "@/lib/tiktok";

/**
 * Evenimentul TikTok `CompletePayment` la întoarcerea de la Stripe (/cont?plata=succes).
 *
 * /cont e exclus pentru pixel; aici îl încărcăm doar pentru acest eveniment (fără
 * page view) și doar cu acord pentru marketing. Dacă acordul vine cât timp pagina e
 * deschisă, evenimentul pleacă atunci. O singură dată pe comandă. Fără date personale.
 */
export default function TikTokPurchase({
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
    const key = `tt_purchase_${orderId}`;
    try {
      if (localStorage.getItem(key) === "1") return;
    } catch {
      /* storage indisponibil */
    }

    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (marketingAccepted() && loadTikTok({ trackPage: false })) {
        clearInterval(timer);
        trackTikTok("CompletePayment", {
          value,
          currency,
          content_type: "product",
          contents: [{ content_id: pack, content_name: pack, quantity: 1, price: value }],
          order_id: orderId,
          event_id: orderId,
        });
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
