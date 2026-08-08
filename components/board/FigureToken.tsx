"use client";

import { useRef } from "react";
import { Circle, Group, Line, RegularPolygon, Text } from "react-konva";
import type Konva from "konva";
import { colorHex, type Figure } from "@/lib/board/types";
import { facingVector } from "@/lib/board/geometry";
import SymbolIcon from "./SymbolIcon";

const RADIUS = 26;
const ARROW_DISTANCE = RADIUS + 14;
const HANDLE_DISTANCE = RADIUS + 28;

interface FigureTokenProps {
  figure: Figure;
  x: number;
  y: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragMove: (id: string, x: number, y: number) => void;
  onRotate: (id: string, rotationDeg: number) => void;
}

function angleFromCenter(centerX: number, centerY: number, pointerX: number, pointerY: number): number {
  const dx = pointerX - centerX;
  const dy = pointerY - centerY;
  // atan2(dx, -dy) matches facingVector's convention: 0deg = up, clockwise positive.
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return (deg + 360) % 360;
}

export default function FigureToken({ figure, x, y, isSelected, onSelect, onDragMove, onRotate }: FigureTokenProps) {
  const groupRef = useRef<Konva.Group>(null);

  const facing = facingVector(figure.rotation);
  const arrowX = facing.x * ARROW_DISTANCE;
  const arrowY = facing.y * ARROW_DISTANCE;
  const handleX = facing.x * HANDLE_DISTANCE;
  const handleY = facing.y * HANDLE_DISTANCE;

  const fill = colorHex(figure.color);

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      draggable
      onClick={() => onSelect(figure.id)}
      onTap={() => onSelect(figure.id)}
      onDragMove={(e) => onDragMove(figure.id, e.target.x(), e.target.y())}
    >
      <Circle
        radius={RADIUS}
        fill="rgba(255,255,255,0.06)"
        stroke={isSelected ? "#f1f0ff" : figure.isPrimaryUser ? "#f8fafc" : "rgba(255,255,255,0.35)"}
        strokeWidth={isSelected ? 2.5 : figure.isPrimaryUser ? 2 : 1.5}
        shadowColor="#000"
        shadowBlur={isSelected ? 12 : 4}
        shadowOpacity={0.4}
      />

      <SymbolIcon icon={figure.symbol} x={0} y={0} size={RADIUS * 1.15} fill={fill} listening={false} />

      {/* Facing indicator — always visible, not just on selection, so orientation reads at a glance. */}
      <Line
        points={[facing.x * RADIUS, facing.y * RADIUS, arrowX, arrowY]}
        stroke="#f1f0ff"
        strokeWidth={2}
        listening={false}
      />
      <RegularPolygon
        x={arrowX}
        y={arrowY}
        sides={3}
        radius={7}
        rotation={figure.rotation}
        fill="#f1f0ff"
        stroke="#05060f"
        strokeWidth={1}
        listening={false}
      />

      <Text
        text={figure.label}
        fontSize={12}
        fill="#f1f0ff"
        width={90}
        offsetX={45}
        y={RADIUS + 24}
        align="center"
      />

      {isSelected && (
        <Circle
          x={handleX}
          y={handleY}
          radius={7}
          fill="#f1f0ff"
          draggable
          onDragMove={(e) => {
            const rotation = angleFromCenter(0, 0, e.target.x(), e.target.y());
            const rad = (rotation * Math.PI) / 180;
            e.target.x(Math.sin(rad) * HANDLE_DISTANCE);
            e.target.y(-Math.cos(rad) * HANDLE_DISTANCE);
            onRotate(figure.id, rotation);
          }}
          onDragEnd={(e) => {
            const rotation = angleFromCenter(0, 0, e.target.x(), e.target.y());
            onRotate(figure.id, rotation);
          }}
        />
      )}
    </Group>
  );
}
