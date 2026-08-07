import { z } from "zod";
import type { BirthData } from "../astrology/types";

export const FIGURE_ROLES = [
  { value: "eu", label: "Eu" },
  { value: "tata", label: "Tata" },
  { value: "mama", label: "Mama" },
  { value: "partener", label: "Partener/Parteneră" },
  { value: "copil", label: "Copil" },
  { value: "frate_sora", label: "Frate/Soră" },
  { value: "bunic_patern", label: "Bunic patern" },
  { value: "bunica_paterna", label: "Bunica paternă" },
  { value: "bunic_matern", label: "Bunic matern" },
  { value: "bunica_materna", label: "Bunica maternă" },
  { value: "alta_persoana", label: "Altă persoană" },
] as const;

export type FigureRole = (typeof FIGURE_ROLES)[number]["value"];

/**
 * Users assign a color to each figure as a deliberate, meaningful choice —
 * not a role default — since the choice itself (and which figures share a
 * color) is a signal fed into the AI interpretation alongside position and
 * orientation.
 */
export const FIGURE_COLORS = [
  { value: "rosu", label: "Roșu", hex: "#ef4444" },
  { value: "portocaliu", label: "Portocaliu", hex: "#f97316" },
  { value: "galben", label: "Galben", hex: "#eab308" },
  { value: "verde", label: "Verde", hex: "#22c55e" },
  { value: "turcoaz", label: "Turcoaz", hex: "#14b8a6" },
  { value: "albastru", label: "Albastru", hex: "#3b82f6" },
  { value: "indigo", label: "Indigo", hex: "#6366f1" },
  { value: "violet", label: "Violet", hex: "#a855f7" },
  { value: "roz", label: "Roz", hex: "#ec4899" },
  { value: "maro", label: "Maro", hex: "#92400e" },
  { value: "gri", label: "Gri", hex: "#94a3b8" },
  { value: "alb", label: "Alb", hex: "#f8fafc" },
] as const;

export type FigureColor = (typeof FIGURE_COLORS)[number]["value"];

export const DEFAULT_FIGURE_COLOR: FigureColor = "indigo";

export const PositionSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const FigureSchema = z.object({
  id: z.string(),
  role: z.enum(FIGURE_ROLES.map((r) => r.value) as [FigureRole, ...FigureRole[]]),
  label: z.string().min(1).max(40),
  position: PositionSchema,
  rotation: z.number().min(0).max(360),
  color: z.enum(FIGURE_COLORS.map((c) => c.value) as [FigureColor, ...FigureColor[]]),
  isPrimaryUser: z.boolean(),
  birthData: z.custom<BirthData>().nullable().optional(),
});

export type Figure = z.infer<typeof FigureSchema>;

export function colorHex(color: FigureColor): string {
  return FIGURE_COLORS.find((c) => c.value === color)?.hex ?? "#6366f1";
}

export function colorLabel(color: FigureColor): string {
  return FIGURE_COLORS.find((c) => c.value === color)?.label ?? color;
}

export const RelationshipSchema = z.object({
  fromId: z.string(),
  toId: z.string(),
  label: z.string().max(60).optional(),
});

export type Relationship = z.infer<typeof RelationshipSchema>;

export const BoardConfigSchema = z.object({
  figures: z.array(FigureSchema),
  relationships: z.array(RelationshipSchema),
  canvasSize: z.object({ width: z.number(), height: z.number() }),
});

export type BoardConfig = z.infer<typeof BoardConfigSchema>;

export function roleLabel(role: FigureRole): string {
  return FIGURE_ROLES.find((r) => r.value === role)?.label ?? role;
}
