"use client";

import { Layer, Rect, Stage } from "react-konva";
import type { BoardConfig } from "@/lib/board/types";
import FigureToken from "./FigureToken";

interface BoardCanvasProps {
  boardConfig: BoardConfig;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateFigure: (id: string, patch: { x?: number; y?: number; rotation?: number }) => void;
}

export default function BoardCanvas({ boardConfig, selectedId, onSelect, onUpdateFigure }: BoardCanvasProps) {
  const { width, height } = boardConfig.canvasSize;

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) onSelect(null);
      }}
      className="rounded-2xl border border-white/10"
    >
      <Layer>
        <Rect x={0} y={0} width={width} height={height} fill="#0b0d1f" cornerRadius={16} />

        {boardConfig.figures.map((figure) => (
          <FigureToken
            key={figure.id}
            figure={figure}
            x={figure.position.x * width}
            y={figure.position.y * height}
            isSelected={figure.id === selectedId}
            onSelect={onSelect}
            onDragMove={(id, px, py) =>
              onUpdateFigure(id, {
                x: Math.min(1, Math.max(0, px / width)),
                y: Math.min(1, Math.max(0, py / height)),
              })
            }
            onRotate={(id, rotation) => onUpdateFigure(id, { rotation })}
          />
        ))}
      </Layer>
    </Stage>
  );
}
