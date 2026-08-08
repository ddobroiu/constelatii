"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { nanoid } from "nanoid";
import FigurePalette from "@/components/board/FigurePalette";
import ConnectorPanel from "@/components/board/ConnectorPanel";
import InterpretationPanel from "@/components/report/InterpretationPanel";
import {
  DEFAULT_FIGURE_COLOR,
  DEFAULT_FIGURE_SYMBOL,
  roleLabel,
  type BoardConfig,
  type ConnectorSymbolId,
  type Figure,
  type FigureColor,
  type FigureRole,
  type FigureSymbolId,
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
    symbol: DEFAULT_FIGURE_SYMBOL,
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

  function resymbolFigure(id: string, symbol: FigureSymbolId) {
    setBoardConfig((prev) => ({
      ...prev,
      figures: prev.figures.map((f) => (f.id === id ? { ...f, symbol } : f)),
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

  function addConnector(fromId: string, toId: string, symbol: ConnectorSymbolId) {
    setBoardConfig((prev) => ({
      ...prev,
      relationships: [...prev.relationships, { id: nanoid(), fromId, toId, symbol }],
    }));
  }

  function removeConnector(id: string) {
    setBoardConfig((prev) => ({
      ...prev,
      relationships: prev.relationships.filter((r) => r.id !== id),
    }));
  }

  return (
    <div className="relative flex flex-1 flex-col items-center gap-8 overflow-hidden px-6 py-16">

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold sm:text-3xl">Așază-ți constelația</h1>
        <p className="max-w-xl text-sm text-foreground/60">
          {questionnaire
            ? `Ai ales să explorezi: ${focusRelationshipLabel(questionnaire.focusRelationship)}. Poziționează figurile pe tablă și setează-le direcția.`
            : "Adaugă figurile relevante pentru situația ta, poziționează-le pe tablă și setează-le direcția."}
        </p>
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-start gap-6 sm:flex-row sm:justify-center">
        <div className="flex flex-col gap-6">
          <BoardCanvas
            boardConfig={boardConfig}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdateFigure={updateFigure}
          />
          <ConnectorPanel
            figures={boardConfig.figures}
            relationships={boardConfig.relationships}
            onAdd={addConnector}
            onRemove={removeConnector}
          />
        </div>
        <FigurePalette
          figures={boardConfig.figures}
          selectedFigure={selectedFigure}
          onAdd={addFigure}
          onRelabel={relabelFigure}
          onRecolor={recolorFigure}
          onResymbol={resymbolFigure}
          onRemove={removeFigure}
        />
      </div>

      <InterpretationPanel board={boardConfig} questionnaire={questionnaire} />
    </div>
  );
}
