"use client";

import { useState } from "react";
import { CONNECTOR_SYMBOLS, type ConnectorSymbolId, type Figure, type Relationship } from "@/lib/board/types";
import InlineSymbolIcon from "./InlineSymbolIcon";

interface ConnectorPanelProps {
  figures: Figure[];
  relationships: Relationship[];
  onAdd: (fromId: string, toId: string, symbol: ConnectorSymbolId) => void;
  onRemove: (id: string) => void;
}

export default function ConnectorPanel({ figures, relationships, onAdd, onRemove }: ConnectorPanelProps) {
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [symbol, setSymbol] = useState<ConnectorSymbolId | null>(null);

  if (figures.length < 2) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-2 text-sm font-medium text-foreground/60">Legături între figuri</h2>
        <p className="text-xs text-foreground/40">
          Adaugă cel puțin două figuri pentru a putea plasa un simbol între ele — un zid, o inimă,
          un lanț.
        </p>
      </div>
    );
  }

  function labelFor(id: string) {
    return figures.find((f) => f.id === id)?.label ?? "?";
  }

  function submit() {
    if (!fromId || !toId || !symbol || fromId === toId) return;
    onAdd(fromId, toId, symbol);
    setSymbol(null);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 text-sm font-medium text-foreground/60">Legături între figuri</h2>
      <p className="mb-3 text-xs text-foreground/40">
        Alege ce se află între două figuri — nu doar cum sunt ele, ci cum e legătura dintre ele.
      </p>

      <div className="mb-3 flex items-center gap-2">
        <select
          value={fromId}
          onChange={(e) => setFromId(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-sm outline-none focus:border-accent"
        >
          <option value="">De la...</option>
          {figures.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={toId}
          onChange={(e) => setToId(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-sm outline-none focus:border-accent"
        >
          <option value="">Către...</option>
          {figures.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-1 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {CONNECTOR_SYMBOLS.map((s) => (
          <button
            key={s.value}
            type="button"
            title={`${s.label} — ${s.meaning}`}
            aria-label={s.label}
            onClick={() => setSymbol(s.value)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border transition-colors"
            style={{
              borderColor: symbol === s.value ? "#f1f0ff" : "rgba(255,255,255,0.1)",
              backgroundColor: symbol === s.value ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
            }}
          >
            <InlineSymbolIcon icon={s.icon} size={20} />
          </button>
        ))}
      </div>
      {symbol && (
        <p className="mb-3 text-xs italic text-foreground/40">
          {CONNECTOR_SYMBOLS.find((s) => s.value === symbol)?.meaning}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!fromId || !toId || !symbol || fromId === toId}
        className="mb-4 w-full rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
      >
        Adaugă legătura
      </button>

      {relationships.length > 0 && (
        <ul className="flex flex-col gap-2">
          {relationships.map((r) => {
            const def = CONNECTOR_SYMBOLS.find((s) => s.value === r.symbol);
            return (
              <li key={r.id} className="flex items-center justify-between gap-2 text-xs text-foreground/70">
                <span className="flex items-center gap-1.5">
                  {labelFor(r.fromId)}
                  {def && <InlineSymbolIcon icon={def.icon} size={13} />}
                  {labelFor(r.toId)}
                </span>
                <button type="button" onClick={() => onRemove(r.id)} className="text-red-300/70 hover:text-red-300">
                  Șterge
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
