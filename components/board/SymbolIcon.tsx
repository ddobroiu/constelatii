"use client";

import { Circle, Group, Path } from "react-konva";
import { SYMBOL_ICON_PARTS, type SymbolIconId } from "@/lib/symbols/library";

interface SymbolIconProps {
  icon: SymbolIconId;
  x: number;
  y: number;
  size: number;
  fill: string;
  listening?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOpacity?: number;
}

/** Renders a Material-Symbols-derived icon (24x24 source space) via Konva primitives. */
export default function SymbolIcon({
  icon,
  x,
  y,
  size,
  fill,
  listening = true,
  shadowColor,
  shadowBlur,
  shadowOpacity,
}: SymbolIconProps) {
  const scale = size / 24;
  const parts = SYMBOL_ICON_PARTS[icon];

  return (
    <Group x={x} y={y} offsetX={12} offsetY={12} scaleX={scale} scaleY={scale} listening={listening}>
      {parts.map((part, i) =>
        part.type === "path" ? (
          <Path
            key={i}
            data={part.d}
            fill={fill}
            shadowColor={shadowColor}
            shadowBlur={shadowBlur}
            shadowOpacity={shadowOpacity}
          />
        ) : (
          <Circle
            key={i}
            x={part.cx}
            y={part.cy}
            radius={part.r}
            fill={fill}
            shadowColor={shadowColor}
            shadowBlur={shadowBlur}
            shadowOpacity={shadowOpacity}
          />
        )
      )}
    </Group>
  );
}
