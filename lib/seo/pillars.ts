export interface Pillar {
  slug: string;
  label: string;
  shortLabel: string;
}

/** The topical pillar pages every county page links back to. */
export const PILLARS: Pillar[] = [
  { slug: "blocaje-relatii", label: "Blocaje în relații", shortLabel: "Blocaje în relații" },
  { slug: "blocaje-financiare", label: "Blocaje financiare", shortLabel: "Blocaje financiare" },
  { slug: "horoscop-astrologie", label: "Horoscop și astrologie", shortLabel: "Horoscop" },
  { slug: "terapie-autocunoastere", label: "Terapie și autocunoaștere", shortLabel: "Autocunoaștere" },
  { slug: "compatibilitate-cuplu", label: "Compatibilitate în cuplu", shortLabel: "Compatibilitate" },
  { slug: "blocaje-parinti-copii", label: "Blocaje părinți-copii", shortLabel: "Părinți-copii" },
  { slug: "pierderi-doliu-familie", label: "Pierderi și doliu în familie", shortLabel: "Pierderi și doliu" },
  { slug: "anxietate-stima-de-sine", label: "Anxietate și stimă de sine", shortLabel: "Anxietate" },
];
