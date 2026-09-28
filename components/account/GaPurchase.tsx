"use client";

import { useEffect } from "react";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent";

type Gtag = (...args: unknown[]) => void;

function analyticsAccepted(): boolean {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
    return parseConsent(match?.[1])?.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Evenimentul GA4 `purchase` la întoarcerea de la Stripe (/cont?plata=succes).
 *
 * Doar cu acord pentru statistici și doar după ce GA4 a fost configurat de
 * CookieConsent (scriptul `ga4-gtag` există). Dacă acordul vine cât timp pagina
 * e deschisă, evenimentul pleacă atunci. O singură dată pe tranzacție, chiar
 * dacă pagina se reîncarcă. Fără date personale.
 */
export default function GaPurchase({
  transactionId,
  value,
  currency,
  pack,
}: {
  transactionId: string;
  value: number;
  currency: string;
  pack: string;
}) {
  useEffect(() => {
    const key = `ga_purchase_${transactionId}`;
    try {
      if (localStorage.getItem(key) === "1") return;
    } catch {
      /* storage indisponibil */
    }

    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      if (analyticsAccepted() && typeof gtag === "function" && document.getElementById("ga4-gtag")) {
        clearInterval(timer);
        gtag("event", "purchase", {
          transaction_id: transactionId,
          value,
          currency,
          items: [{ item_id: pack, item_name: pack, price: value, quantity: 1 }],
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
  }, [transactionId, value, currency, pack]);

  return null;
}
