import { describe, it, expect } from "vitest";
import * as Astronomy from "astronomy-engine";
import { computeAngles, wholeSignHouseCusps } from "../houses";
import { eclipticLongitudeOfDate, normalizeDegrees } from "../ephemeris";

/**
 * These tests validate computeAngles() (the highest-risk piece of the astrology
 * engine — see plan) against ground truth derived independently from
 * astronomy-engine's own well-established Search functions, rather than
 * against a remembered/possibly-misremembered reference chart:
 *
 * - At the exact moment the Sun's geometric center crosses the horizon rising,
 *   the ecliptic point currently rising (the Ascendant) must coincide with the
 *   Sun's own ecliptic longitude (the Sun's ecliptic latitude is ~0, so it sits
 *   on the ecliptic and IS, by definition, "the point of the ecliptic rising"
 *   at that instant). We use SearchAltitude (geometric, no refraction) rather
 *   than SearchRiseSet, because SearchRiseSet corrects for atmospheric
 *   refraction and the Sun's angular radius — real effects our formula
 *   deliberately doesn't (and shouldn't) model, which would otherwise show up
 *   as spurious multi-degree error at high latitudes where the sun rises at a
 *   shallow angle.
 * - At the exact moment of local solar culmination (solar noon), the
 *   Midheaven (the ecliptic point currently on the meridian) must coincide
 *   with the Sun's ecliptic longitude for the same reason.
 *
 * A sign or quadrant error in the Asc/MC formulas would show up as a large
 * discrepancy (many degrees, often ~180°) rather than sub-degree noise.
 */

function angularDiff(a: number, b: number): number {
  const diff = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));
  return diff > 180 ? 360 - diff : diff;
}

const TEST_LOCATIONS = [
  { name: "București", lat: 44.4268, lon: 26.1025 },
  { name: "Reykjavik", lat: 64.1466, lon: -21.9426 },
  { name: "Sydney (emisferă sudică)", lat: -33.8688, lon: 151.2093 },
  { name: "Quito (aproape de ecuator)", lat: -0.1807, lon: -78.4678 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
];

const TEST_DATES = [new Date("2026-08-07T00:00:00Z"), new Date("2026-01-15T00:00:00Z"), new Date("2026-06-21T00:00:00Z")];

describe("computeAngles — Ascendant at sunrise coincides with Sun's ecliptic longitude", () => {
  for (const loc of TEST_LOCATIONS) {
    for (const day of TEST_DATES) {
      it(`${loc.name} @ ${day.toISOString().slice(0, 10)}`, () => {
        const observer = new Astronomy.Observer(loc.lat, loc.lon, 0);
        const sunrise = Astronomy.SearchAltitude(Astronomy.Body.Sun, observer, +1, day, 2, 0);
        expect(sunrise).not.toBeNull();
        if (!sunrise) return;

        const angles = computeAngles(sunrise, loc.lat, loc.lon);
        const sunLongitude = eclipticLongitudeOfDate("Soare", sunrise);

        expect(angularDiff(angles.ascendant, sunLongitude)).toBeLessThan(0.5);
      });
    }
  }
});

describe("computeAngles — Midheaven at solar noon coincides with Sun's ecliptic longitude", () => {
  for (const loc of TEST_LOCATIONS) {
    for (const day of TEST_DATES) {
      it(`${loc.name} @ ${day.toISOString().slice(0, 10)}`, () => {
        const observer = new Astronomy.Observer(loc.lat, loc.lon, 0);
        const noon = Astronomy.SearchHourAngle(Astronomy.Body.Sun, observer, 0, day);

        const angles = computeAngles(noon.time, loc.lat, loc.lon);
        const sunLongitude = eclipticLongitudeOfDate("Soare", noon.time);

        expect(angularDiff(angles.midheaven, sunLongitude)).toBeLessThan(0.5);
      });
    }
  }
});

describe("wholeSignHouseCusps", () => {
  it("house 1 starts exactly at the Ascendant's sign boundary and houses are sequential", () => {
    const houses = wholeSignHouseCusps(137.4); // mid-Leo
    expect(houses).toHaveLength(12);
    expect(houses[0].sign).toBe("Leu");
    expect(houses[0].cuspLongitude).toBe(120);
    for (let i = 1; i < 12; i++) {
      expect(houses[i].cuspLongitude).toBe((houses[i - 1].cuspLongitude + 30) % 360);
    }
  });
});
