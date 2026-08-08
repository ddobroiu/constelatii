"use client";

import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import type { BoardConfig } from "@/lib/board/types";
import FigureToken from "./FigureToken";
import ConnectorEdge from "./ConnectorEdge";

interface BoardCanvasProps {
  boardConfig: BoardConfig;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateFigure: (id: string, patch: { x?: number; y?: number; rotation?: number }) => void;
}

export default function BoardCanvas({ boardConfig, selectedId, onSelect, onUpdateFigure }: BoardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: designWidth, height: designHeight } = boardConfig.canvasSize;
  const aspectRatio = designHeight / designWidth;

  // Figure positions are stored normalized (0-1), so the stage can render at any
  // pixel size without distorting the layout — shrink it to fit narrow (mobile) screens.
  const [width, setWidth] = useState(designWidth);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const available = entries[0].contentRect.width;
      if (available > 0) setWidth(Math.min(designWidth, available));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [designWidth]);

  const height = width * aspectRatio;

  return (
    <div ref={containerRef} className="w-full">
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

          {boardConfig.relationships.map((rel) => {
            const from = boardConfig.figures.find((f) => f.id === rel.fromId);
            const to = boardConfig.figures.find((f) => f.id === rel.toId);
            if (!from || !to) return null;
            return (
              <ConnectorEdge
                key={rel.id}
                relationship={rel}
                from={{ x: from.position.x * width, y: from.position.y * height }}
                to={{ x: to.position.x * width, y: to.position.y * height }}
              />
            );
          })}

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
    </div>
  );
}
