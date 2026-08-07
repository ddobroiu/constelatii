"use client";

import { useState } from "react";
import { FIGURE_ROLES, type FigureRole } from "@/lib/board/types";
import {
  FOCUS_RELATIONSHIPS,
  PRESENTING_THEMES,
  type FocusRelationship,
  type PresentingTheme,
  type QuestionnaireAnswers,
} from "@/lib/questionnaire/schema";

const STEP_LABELS = ["Situația", "Contextul", "Persoanele", "Recapitulare"];

interface QuestionnaireWizardProps {
  onComplete: (answers: QuestionnaireAnswers) => void;
}

export default function QuestionnaireWizard({ onComplete }: QuestionnaireWizardProps) {
  const [step, setStep] = useState(0);
  const [focusRelationship, setFocusRelationship] = useState<FocusRelationship | null>(null);
  const [presentingThemes, setPresentingThemes] = useState<PresentingTheme[]>([]);
  const [presentingIssue, setPresentingIssue] = useState("");
  const [selectedFigures, setSelectedFigures] = useState<FigureRole[]>(["eu"]);
  const [freeText, setFreeText] = useState("");

  function toggleTheme(theme: PresentingTheme) {
    setPresentingThemes((prev) => (prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]));
  }

  function toggleFigure(role: FigureRole) {
    if (role === "eu") return; // always included
    setSelectedFigures((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  }

  const canGoNext = [
    focusRelationship !== null,
    true, // context step is optional
    selectedFigures.length >= 2,
    true,
  ][step];

  function next() {
    if (step < STEP_LABELS.length - 1) setStep((s) => s + 1);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function submit() {
    if (!focusRelationship) return;
    onComplete({
      focusRelationship,
      presentingThemes,
      presentingIssue: presentingIssue.trim() || undefined,
      selectedFigures,
      freeText: freeText.trim() || undefined,
    });
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-accent" : "bg-white/10"
              }`}
            />
          </div>
        ))}
      </div>
      <p className="mb-6 text-xs uppercase tracking-wide text-foreground/40">
        Pasul {step + 1} din {STEP_LABELS.length} · {STEP_LABELS[step]}
      </p>

      {step === 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="mb-1 text-xl font-medium">Ce relație vrei să explorezi astăzi?</h2>
          {FOCUS_RELATIONSHIPS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFocusRelationship(option.value)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                focusRelationship === option.value
                  ? "border-accent bg-accent/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-foreground/50">{option.description}</div>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-medium">Ce te aduce aici?</h2>
          <div className="flex flex-wrap gap-2">
            {PRESENTING_THEMES.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => toggleTheme(theme)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  presentingThemes.includes(theme)
                    ? "border-accent bg-accent/20 text-foreground"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
          <textarea
            value={presentingIssue}
            onChange={(e) => setPresentingIssue(e.target.value)}
            maxLength={600}
            rows={4}
            placeholder="Vrei să adaugi mai multe detalii? (opțional)"
            className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm outline-none focus:border-accent"
          />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">Cine ar trebui să facă parte din constelație?</h2>
          <p className="text-sm text-foreground/50">Tu ești mereu inclus. Alege pe oricine altcineva e relevant.</p>
          <div className="flex flex-wrap gap-2">
            {FIGURE_ROLES.map((role) => {
              const isEu = role.value === "eu";
              const isSelected = selectedFigures.includes(role.value);
              return (
                <button
                  key={role.value}
                  type="button"
                  disabled={isEu}
                  onClick={() => toggleFigure(role.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed ${
                    isSelected ? "border-accent bg-accent/20 text-foreground" : "border-white/10 bg-white/5 hover:bg-white/10"
                  } ${isEu ? "opacity-60" : ""}`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-medium">Recapitulare</h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground/70">
            <p>
              <span className="text-foreground/40">Situație: </span>
              {FOCUS_RELATIONSHIPS.find((f) => f.value === focusRelationship)?.label}
            </p>
            {presentingThemes.length > 0 && (
              <p className="mt-1">
                <span className="text-foreground/40">Teme: </span>
                {presentingThemes.join(", ")}
              </p>
            )}
            <p className="mt-1">
              <span className="text-foreground/40">Persoane: </span>
              {selectedFigures.map((r) => FIGURE_ROLES.find((f) => f.value === r)?.label).join(", ")}
            </p>
          </div>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            maxLength={600}
            rows={3}
            placeholder="Altceva ce ar trebui să știm? (opțional)"
            className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm outline-none focus:border-accent"
          />
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="text-sm text-foreground/50 hover:text-foreground disabled:opacity-0"
        >
          Înapoi
        </button>

        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canGoNext}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
          >
            Continuă
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft"
          >
            Continuă spre tablă
          </button>
        )}
      </div>
    </div>
  );
}
