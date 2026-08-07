"use client";

import { Circle, Line } from "react-konva";
import SymbolIcon from "./SymbolIcon";
import { connectorSymbolMeaning } from "@/lib/symbols/library";
import type { Relationship } from "@/lib/board/types";

interface ConnectorEdgeProps {
  relationship: Relationship;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

const BADGE_RADIUS = 15;

export default function ConnectorEdge({ relationship, from, to }: ConnectorEdgeProps) {
  const def = connectorSymbolMeaning(relationship.symbol);
  if (!def) return null;

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <>
      <Line points={[from.x, from.y, to.x, to.y]} stroke="rgba(241,240,255,0.25)" strokeWidth={1.5} listening={false} />
      <Circle
        x={midX}
        y={midY}
        radius={BADGE_RADIUS}
        fill="#05060f"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1.5}
        listening={false}
      />
      <SymbolIcon icon={def.icon} x={midX} y={midY} size={BADGE_RADIUS * 1.3} fill="#f1f0ff" listening={false} />
    </>
  );
}
