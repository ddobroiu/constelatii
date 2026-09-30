export interface Pillar {
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
}

/** The topical pillar pages every county page links back to. */
export const PILLARS: Pillar[] = [
  {
    slug: "blocaje-relatii",
    label: "Blocaje în relații",
    shortLabel: "Blocaje în relații",
    description: "De ce se repetă aceleași tipare, relație după relație, și cum le poți vedea printr-o constelație.",
  },
  {
    slug: "blocaje-financiare",
    label: "Blocaje financiare",
    shortLabel: "Blocaje financiare",
    description: "Originea sistemică a banilor care „nu rămân”, a lipsei sau a vinovăției legate de bani.",
  },
  {
    slug: "horoscop-astrologie",
    label: "Horoscop și astrologie",
    shortLabel: "Horoscop",
    description: "Cum se citește real o hartă natală și ce spune ea despre tine, dincolo de zodia zilnică.",
  },
  {
    slug: "terapie-autocunoastere",
    label: "Terapie și autocunoaștere",
    shortLabel: "Autocunoaștere",
    description: "Ce sunt constelațiile familiale, de unde vin, și cum completează (nu înlocuiesc) terapia.",
  },
  {
    slug: "compatibilitate-cuplu",
    label: "Compatibilitate în cuplu",
    shortLabel: "Compatibilitate",
    description: "Ce arată, real, sinastria astrologică — și de ce te atrag mereu variante ale aceluiași om.",
  },
  {
    slug: "blocaje-parinti-copii",
    label: "Blocaje părinți-copii",
    shortLabel: "Părinți-copii",
    description: "Ordinea iubirii — și ce se întâmplă când copilul devine, emoțional, părintele părintelui său.",
  },
  {
    slug: "pierderi-doliu-familie",
    label: "Pierderi și doliu în familie",
    shortLabel: "Pierderi și doliu",
    description: "Ce se întâmplă cu durerea pe care familia n-a apucat s-o plângă — și cine o poartă mai departe.",
  },
  {
    slug: "anxietate-stima-de-sine",
    label: "Anxietate și stimă de sine",
    shortLabel: "Anxietate",
    description: "Neliniștea „fără motiv aparent” poate avea multe cauze; constelațiile propun o perspectivă: tipare din familie.",
  },
  {
    slug: "de-ce-nu-atrag-bani",
    label: "De ce nu atrag bani",
    shortLabel: "De ce nu atrag bani",
    description: "Nu e despre cât de tare vrei sau muncești — e despre dacă sistemul tău interior îți permite să primești.",
  },
  {
    slug: "de-ce-nu-atrag-relatii",
    label: "De ce nu atrag relații",
    shortLabel: "De ce nu atrag relații",
    description: "Când relațiile pur și simplu nu se întâmplă — nu despre tipare într-o relație, ci despre absența lor.",
  },
  {
    slug: "meditatie",
    label: "Meditație și practică interioară",
    shortLabel: "Meditație",
    description: "De ce o constelație e, în esență, o formă de meditație activă — și cum te pregătești pentru ea.",
  },
];
