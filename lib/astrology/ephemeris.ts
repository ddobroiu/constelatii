import * as Astronomy from "astronomy-engine";
import { PLANETS, ZODIAC_SIGNS, type Planet, type ZodiacSign } from "./types";

const BODY_BY_PLANET: Record<Planet, Astronomy.Body> = {
  Soare: Astronomy.Body.Sun,
  Luna: Astronomy.Body.Moon,
  Mercur: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Marte: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus,
  Neptun: Astronomy.Body.Neptune,
  Pluto: Astronomy.Body.Pluto,
};

export function normalizeDegrees(degrees: number): number {
  const mod = degrees % 360;
  return mod < 0 ? mod + 360 : mod;
}

/** Geocentric apparent ecliptic longitude of date (tropical), in degrees [0, 360). */
export function eclipticLongitudeOfDate(planet: Planet, time: Astronomy.AstroTime): number {
  const body = BODY_BY_PLANET[planet];
  const geoVector = Astronomy.GeoVector(body, time, true);
  const ecliptic = Astronomy.Ecliptic(geoVector);
  return normalizeDegrees(ecliptic.elon);
}

export function signFromLongitude(longitude: number): { sign: ZodiacSign; degreeInSign: number } {
  const norm = normalizeDegrees(longitude);
  const index = Math.floor(norm / 30);
  return { sign: ZODIAC_SIGNS[index], degreeInSign: norm - index * 30 };
}

/**
 * Retrograde is detected via the sign of apparent motion over a short
 * interval (a few hours), which is robust for all bodies without needing
 * body-specific orbital-speed formulas.
 */
export function isRetrograde(planet: Planet, time: Astronomy.AstroTime): boolean {
  const dtDays = 0.5;
  const before = eclipticLongitudeOfDate(planet, time.AddDays(-dtDays));
  const after = eclipticLongitudeOfDate(planet, time.AddDays(dtDays));
  const delta = normalizeDegrees(after - before + 180) - 180;
  return delta < 0;
}

export function trueObliquityOfDate(time: Astronomy.AstroTime): number {
  return Astronomy.e_tilt(time).tobl;
}

/** Local sidereal time expressed as RAMC in degrees [0, 360). */
export function localSiderealTimeDegrees(time: Astronomy.AstroTime, geographicLongitude: number): number {
  const gastHours = Astronomy.SiderealTime(time);
  return normalizeDegrees(gastHours * 15 + geographicLongitude);
}

export function allPlanetPositions(time: Astronomy.AstroTime) {
  return PLANETS.map((planet) => {
    const longitude = eclipticLongitudeOfDate(planet, time);
    const { sign, degreeInSign } = signFromLongitude(longitude);
    return {
      planet,
      longitude,
      sign,
      degreeInSign,
      retrograde: isRetrograde(planet, time),
    };
  });
}
