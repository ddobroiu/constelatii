"use client";

import { useState } from "react";
import type { NatalChart } from "@/lib/astrology/types";

interface GeocodeResult {
  label: string;
  latitude: number;
  longitude: number;
}

interface BirthDataStepProps {
  onComplete: (chart: NatalChart | null) => void;
}

export default function BirthDataStep({ onComplete }: BirthDataStepProps) {
  const [date, setDate] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [time, setTime] = useState("");

  const [placeQuery, setPlaceQuery] = useState("");
  const [placeResults, setPlaceResults] = useState<GeocodeResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<GeocodeResult | null>(null);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "error">("idle");

  const [computeStatus, setComputeStatus] = useState<"idle" | "loading" | "error">("idle");
  const [computeError, setComputeError] = useState<string | null>(null);

  async function searchPlace() {
    if (placeQuery.trim().length < 2) return;
    setSearchStatus("loading");
    setSelectedPlace(null);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(placeQuery.trim())}`);
      if (!res.ok) throw new Error();
      const data: { results: GeocodeResult[] } = await res.json();
      setPlaceResults(data.results);
      setSearchStatus("idle");
    } catch {
      setPlaceResults([]);
      setSearchStatus("error");
    }
  }

  const canCompute = date.length > 0 && selectedPlace !== null && (timeUnknown || time.length > 0);

  async function computeChart() {
    if (!canCompute || !selectedPlace) return;
    setComputeStatus("loading");
    setComputeError(null);
    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time: timeUnknown ? null : time,
          latitude: selectedPlace.latitude,
          longitude: selectedPlace.longitude,
          placeName: selectedPlace.label,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Nu am putut calcula harta natală.");
      }
      const chart: NatalChart = await res.json();
      onComplete(chart);
    } catch (err) {
      setComputeError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
      setComputeStatus("error");
    }
  }

  return (
    <div className="w-full max-w-xl">
      <p className="mb-6 text-xs uppercase tracking-wide text-foreground/40">Pas opțional · Astrologie</p>

      <h2 className="mb-2 text-xl font-medium">Vrei să adaugi și harta ta natală?</h2>
      <p className="mb-6 text-sm text-foreground/50">
        Complet opțional — dacă adaugi data, ora și locul nașterii tale, interpretarea integrează și plasamentele
        astrologice relevante. Fără ora exactă, obții tot planetele și zodiile, dar nu casele astrologice.
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-foreground/50">Data nașterii</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-xs text-foreground/50">
            <span>Ora nașterii</span>
            <span className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={timeUnknown}
                onChange={(e) => setTimeUnknown(e.target.checked)}
                className="accent-accent"
              />
              Nu știu ora exactă
            </span>
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={timeUnknown}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-30"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-foreground/50">Locul nașterii</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={placeQuery}
              onChange={(e) => setPlaceQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchPlace())}
              placeholder="ex. Cluj-Napoca, România"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={searchPlace}
              disabled={searchStatus === "loading"}
              className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              Caută
            </button>
          </div>
          {searchStatus === "error" && (
            <p className="mt-2 text-xs text-red-300/80">Căutarea a eșuat. Încearcă din nou.</p>
          )}
          {selectedPlace ? (
            <p className="mt-2 text-xs text-accent">✓ {selectedPlace.label}</p>
          ) : (
            placeResults.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1">
                {placeResults.map((r, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlace(r);
                        setPlaceResults([]);
                      }}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-foreground/70 transition-colors hover:bg-white/10"
                    >
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

        {computeStatus === "error" && computeError && <p className="text-sm text-red-300/80">{computeError}</p>}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onComplete(null)}
          className="text-sm text-foreground/50 hover:text-foreground"
        >
          Sar peste acest pas
        </button>
        <button
          type="button"
          onClick={computeChart}
          disabled={!canCompute || computeStatus === "loading"}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
        >
          {computeStatus === "loading" ? "Se calculează…" : "Continuă spre tablă"}
        </button>
      </div>
    </div>
  );
}
