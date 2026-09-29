"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCheckoutConsent } from "./CheckoutConsent";
import { trackTikTok } from "@/lib/tiktok";

export default function BuyPackButton({
  code,
  label,
  name,
  price,
}: {
  code: string;
  label: string;
  name?: string;
  price?: number;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const consent = useCheckoutConsent();

  async function buy() {
    if (status !== "loading" && !session?.user) {
      router.push("/autentificare?callbackUrl=/pachete");
      return;
    }
    if (!consent.accepted) {
      consent.setShowError(true);
      return;
    }

    trackTikTok("InitiateCheckout", {
      value: price,
      currency: "RON",
      content_type: "product",
      contents: [{ content_id: code, content_name: name ?? code, quantity: 1, price }],
    });
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: code, consent: true }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Nu am putut porni plata.");
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className="w-full rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
      >
        {loading ? "Se deschide plata…" : label}
      </button>
      {error && <p className="text-sm text-red-300/80">{error}</p>}
    </div>
  );
}
