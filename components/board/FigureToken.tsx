"use client";

import { useRef } from "react";
import { Circle, Group, Line, RegularPolygon, Rect, Star, Text } from "react-konva";
import type Konva from "konva";
import { colorHex, type Figure } from "@/lib/board/types";
import { facingVector } from "@/lib/board/geometry";

const RADIUS = 26;
const HANDLE_DISTANCE = RADIUS + 18;

interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOpacity: number;
}

function FigureBody({ shape, style }: { shape: Figure["shape"]; style: ShapeStyle }) {
  switch (shape) {
    case "patrat":
      return <Rect width={RADIUS * 1.6} height={RADIUS * 1.6} offsetX={RADIUS * 0.8} offsetY={RADIUS * 0.8} cornerRadius={4} {...style} />;
    case "triunghi":
      return <RegularPolygon sides={3} radius={RADIUS * 1.2} {...style} />;
    case "romb":
      return <RegularPolygon sides={4} radius={RADIUS * 1.1} {...style} />;
    case "hexagon":
      return <RegularPolygon sides={6} radius={RADIUS} {...style} />;
    case "stea":
      return <Star numPoints={5} innerRadius={RADIUS * 0.5} outerRadius={RADIUS * 1.15} {...style} />;
    case "cerc":
    default:
      return <Circle radius={RADIUS} {...style} />;
  }
}

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
      <FigureBody
        shape={figure.shape}
        style={{
          fill,
          stroke: isSelected ? "#f1f0ff" : figure.isPrimaryUser ? "#f8fafc" : "rgba(255,255,255,0.35)",
          strokeWidth: isSelected ? 2.5 : figure.isPrimaryUser ? 2 : 1.5,
          shadowColor: "#000",
          shadowBlur: isSelected ? 12 : 4,
          shadowOpacity: 0.4,
        }}
      />

      <Line points={[0, 0, handleX * 0.55, handleY * 0.55]} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />

      <Text
        text={figure.label}
        fontSize={12}
        fill="#f1f0ff"
        width={90}
        offsetX={45}
        y={RADIUS + 8}
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
