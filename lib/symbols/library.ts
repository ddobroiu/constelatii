/**
 * Symbolic icon system for the constellation board.
 *
 * Two independent layers of meaning, both fed to the AI interpretation later:
 *  - FIGURE_SYMBOLS: what a person "is" to the user, symbolically (chosen per figure).
 *  - CONNECTOR_SYMBOLS: the nature of the bond between two specific figures
 *    (chosen per relationship, rendered on the line between them) — this is
 *    what lets a user place a literal wall between two figures, or a heart
 *    that unites them, independent of how each person is individually symbolized.
 *
 * Icon geometry is sourced from Google's Material Symbols (Apache License 2.0),
 * 24x24 viewBox, reproduced as raw path/circle data so it can be drawn with
 * react-konva primitives with no external asset loading.
 */

export type IconPart = { type: "path"; d: string } | { type: "circle"; cx: number; cy: number; r: number };

export type SymbolIconId =
  | "inima"
  | "inima_franta"
  | "lacat"
  | "cheie"
  | "lant"
  | "lant_rupt"
  | "scut"
  | "ancora"
  | "copac"
  | "munte"
  | "valuri"
  | "flacara"
  | "masca"
  | "casa"
  | "laba"
  | "calm"
  | "bariera"
  | "impacare";

export const SYMBOL_ICON_PARTS: Record<SymbolIconId, IconPart[]> = {
  inima: [
    {
      type: "path",
      d: "m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    },
  ],
  inima_franta: [
    {
      type: "path",
      d: "M16.5 3c-.96 0-1.9.25-2.73.69L12 9h3l-3 10 1-9h-3l1.54-5.39C10.47 3.61 9.01 3 7.5 3 4.42 3 2 5.42 2 8.5c0 4.13 4.16 7.18 10 12.5 5.47-4.94 10-8.26 10-12.5C22 5.42 19.58 3 16.5 3z",
    },
  ],
  lacat: [
    {
      type: "path",
      d: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    },
  ],
  cheie: [
    {
      type: "path",
      d: "M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
    },
  ],
  lant: [
    {
      type: "path",
      d: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
    },
  ],
  lant_rupt: [
    {
      type: "path",
      d: "M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11A4.991 4.991 0 0 0 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z",
    },
  ],
  scut: [
    { type: "path", d: "M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" },
  ],
  ancora: [
    {
      type: "path",
      d: "m17 15 1.55 1.55c-.96 1.69-3.33 3.04-5.55 3.37V11h3V9h-3V7.82C14.16 7.4 15 6.3 15 5c0-1.65-1.35-3-3-3S9 3.35 9 5c0 1.3.84 2.4 2 2.82V9H8v2h3v8.92c-2.22-.33-4.59-1.68-5.55-3.37L7 15l-4-3v3c0 3.88 4.92 7 9 7s9-3.12 9-7v-3l-4 3zM12 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z",
    },
  ],
  copac: [{ type: "path", d: "M17 12h2L12 2 5.05 12H7l-3.9 6h6.92v4h3.96v-4H21z" }],
  munte: [{ type: "path", d: "m14 6-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z" }],
  valuri: [
    {
      type: "path",
      d: "M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.95c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm0-4.45c-1.35 0-2.2.43-2.95.8-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.32-1.17.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm2.95-8.08c-.75-.38-1.58-.8-2.95-.8s-2.2.42-2.95.8c-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.37-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.93c1.35 0 2.2-.43 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8V5.04c-.9 0-1.4-.25-2.05-.58zM17 8.09c-1.35 0-2.2.43-2.95.8-.65.35-1.15.6-2.05.6s-1.4-.25-2.05-.6c-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.35-1.15.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.32 1.18-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8V9.49c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8z",
    },
  ],
  flacara: [
    {
      type: "path",
      d: "m12 12.9-2.13 2.09c-.56.56-.87 1.29-.87 2.07C9 18.68 10.35 20 12 20s3-1.32 3-2.94c0-.78-.31-1.52-.87-2.07L12 12.9z",
    },
    {
      type: "path",
      d: "m16 6-.44.55C14.38 8.02 12 7.19 12 5.3V2S4 6 4 13c0 2.92 1.56 5.47 3.89 6.86-.56-.79-.89-1.76-.89-2.8 0-1.32.52-2.56 1.47-3.5L12 10.1l3.53 3.47c.95.93 1.47 2.17 1.47 3.5 0 1.02-.31 1.96-.85 2.75 1.89-1.15 3.29-3.06 3.71-5.3.66-3.55-1.07-6.9-3.86-8.52z",
    },
  ],
  masca: [
    {
      type: "path",
      d: "M2 16.5C2 19.54 4.46 22 7.5 22s5.5-2.46 5.5-5.5V10H2v6.5zm5.5 2C6.12 18.5 5 17.83 5 17h5c0 .83-1.12 1.5-2.5 1.5zM10 13c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z",
    },
    {
      type: "path",
      d: "M11 3v6h3v2.5c0-.83 1.12-1.5 2.5-1.5s2.5.67 2.5 1.5h-5v2.89c.75.38 1.6.61 2.5.61 3.04 0 5.5-2.46 5.5-5.5V3H11zm3 5.08c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1c0 .56-.45 1-1 1zm5 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1c0 .56-.45 1-1 1z",
    },
  ],
  casa: [{ type: "path", d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" }],
  laba: [
    { type: "circle", cx: 4.5, cy: 9.5, r: 2.5 },
    { type: "circle", cx: 9, cy: 5.5, r: 2.5 },
    { type: "circle", cx: 15, cy: 5.5, r: 2.5 },
    { type: "circle", cx: 19.5, cy: 9.5, r: 2.5 },
    {
      type: "path",
      d: "M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z",
    },
  ],
  calm: [
    { type: "circle", cx: 12, cy: 6, r: 2 },
    {
      type: "path",
      d: "M21 16v-2c-2.24 0-4.16-.96-5.6-2.68l-1.34-1.6A1.98 1.98 0 0 0 12.53 9h-1.05c-.59 0-1.15.26-1.53.72l-1.34 1.6C7.16 13.04 5.24 14 3 14v2c2.77 0 5.19-1.17 7-3.25V15l-3.88 1.55c-.67.27-1.12.93-1.12 1.66C5 19.2 5.8 20 6.79 20H9v-.5a2.5 2.5 0 0 1 2.5-2.5h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.83 0-1.5.67-1.5 1.5v.5h7.21c.99 0 1.79-.8 1.79-1.79 0-.73-.45-1.39-1.12-1.66L14 15v-2.25c1.81 2.08 4.23 3.25 7 3.25z",
    },
  ],
  bariera: [
    {
      type: "path",
      d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 0 1 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0 1 20 12c0 4.42-3.58 8-8 8z",
    },
  ],
  impacare: [
    {
      type: "path",
      d: "M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46-7.05 7.04-.66-.63a3 3 0 0 1 0-4.24l4.24-4.24a3 3 0 0 1 4.24 0L16.48 9c.39.39.39 1.02 0 1.41zm.7-2.12c.78.78.78 2.05 0 2.83-1.27 1.27-2.61.22-2.83 0l-3.76-3.76-5.57 5.57a.996.996 0 0 0 0 1.41c.39.39 1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62a.996.996 0 0 0 0 1.41c.39.39 1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62a.996.996 0 1 0 1.41 1.41l4.62-4.62.71.71-4.62 4.62a.996.996 0 1 0 1.41 1.41l8.32-8.34a3 3 0 0 0 0-4.24l-4.24-4.24a3.001 3.001 0 0 0-4.18-.06l4.47 4.47z",
    },
  ],
};

/** What a person "is" to the user, symbolically. Chosen per figure. */
export const FIGURE_SYMBOLS = [
  { value: "inima", icon: "inima", label: "Inimă", meaning: "iubire necondiționată, apropiere emoțională" },
  { value: "scut", icon: "scut", label: "Scut", meaning: "protector, apărător — dar poate și distant, în gardă" },
  { value: "ancora", icon: "ancora", label: "Ancoră", meaning: "reper de stabilitate — sau o povară care ține pe loc" },
  { value: "copac", icon: "copac", label: "Copac", meaning: "rădăcini, moștenire, apartenența la familie" },
  { value: "munte", icon: "munte", label: "Munte", meaning: "autoritate, obstacol de netrecut sau reper solid" },
  { value: "valuri", icon: "valuri", label: "Valuri", meaning: "imprevizibil, schimbător emoțional" },
  { value: "flacara", icon: "flacara", label: "Flacără", meaning: "pasiune, intensitate — poate consuma" },
  { value: "masca", icon: "masca", label: "Mască", meaning: "fațadă — ascunde ce simte cu adevărat" },
  { value: "casa", icon: "casa", label: "Casă", meaning: "siguranță, cămin, centrul familiei" },
  { value: "laba", icon: "laba", label: "Companion", meaning: "loialitate necondiționată, companie, protecție blândă" },
  { value: "cheie", icon: "cheie", label: "Cheie", meaning: "deține „cheia” unei probleme sau a unei rezolvări" },
  { value: "lacat", icon: "lacat", label: "Lacăt", meaning: "închis emoțional, greu accesibil, păstrează secrete" },
  { value: "calm", icon: "calm", label: "Calm", meaning: "echilibrat, centrat, sursă de liniște" },
] as const satisfies readonly { value: string; icon: SymbolIconId; label: string; meaning: string }[];

export type FigureSymbolId = (typeof FIGURE_SYMBOLS)[number]["value"];

export const DEFAULT_FIGURE_SYMBOL: FigureSymbolId = "inima";

export function figureSymbolMeaning(value: FigureSymbolId) {
  return FIGURE_SYMBOLS.find((s) => s.value === value);
}

/**
 * The nature of the bond BETWEEN two figures — placed on the connecting line,
 * independent of how either figure is individually symbolized. This is what
 * lets a user place a literal wall between two figures, or a heart that
 * unites them.
 */
export const CONNECTOR_SYMBOLS = [
  { value: "inima", icon: "inima", label: "Inimă", meaning: "legătură puternică de iubire care îi unește" },
  { value: "lant", icon: "lant", label: "Lanț", meaning: "legătură puternică, dar posibil obligatorie sau sufocantă" },
  { value: "lant_rupt", icon: "lant_rupt", label: "Legătură fragilă", meaning: "conexiune slăbită, pe cale să se rupă" },
  { value: "inima_franta", icon: "inima_franta", label: "Inimă frântă", meaning: "ruptură dureroasă, o despărțire nevindecată" },
  { value: "bariera", icon: "bariera", label: "Barieră", meaning: "zid, blocaj total, refuz de comunicare" },
  { value: "scut", icon: "scut", label: "Scut între ei", meaning: "distanță defensivă — protecție reciprocă, dar rece" },
  { value: "ancora", icon: "ancora", label: "Ancoră", meaning: "legătură care ține pe loc — greutate resimțită în relație" },
  { value: "impacare", icon: "impacare", label: "Împăcare", meaning: "efort activ de reconciliere, o punte în construcție" },
] as const satisfies readonly { value: string; icon: SymbolIconId; label: string; meaning: string }[];

export type ConnectorSymbolId = (typeof CONNECTOR_SYMBOLS)[number]["value"];

export function connectorSymbolMeaning(value: ConnectorSymbolId) {
  return CONNECTOR_SYMBOLS.find((s) => s.value === value);
}
