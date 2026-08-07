import { describe, it, expect } from "vitest";
import * as Astronomy from "astronomy-engine";
import { eclipticLongitudeOfDate } from "../ephemeris";

describe("eclipticLongitudeOfDate — Sun at the equinoxes/solstices", () => {
  it("Sun is at 0° (0° Berbec) at the March equinox", () => {
    const seasons = Astronomy.Seasons(2026);
    const longitude = eclipticLongitudeOfDate("Soare", seasons.mar_equinox);
    expect(Math.min(longitude, 360 - longitude)).toBeLessThan(0.01);
  });

  it("Sun is at 90° (0° Rac) at the June solstice", () => {
    const seasons = Astronomy.Seasons(2026);
    const longitude = eclipticLongitudeOfDate("Soare", seasons.jun_solstice);
    expect(Math.abs(longitude - 90)).toBeLessThan(0.01);
  });

  it("Sun is at 180° (0° Balanță) at the September equinox", () => {
    const seasons = Astronomy.Seasons(2026);
    const longitude = eclipticLongitudeOfDate("Soare", seasons.sep_equinox);
    expect(Math.abs(longitude - 180)).toBeLessThan(0.01);
  });
});
