export interface Pillar {
  slug: string;
  label: string;
  shortLabel: string;
}

/** The 4 topical pillar pages every county page links back to. */
export const PILLARS: Pillar[] = [
  { slug: "blocaje-relatii", label: "Blocaje în relații", shortLabel: "Blocaje în relații" },
  { slug: "blocaje-financiare", label: "Blocaje financiare", shortLabel: "Blocaje financiare" },
  { slug: "horoscop-astrologie", label: "Horoscop și astrologie", shortLabel: "Horoscop" },
  { slug: "terapie-autocunoastere", label: "Terapie și autocunoaștere", shortLabel: "Autocunoaștere" },
];
