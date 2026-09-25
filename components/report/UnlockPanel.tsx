"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FullReport } from "@/lib/claude/schema";

interface UnlockPanelProps {
  constellationId: string;
  onUnlocked: (report: FullReport) => void;
}

type WalletStatus = "loading" | "ready" | "error";
type UnlockStatus = "idle" | "loading" | "error";

/**
 * Butonul de deblocare, comun celor două locuri unde apare (imediat după
 * construirea tablei, și la reluarea unei constelații salvate): arată
 * creditele rămase, cheltuiește unul la apăsare, sau trimite spre /pachete
 * dacă nu mai sunt credite.
 */
export default function UnlockPanel({ constellationId, onUnlocked }: UnlockPanelProps) {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>("loading");
  const [credits, setCredits] = useState(0);
  const [unlockStatus, setUnlockStatus] = useState<UnlockStatus>("idle");
  const [unlockError, setUnlockError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/wallet")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { creditsBalance: number }) => {
        if (cancelled) return;
        setCredits(data.creditsBalance);
        setWalletStatus("ready");
      })
      .catch(() => !cancelled && setWalletStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  async function unlock() {
    setUnlockStatus("loading");
    setUnlockError(null);
    try {
      const res = await fetch(`/api/constellations/${constellationId}/unlock`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Nu am putut debloca raportul.");
      onUnlocked(body.fullReport as FullReport);
      setUnlockStatus("idle");
    } catch (err) {
      setUnlockError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
      setUnlockStatus("error");
      // Cheltuirea a putut eșua sau reuși pe server — reverificăm soldul real în loc să-l ghicim.
      fetch("/api/wallet")
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { creditsBalance: number } | null) => data && setCredits(data.creditsBalance));
    }
  }

  if (walletStatus === "loading") {
    return <p className="text-xs text-foreground/40">Se verifică portofelul…</p>;
  }

  if (walletStatus === "error") {
    return <p className="text-sm text-red-300/80">Nu am putut verifica portofelul. Reîncarcă pagina.</p>;
  }

  if (credits <= 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-foreground/60">Nu mai ai credite pentru un raport complet.</p>
        <Link
          href="/pachete"
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft"
        >
          Alege un pachet
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={unlock}
        disabled={unlockStatus === "loading"}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
      >
        {unlockStatus === "loading"
          ? "Se generează raportul…"
          : `Deblochează cu 1 credit · ${credits} ${credits === 1 ? "rămas" : "rămase"}`}
      </button>
      {unlockStatus === "error" && unlockError && <p className="text-sm text-red-300/80">{unlockError}</p>}
    </div>
  );
}
