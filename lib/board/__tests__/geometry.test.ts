import { describe, it, expect } from "vitest";
import { facingQualifier, distanceBetween, distanceQualifier, nextFigurePosition } from "../geometry";
import type { Figure } from "../types";

function makeFigure(id: string, x: number, y: number, rotation: number): Figure {
  return {
    id,
    role: "eu",
    label: id,
    position: { x, y },
    rotation,
    color: "indigo",
    isPrimaryUser: false,
  };
}

describe("distanceBetween / distanceQualifier", () => {
  it("computes euclidean distance in normalized board space", () => {
    const a = makeFigure("a", 0, 0, 0);
    const b = makeFigure("b", 0.3, 0.4, 0);
    expect(distanceBetween(a, b)).toBeCloseTo(0.5, 5);
    expect(distanceQualifier(distanceBetween(a, b))).toBe("departe"); // exactly 0.5, at the "distanță medie" upper boundary
  });
});

describe("facingQualifier", () => {
  it("'orientat spre' when a figure faces directly toward another", () => {
    // b is directly below a (larger y); rotation 180 faces "down" in screen space.
    const a = makeFigure("a", 0.5, 0.2, 180);
    const b = makeFigure("b", 0.5, 0.8, 0);
    expect(facingQualifier(a, b)).toBe("orientat spre");
  });

  it("'cu spatele la' when a figure faces directly away from another", () => {
    // b is below a, but a faces up (rotation 0) -> back is turned to b.
    const a = makeFigure("a", 0.5, 0.2, 0);
    const b = makeFigure("b", 0.5, 0.8, 0);
    expect(facingQualifier(a, b)).toBe("cu spatele la");
  });

  it("'neutru' when b is roughly to the side of a's facing direction", () => {
    // a faces up (0°); b is directly to the right -> 90° off facing, neither toward nor away.
    const a = makeFigure("a", 0.2, 0.5, 0);
    const b = makeFigure("b", 0.8, 0.5, 0);
    expect(facingQualifier(a, b)).toBe("neutru");
  });

  it("is symmetric-safe: two figures facing each other are each 'orientat spre' the other", () => {
    const a = makeFigure("a", 0.4, 0.5, 90); // faces right, toward b
    const b = makeFigure("b", 0.6, 0.5, 270); // faces left, toward a
    expect(facingQualifier(a, b)).toBe("orientat spre");
    expect(facingQualifier(b, a)).toBe("orientat spre");
  });
});

describe("nextFigurePosition", () => {
  it("places the first figure dead center", () => {
    expect(nextFigurePosition(0)).toEqual({ x: 0.5, y: 0.5 });
  });

  it("spirals subsequent figures outward without ever overlapping the center", () => {
    const positions = Array.from({ length: 8 }, (_, i) => nextFigurePosition(i));
    for (let i = 1; i < positions.length; i++) {
      const p = positions[i];
      expect(p.x).toBeGreaterThanOrEqual(0.05);
      expect(p.x).toBeLessThanOrEqual(0.95);
      expect(p.y).toBeGreaterThanOrEqual(0.05);
      expect(p.y).toBeLessThanOrEqual(0.95);
      expect(p.x !== 0.5 || p.y !== 0.5).toBe(true);
    }
  });
});
