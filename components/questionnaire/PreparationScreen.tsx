"use client";

import { useEffect, useState } from "react";

const AMBIENT_VIDEO_ID = "Psarp3j5acI";
const COUNTDOWN_SECONDS = 10 * 60;

interface PreparationScreenProps {
  onContinue: () => void;
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PreparationScreen({ onContinue }: PreparationScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  return (
    <div className="w-full max-w-xl text-center">
      <p className="mb-6 text-xs uppercase tracking-wide text-foreground/40">Înainte să începi</p>

      <h2 className="mb-4 text-2xl font-medium">Fă-ți loc pentru câteva minute</h2>
      <p className="mb-8 text-sm leading-relaxed text-foreground/60">
        Retrage-te undeva liniștit, dacă poți, pentru vreo 10 minute. Pune telefonul pe silențios și lasă deoparte
        orice te-ar putea distrage. Nu trebuie să faci nimic anume — doar să fii atent la ce simți față de situația
        pe care ai ales s-o explorezi.
      </p>

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-4 text-3xl font-light tabular-nums text-foreground/80">{formatTime(secondsLeft)}</p>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm transition-colors hover:bg-white/10"
        >
          {isPlaying ? "Oprește muzica" : "♪ Pornește o muzică de fundal"}
        </button>

        {isPlaying && (
          <div className="mt-4 flex justify-center">
            <iframe
              width="220"
              height="124"
              src={`https://www.youtube.com/embed/${AMBIENT_VIDEO_ID}?autoplay=1&controls=1&modestbranding=1&rel=0`}
              title="Muzică ambientală"
              allow="autoplay; encrypted-media"
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="rounded-full bg-accent px-8 py-3 text-base font-medium text-background transition-colors hover:bg-accent-soft"
      >
        Sunt gata, continuă spre tablă
      </button>
    </div>
  );
}
