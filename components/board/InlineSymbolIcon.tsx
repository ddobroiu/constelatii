import { SYMBOL_ICON_PARTS, type SymbolIconId } from "@/lib/symbols/library";

/** Plain-SVG (non-Konva) rendering of the same icon set, for use in regular HTML UI. */
export default function InlineSymbolIcon({ icon, size = 16, color = "#f1f0ff" }: { icon: SymbolIconId; size?: number; color?: string }) {
  const parts = SYMBOL_ICON_PARTS[icon];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {parts.map((part, i) =>
        part.type === "path" ? (
          <path key={i} d={part.d} fill={color} />
        ) : (
          <circle key={i} cx={part.cx} cy={part.cy} r={part.r} fill={color} />
        )
      )}
    </svg>
  );
}
