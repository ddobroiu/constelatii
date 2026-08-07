import type { AstroTime } from "astronomy-engine";
import { normalizeDegrees, localSiderealTimeDegrees, trueObliquityOfDate, signFromLongitude } from "./ephemeris";
import { ZODIAC_SIGNS, type HouseCusp } from "./types";

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export interface Angles {
  ramc: number;
  ascendant: number;
  midheaven: number;
}

/**
 * Computes RAMC, Ascendant, and Midheaven ecliptic longitudes of date.
 * Formulas derived from the standard equatorial<->ecliptic conversion for a
 * point on the ecliptic (Duffett-Smith / Meeus), verified independently:
 *   MC  = atan2( sin(RAMC), cos(RAMC) * cos(eps) )
 *   Asc = atan2( -cos(RAMC), sin(RAMC) * cos(eps) + tan(lat) * sin(eps) )
 */
export function computeAngles(time: AstroTime, geographicLatitude: number, geographicLongitude: number): Angles {
  const ramc = localSiderealTimeDegrees(time, geographicLongitude);
  const eps = toRad(trueObliquityOfDate(time));
  const ramcRad = toRad(ramc);
  const latRad = toRad(geographicLatitude);

  const midheaven = normalizeDegrees(toDeg(Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps))));

  // Empirically verified against sunrise ground truth (see __tests__/houses.test.ts):
  // the textbook y/x pair points at the Descendant, so both components are negated
  // here to land on the Ascendant (equivalent to a +180° rotation).
  const ascY = Math.cos(ramcRad);
  const ascX = -(Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps));
  const ascendant = normalizeDegrees(toDeg(Math.atan2(ascY, ascX)));

  return { ramc, ascendant, midheaven };
}

/** Whole Sign houses: house 1 = the Ascendant's sign, houses follow zodiacal order. */
export function wholeSignHouseCusps(ascendant: number): HouseCusp[] {
  const ascendantSignIndex = Math.floor(normalizeDegrees(ascendant) / 30);
  return Array.from({ length: 12 }, (_, i) => {
    const signIndex = (ascendantSignIndex + i) % 12;
    return {
      house: i + 1,
      cuspLongitude: signIndex * 30,
      sign: ZODIAC_SIGNS[signIndex],
    };
  });
}

export function houseForLongitude(houses: HouseCusp[], longitude: number): number {
  const { sign } = signFromLongitude(longitude);
  const match = houses.find((h) => h.sign === sign);
  if (!match) throw new Error(`Nu s-a găsit casa pentru zodia ${sign}`);
  return match.house;
}
