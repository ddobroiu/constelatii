"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { nanoid } from "nanoid";
import Starfield from "@/components/Starfield";
import FigurePalette from "@/components/board/FigurePalette";
import { DEFAULT_FIGURE_COLOR, roleLabel, type BoardConfig, type FigureColor, type FigureRole } from "@/lib/board/types";
import { nextFigurePosition } from "@/lib/board/geometry";

const BoardCanvas = dynamic(() => import("@/components/board/BoardCanvas"), { ssr: false });

const CANVAS_SIZE = { width: 720, height: 480 };

function initialBoardConfig(): BoardConfig {
  return { figures: [], relationships: [], canvasSize: CANVAS_SIZE };
}

export default function HartaPage() {
  const [boardConfig, setBoardConfig] = useState<BoardConfig>(initialBoardConfig);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedFigure = boardConfig.figures.find((f) => f.id === selectedId) ?? null;

  function addFigure(role: FigureRole) {
    const id = nanoid();
    setBoardConfig((prev) => ({
      ...prev,
      figures: [
        ...prev.figures,
        {
          id,
          role,
          label: roleLabel(role),
          position: nextFigurePosition(prev.figures.length),
          rotation: 0,
          color: DEFAULT_FIGURE_COLOR,
          isPrimaryUser: role === "eu",
        },
      ],
    }));
    setSelectedId(id);
  }

  function updateFigure(id: string, patch: { x?: number; y?: number; rotation?: number }) {
    setBoardConfig((prev) => ({
      ...prev,
      figures: prev.figures.map((f) =>
        f.id === id
          ? {
              ...f,
              position: {
                x: patch.x ?? f.position.x,
                y: patch.y ?? f.position.y,
              },
              rotation: patch.rotation ?? f.rotation,
            }
          : f
      ),
    }));
  }

  function relabelFigure(id: string, label: string) {
    setBoardConfig((prev) => ({
      ...prev,
      figures: prev.figures.map((f) => (f.id === id ? { ...f, label } : f)),
    }));
  }

  function recolorFigure(id: string, color: FigureColor) {
    setBoardConfig((prev) => ({
      ...prev,
      figures: prev.figures.map((f) => (f.id === id ? { ...f, color } : f)),
    }));
  }

  function removeFigure(id: string) {
    setBoardConfig((prev) => ({
      ...prev,
      figures: prev.figures.filter((f) => f.id !== id),
      relationships: prev.relationships.filter((r) => r.fromId !== id && r.toId !== id),
    }));
    setSelectedId(null);
  }

  return (
    <div className="relative flex flex-1 flex-col items-center gap-8 overflow-hidden px-6 py-16">
      <Starfield count={80} />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold sm:text-3xl">Așază-ți constelația</h1>
        <p className="max-w-xl text-sm text-foreground/60">
          Adaugă figurile relevante pentru situația ta, poziționează-le pe tablă și setează-le
          direcția.
        </p>
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-start gap-6 sm:flex-row sm:justify-center">
        <BoardCanvas
          boardConfig={boardConfig}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateFigure={updateFigure}
        />
        <FigurePalette
          figures={boardConfig.figures}
          selectedFigure={selectedFigure}
          onAdd={addFigure}
          onRelabel={relabelFigure}
          onRecolor={recolorFigure}
          onRemove={removeFigure}
        />
      </div>
    </div>
  );
}
