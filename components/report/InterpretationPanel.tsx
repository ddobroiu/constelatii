"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { BoardConfig } from "@/lib/board/types";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";

interface InterpretationPanelProps {
  board: BoardConfig;
  questionnaire: QuestionnaireAnswers | null;
}

type TeaserStatus = "idle" | "loading" | "error" | "done";
type SaveStatus = "idle" | "saving" | "done" | "error";
type CheckoutStatus = "idle" | "loading" | "error";

export default function InterpretationPanel({ board, questionnaire }: InterpretationPanelProps) {
  const { data: session, status: sessionStatus } = useSession();

  const [teaserStatus, setTeaserStatus] = useState<TeaserStatus>("idle");
  const [teaserError, setTeaserError] = useState<string | null>(null);
  const [teaser, setTeaser] = useState<string | null>(null);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [constellationId, setConstellationId] = useState<string | null>(null);

  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const canInterpret = board.figures.length >= 2 && questionnaire !== null;

  async function fetchTeaser() {
    if (!questionnaire) return;
    setTeaserStatus("loading");
    setTeaserError(null);
    try {
      const res = await fetch("/api/interpret/teaser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board, questionnaire }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Interpretarea a eșuat.");
      }
      const data: { teaser: string } = await res.json();
      setTeaser(data.teaser);
      setTeaserStatus("done");
    } catch (err) {
      setTeaserError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
      setTeaserStatus("error");
    }
  }

  // Odată ce teaser-ul e gata, salvează automat constelația dacă utilizatorul e autentificat.
  useEffect(() => {
    if (teaserStatus !== "done" || !teaser || !questionnaire) return;
    if (!session?.user || constellationId || saveStatus === "saving") return;

    setSaveStatus("saving");
    fetch("/api/constellations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board, questionnaire, teaserText: teaser }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data: { id: string } = await res.json();
        setConstellationId(data.id);
        setSaveStatus("done");
      })
      .catch(() => setSaveStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teaserStatus, teaser, session]);

  async function unlockFullReport() {
    if (!constellationId) return;
    setCheckoutStatus("loading");
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ constellationId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Nu am putut porni plata.");
      }
      const data: { url: string } = await res.json();
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
      setCheckoutStatus("error");
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {teaserStatus !== "done" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <button
            type="button"
            onClick={fetchTeaser}
            disabled={!canInterpret || teaserStatus === "loading"}
            className="rounded-full bg-accent px-8 py-3 text-base font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
          >
            {teaserStatus === "loading" ? "Se analizează constelația…" : "Interpretează constelația"}
          </button>

          {!questionnaire && (
            <p className="text-xs text-foreground/40">Completează mai întâi chestionarul pentru a debloca interpretarea.</p>
          )}
          {questionnaire && board.figures.length < 2 && (
            <p className="text-xs text-foreground/40">Ai nevoie de cel puțin două figuri pe tablă.</p>
          )}
          {teaserStatus === "error" && teaserError && <p className="text-sm text-red-300/80">{teaserError}</p>}
        </div>
      )}

      {teaserStatus === "done" && teaser && (
        <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-lg italic text-foreground/90">{teaser}</p>

          <div className="h-px w-full bg-white/10" />

          {sessionStatus !== "loading" && !session?.user && (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-foreground/60">
                Creează-ți cont gratuit ca să salvezi constelația și să deblochezi raportul complet.
              </p>
              <div className="mt-1 flex gap-3">
                <Link
                  href="/inregistrare"
                  className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-soft"
                >
                  Creează cont
                </Link>
                <Link
                  href="/autentificare"
                  className="rounded-full border border-white/10 px-5 py-2 text-sm text-foreground/80 transition-colors hover:bg-white/10"
                >
                  Autentificare
                </Link>
              </div>
            </div>
          )}

          {session?.user && (
            <div className="flex flex-col items-center gap-2 text-center">
              {saveStatus === "saving" && <p className="text-xs text-foreground/40">Se salvează constelația…</p>}
              {saveStatus === "error" && (
                <p className="text-sm text-red-300/80">Nu am putut salva constelația. Încearcă din nou.</p>
              )}
              {constellationId && (
                <>
                  <button
                    type="button"
                    onClick={unlockFullReport}
                    disabled={checkoutStatus === "loading"}
                    className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {checkoutStatus === "loading" ? "Se deschide plata…" : "Deblochează raportul complet"}
                  </button>
                  {checkoutStatus === "error" && checkoutError && (
                    <p className="text-sm text-red-300/80">{checkoutError}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
