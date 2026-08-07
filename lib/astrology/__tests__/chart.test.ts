import { describe, it, expect } from "vitest";
import { computeNatalChart } from "../chart";
import { signFromLongitude } from "../ephemeris";
import { PLANETS } from "../types";

describe("computeNatalChart — integration smoke test", () => {
  const chart = computeNatalChart({
    date: "1990-05-15",
    time: "14:30",
    latitude: 44.4268,
    longitude: 26.1025,
    placeName: "București",
  });

  it("computes all 10 planets with a valid sign and longitude", () => {
    expect(chart.planets).toHaveLength(PLANETS.length);
    for (const p of chart.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
    }
  });

  it("computes Ascendant, Midheaven and 12 Whole Sign houses when birth time is known", () => {
    expect(chart.hasExactTime).toBe(true);
    expect(chart.ascendant).not.toBeNull();
    expect(chart.midheaven).not.toBeNull();
    expect(chart.houses).toHaveLength(12);
    expect(chart.houses[0].sign).toBe(signFromLongitude(chart.ascendant!).sign);
  });

  it("omits houses/ascendant/midheaven but still returns planets when time is unknown", () => {
    const withoutTime = computeNatalChart({
      date: "1990-05-15",
      time: null,
      latitude: 44.4268,
      longitude: 26.1025,
    });
    expect(withoutTime.hasExactTime).toBe(false);
    expect(withoutTime.ascendant).toBeNull();
    expect(withoutTime.midheaven).toBeNull();
    expect(withoutTime.houses).toHaveLength(0);
    expect(withoutTime.planets).toHaveLength(PLANETS.length);
    expect(withoutTime.planets.every((p) => p.house === null)).toBe(true);
  });

  it("finds at least one aspect within orb across 10 planets (statistically expected)", () => {
    expect(chart.aspects.length).toBeGreaterThan(0);
    for (const aspect of chart.aspects) {
      expect(aspect.orb).toBeGreaterThanOrEqual(0);
    }
  });
});
