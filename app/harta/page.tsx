"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { nanoid } from "nanoid";
import Starfield from "@/components/Starfield";
import FigurePalette from "@/components/board/FigurePalette";
import {
  DEFAULT_FIGURE_COLOR,
  DEFAULT_FIGURE_SHAPE,
  roleLabel,
  type BoardConfig,
  type Figure,
  type FigureColor,
  type FigureRole,
  type FigureShape,
} from "@/lib/board/types";
import { nextFigurePosition } from "@/lib/board/geometry";
import { focusRelationshipLabel, type QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import { loadQuestionnaireAnswers } from "@/lib/session/clientStore";

const BoardCanvas = dynamic(() => import("@/components/board/BoardCanvas"), { ssr: false });

const CANVAS_SIZE = { width: 720, height: 480 };

function initialBoardConfig(): BoardConfig {
  return { figures: [], relationships: [], canvasSize: CANVAS_SIZE };
}

function makeFigure(role: FigureRole, position: { x: number; y: number }): Figure {
  return {
    id: nanoid(),
    role,
    label: roleLabel(role),
    position,
    rotation: 0,
    color: DEFAULT_FIGURE_COLOR,
    shape: DEFAULT_FIGURE_SHAPE,
    isPrimaryUser: role === "eu",
  };
}

export default function HartaPage() {
  const [boardConfig, setBoardConfig] = useState<BoardConfig>(initialBoardConfig);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireAnswers | null>(null);

  // Seed the board from the questionnaire's chosen figures, once, on first load.
  useEffect(() => {
    const answers = loadQuestionnaireAnswers();
    if (!answers) return;
    setQuestionnaire(answers);
    setBoardConfig((prev) => {
      if (prev.figures.length > 0) return prev;
      const figures = answers.selectedFigures.map((role, i) => makeFigure(role, nextFigurePosition(i)));
      return { ...prev, figures };
    });
  }, []);

  const selectedFigure = boardConfig.figures.find((f) => f.id === selectedId) ?? null;

  function addFigure(role: FigureRole) {
    const figure = makeFigure(role, nextFigurePosition(boardConfig.figures.length));
    setBoardConfig((prev) => ({ ...prev, figures: [...prev.figures, figure] }));
    setSelectedId(figure.id);
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

  function reshapeFigure(id: string, shape: FigureShape) {
    setBoardConfig((prev) => ({
      ...prev,
      figures: prev.figures.map((f) => (f.id === id ? { ...f, shape } : f)),
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
          {questionnaire
            ? `Ai ales să explorezi: ${focusRelationshipLabel(questionnaire.focusRelationship)}. Poziționează figurile pe tablă și setează-le direcția.`
            : "Adaugă figurile relevante pentru situația ta, poziționează-le pe tablă și setează-le direcția."}
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
          onReshape={reshapeFigure}
          onRemove={removeFigure}
        />
      </div>
    </div>
  );
}
