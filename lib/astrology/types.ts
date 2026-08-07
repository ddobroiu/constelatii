import { z } from "zod";

export const PLANETS = [
  "Soare",
  "Luna",
  "Mercur",
  "Venus",
  "Marte",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptun",
  "Pluto",
] as const;

export type Planet = (typeof PLANETS)[number];

export const ZODIAC_SIGNS = [
  "Berbec",
  "Taur",
  "Gemeni",
  "Rac",
  "Leu",
  "Fecioara",
  "Balanta",
  "Scorpion",
  "Sagetator",
  "Capricorn",
  "Varsator",
  "Pesti",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export const ASPECT_TYPES = [
  "conjunctie",
  "opozitie",
  "trigon",
  "careu",
  "sextil",
] as const;

export type AspectType = (typeof ASPECT_TYPES)[number];

export const BirthDataSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format așteptat: YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Format așteptat: HH:mm")
    .nullable(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  placeName: z.string().optional(),
});

export type BirthData = z.infer<typeof BirthDataSchema>;

export interface PlanetPosition {
  planet: Planet;
  longitude: number;
  sign: ZodiacSign;
  degreeInSign: number;
  house: number | null;
  retrograde: boolean;
}

export interface HouseCusp {
  house: number;
  cuspLongitude: number;
  sign: ZodiacSign;
}

export interface AspectData {
  planetA: Planet;
  planetB: Planet;
  type: AspectType;
  angle: number;
  orb: number;
  applying: boolean;
}

export interface NatalChart {
  birthData: BirthData;
  hasExactTime: boolean;
  ascendant: number | null;
  midheaven: number | null;
  houseSystem: "whole-sign";
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: AspectData[];
}
