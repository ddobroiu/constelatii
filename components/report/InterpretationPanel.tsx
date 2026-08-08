"use client";

import { useState } from "react";
import type { BoardConfig } from "@/lib/board/types";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import type { FullReport } from "@/lib/claude/schema";

interface InterpretationPanelProps {
  board: BoardConfig;
  questionnaire: QuestionnaireAnswers | null;
}

type TeaserStatus = "idle" | "loading" | "error" | "done";
type FullStatus = "idle" | "loading" | "error" | "done";

export default function InterpretationPanel({ board, questionnaire }: InterpretationPanelProps) {
  const [teaserStatus, setTeaserStatus] = useState<TeaserStatus>("idle");
  const [teaserError, setTeaserError] = useState<string | null>(null);
  const [teaser, setTeaser] = useState<string | null>(null);

  const [fullStatus, setFullStatus] = useState<FullStatus>("idle");
  const [fullError, setFullError] = useState<string | null>(null);
  const [full, setFull] = useState<FullReport | null>(null);

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

  async function fetchFullReport() {
    if (!questionnaire) return;
    setFullStatus("loading");
    setFullError(null);
    try {
      const res = await fetch("/api/interpret/full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board, questionnaire }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Generarea raportului a eșuat.");
      }
      const data: FullReport = await res.json();
      setFull(data);
      setFullStatus("done");
    } catch (err) {
      setFullError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
      setFullStatus("error");
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

          {fullStatus !== "done" && (
            <div className="flex flex-col items-center gap-2">
              <div className="h-px w-full bg-white/10" />
              <button
                type="button"
                onClick={fetchFullReport}
                disabled={fullStatus === "loading"}
                className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
              >
                {fullStatus === "loading" ? "Se generează raportul complet…" : "Deblochează raportul complet"}
              </button>
              {fullStatus === "loading" && (
                <p className="text-xs text-foreground/40">Poate dura unul-două minute — analiză detaliată, model de calitate maximă.</p>
              )}
              {fullStatus === "error" && fullError && <p className="text-sm text-red-300/80">{fullError}</p>}
            </div>
          )}

          {fullStatus === "done" && full && (
            <>
              <div className="h-px bg-white/10" />
              <p className="text-foreground/80">{full.introducere}</p>
              {full.sectiuni.map((sectiune, i) => (
                <div key={i}>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{sectiune.titlu}</h3>
                  <p className="whitespace-pre-line text-foreground/80">{sectiune.continut}</p>
                </div>
              ))}
              <p className="text-foreground/80">{full.concluzie}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
