"use client";

import { FIGURE_COLORS, FIGURE_ROLES, type Figure, type FigureColor, type FigureRole } from "@/lib/board/types";

interface FigurePaletteProps {
  figures: Figure[];
  selectedFigure: Figure | null;
  onAdd: (role: FigureRole) => void;
  onRelabel: (id: string, label: string) => void;
  onRecolor: (id: string, color: FigureColor) => void;
  onRemove: (id: string) => void;
}

export default function FigurePalette({
  figures,
  selectedFigure,
  onAdd,
  onRelabel,
  onRecolor,
  onRemove,
}: FigurePaletteProps) {
  const hasPrimaryUser = figures.some((f) => f.isPrimaryUser);

  return (
    <div className="flex w-full flex-col gap-6 sm:w-64">
      <div>
        <h2 className="mb-3 text-sm font-medium text-foreground/60">Adaugă o figură</h2>
        <div className="flex flex-wrap gap-2">
          {FIGURE_ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => onAdd(role.value)}
              disabled={role.value === "eu" && hasPrimaryUser}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {selectedFigure && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 text-sm font-medium text-foreground/60">Figură selectată</h2>
          <label className="mb-1 block text-xs text-foreground/50">Etichetă</label>
          <input
            type="text"
            value={selectedFigure.label}
            onChange={(e) => onRelabel(selectedFigure.id, e.target.value)}
            maxLength={40}
            className="mb-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm outline-none focus:border-accent"
          />

          <label className="mb-1 block text-xs text-foreground/50">Culoare</label>
          <div className="mb-3 flex flex-wrap gap-2">
            {FIGURE_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.label}
                aria-label={color.label}
                onClick={() => onRecolor(selectedFigure.id, color.value)}
                className="h-6 w-6 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: color.hex,
                  outline: selectedFigure.color === color.value ? "2px solid #f1f0ff" : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onRemove(selectedFigure.id)}
            className="text-sm text-red-300/80 hover:text-red-300"
          >
            Șterge figura
          </button>
        </div>
      )}

      <p className="text-xs leading-relaxed text-foreground/40">
        Trage figurile pentru a le poziționa. Selectează o figură și trage mânerul alb pentru a-i
        seta direcția în care privește.
      </p>
    </div>
  );
}
