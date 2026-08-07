import type { Figure } from "./types";

const GOLDEN_ANGLE_DEG = 137.5;

/**
 * Deterministic placement for a newly added figure: the first figure lands
 * dead center, subsequent ones spiral outward using the golden angle so they
 * never overlap and never depend on randomness (predictable for the user,
 * and for automated testing).
 */
export function nextFigurePosition(existingCount: number): { x: number; y: number } {
  if (existingCount === 0) return { x: 0.5, y: 0.5 };

  const angleRad = toRad(existingCount * GOLDEN_ANGLE_DEG);
  const radius = Math.min(0.4, 0.12 + existingCount * 0.015);
  return {
    x: Math.min(0.95, Math.max(0.05, 0.5 + radius * Math.cos(angleRad))),
    y: Math.min(0.95, Math.max(0.05, 0.5 + radius * Math.sin(angleRad))),
  };
}

export type FacingQualifier = "orientat spre" | "cu spatele la" | "neutru";

const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * A figure's facing direction as a unit vector, in normalized board space.
 * rotation=0 points "up" (toward smaller y); rotation increases clockwise,
 * matching Konva's rotation convention so the UI and the geometry agree.
 */
export function facingVector(rotationDeg: number): { x: number; y: number } {
  const r = toRad(rotationDeg);
  return { x: Math.sin(r), y: -Math.cos(r) };
}

export function distanceBetween(a: Figure, b: Figure): number {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Qualitative distance bucket, for prompt-friendly language rather than raw floats. */
export function distanceQualifier(distance: number): "foarte aproape" | "aproape" | "distanță medie" | "departe" {
  if (distance < 0.12) return "foarte aproape";
  if (distance < 0.28) return "aproape";
  if (distance < 0.5) return "distanță medie";
  return "departe";
}

/**
 * How figure `a` is oriented relative to figure `b`: does a's facing
 * direction point toward b, away from b, or neither.
 */
export function facingQualifier(a: Figure, b: Figure): FacingQualifier {
  const dx = b.position.x - a.position.x;
  const dy = b.position.y - a.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance === 0) return "neutru";

  const toB = { x: dx / distance, y: dy / distance };
  const facing = facingVector(a.rotation);
  const dot = facing.x * toB.x + facing.y * toB.y; // cos(angle) between the two vectors
  const angleDeg = (Math.acos(Math.min(1, Math.max(-1, dot))) * 180) / Math.PI;

  if (angleDeg <= 45) return "orientat spre";
  if (angleDeg >= 135) return "cu spatele la";
  return "neutru";
}

export interface PairwiseGeometry {
  aId: string;
  bId: string;
  distance: number;
  distanceQualifier: ReturnType<typeof distanceQualifier>;
  aFacingB: FacingQualifier;
  bFacingA: FacingQualifier;
}

/** Precomputes qualitative distance/orientation for every pair of figures on the board. */
export function pairwiseGeometry(figures: Figure[]): PairwiseGeometry[] {
  const pairs: PairwiseGeometry[] = [];
  for (let i = 0; i < figures.length; i++) {
    for (let j = i + 1; j < figures.length; j++) {
      const a = figures[i];
      const b = figures[j];
      const distance = distanceBetween(a, b);
      pairs.push({
        aId: a.id,
        bId: b.id,
        distance,
        distanceQualifier: distanceQualifier(distance),
        aFacingB: facingQualifier(a, b),
        bFacingA: facingQualifier(b, a),
      });
    }
  }
  return pairs;
}
