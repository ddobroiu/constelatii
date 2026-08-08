"use client";

import { useEffect, useRef, useState } from "react";
import type { FullReport } from "@/lib/claude/schema";

interface ConstellationDetailProps {
  id: string;
  teaserText: string | null;
  initialFullReport: FullReport | null;
  initialPaid: boolean;
}

export default function ConstellationDetail({
  id,
  teaserText,
  initialFullReport,
  initialPaid,
}: ConstellationDetailProps) {
  const [paid, setPaid] = useState(initialPaid);
  const [fullReport, setFullReport] = useState<FullReport | null>(initialFullReport);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!paid || fullReport) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/constellations/${id}`);
        if (!res.ok) return;
        const data: { fullReport: FullReport | null; paid: boolean } = await res.json();
        setPaid(data.paid);
        if (data.fullReport) {
          setFullReport(data.fullReport);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // ignore transient network errors, keep polling
      }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [paid, fullReport, id]);

  async function startCheckout() {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ constellationId: id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Nu am putut porni plata.");
      }
      const data: { url: string } = await res.json();
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      {teaserText && <p className="text-lg italic text-foreground/90">{teaserText}</p>}

      {!paid && (
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-full bg-white/10" />
          <button
            type="button"
            onClick={startCheckout}
            disabled={checkoutLoading}
            className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
          >
            {checkoutLoading ? "Se deschide plata…" : "Deblochează raportul complet"}
          </button>
          {checkoutError && <p className="text-sm text-red-300/80">{checkoutError}</p>}
        </div>
      )}

      {paid && !fullReport && (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-px w-full bg-white/10" />
          <p className="mt-2 text-sm text-foreground/60">
            Plată confirmată — se generează raportul complet. Poate dura unul-două minute, pagina se actualizează
            automat.
          </p>
        </div>
      )}

      {fullReport && (
        <>
          <div className="h-px bg-white/10" />
          <p className="text-foreground/80">{fullReport.introducere}</p>
          {fullReport.sectiuni.map((sectiune, i) => (
            <div key={i}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{sectiune.titlu}</h3>
              <p className="whitespace-pre-line text-foreground/80">{sectiune.continut}</p>
            </div>
          ))}
          <p className="text-foreground/80">{fullReport.concluzie}</p>
        </>
      )}
    </div>
  );
}
