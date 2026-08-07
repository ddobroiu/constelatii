import { normalizeDegrees } from "./ephemeris";
import type { AspectData, AspectType, Planet } from "./types";

const ASPECT_DEFINITIONS: { type: AspectType; angle: number; orb: number }[] = [
  { type: "conjunctie", angle: 0, orb: 8 },
  { type: "opozitie", angle: 180, orb: 8 },
  { type: "trigon", angle: 120, orb: 8 },
  { type: "careu", angle: 90, orb: 7 },
  { type: "sextil", angle: 60, orb: 6 },
];

export interface PlanetForAspect {
  planet: Planet;
  longitude: number;
  /** Ecliptic longitude a short time later, used to determine applying/separating. */
  longitudeLater: number;
}

function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));
  return diff > 180 ? 360 - diff : diff;
}

export function computeAspects(planets: PlanetForAspect[]): AspectData[] {
  const aspects: AspectData[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i];
      const b = planets[j];
      const separation = angularSeparation(a.longitude, b.longitude);

      for (const def of ASPECT_DEFINITIONS) {
        const orb = Math.abs(separation - def.angle);
        if (orb <= def.orb) {
          const separationLater = angularSeparation(a.longitudeLater, b.longitudeLater);
          const applying = Math.abs(separationLater - def.angle) < orb;

          aspects.push({
            planetA: a.planet,
            planetB: b.planet,
            type: def.type,
            angle: def.angle,
            orb: Number(orb.toFixed(2)),
            applying,
          });
          break;
        }
      }
    }
  }

  return aspects;
}
