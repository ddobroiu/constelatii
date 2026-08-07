import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";
import tzlookup from "tz-lookup";
import { allPlanetPositions, normalizeDegrees, signFromLongitude } from "./ephemeris";
import { computeAngles, houseForLongitude, wholeSignHouseCusps } from "./houses";
import { computeAspects } from "./aspects";
import type { BirthData, NatalChart, PlanetPosition } from "./types";

function resolveBirthInstant(birthData: BirthData): { time: Astronomy.AstroTime; hasExactTime: boolean } {
  const timeZone = tzlookup(birthData.latitude, birthData.longitude);
  const hasExactTime = birthData.time !== null;
  const clockTime = birthData.time ?? "12:00";

  const local = DateTime.fromISO(`${birthData.date}T${clockTime}`, { zone: timeZone });
  if (!local.isValid) {
    throw new Error(`Dată de naștere invalidă: ${local.invalidReason} — ${local.invalidExplanation}`);
  }

  return { time: Astronomy.MakeTime(local.toUTC().toJSDate()), hasExactTime };
}

export function computeNatalChart(birthData: BirthData): NatalChart {
  const { time, hasExactTime } = resolveBirthInstant(birthData);

  const rawPlanets = allPlanetPositions(time);

  let ascendant: number | null = null;
  let midheaven: number | null = null;
  let houses: NatalChart["houses"] = [];
  let planets: PlanetPosition[];

  if (hasExactTime) {
    const angles = computeAngles(time, birthData.latitude, birthData.longitude);
    ascendant = angles.ascendant;
    midheaven = angles.midheaven;
    houses = wholeSignHouseCusps(ascendant);

    planets = rawPlanets.map((p) => ({
      ...p,
      house: houseForLongitude(houses, p.longitude),
    }));
  } else {
    planets = rawPlanets.map((p) => ({ ...p, house: null }));
  }

  const laterTime = time.AddDays(1 / 24);
  const laterPlanets = allPlanetPositions(laterTime);
  const aspects = computeAspects(
    rawPlanets.map((p, i) => ({
      planet: p.planet,
      longitude: p.longitude,
      longitudeLater: laterPlanets[i].longitude,
    }))
  );

  return {
    birthData,
    hasExactTime,
    ascendant,
    midheaven,
    houseSystem: "whole-sign",
    planets,
    houses,
    aspects,
  };
}

export { normalizeDegrees, signFromLongitude };
