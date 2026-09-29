/**
 * The 41 Romanian județe + București, with county seat and official
 * development region — verified against localitati.dev (2026).
 *
 * The service is 100% online and has no per-county data (no local
 * facilitators, sessions or events), so the county pages are the same text
 * with only the county facts swapped. They stay reachable for visitors but are
 * noindex and out of the sitemap, and the pillar pages no longer link to them.
 * Make them indexable again only once a county has real local content.
 */

export type DevelopmentRegion =
  | "Nord-Vest"
  | "Nord-Est"
  | "Centru"
  | "Vest"
  | "Sud-Vest Oltenia"
  | "Sud-Muntenia"
  | "Sud-Est"
  | "București-Ilfov";

export interface County {
  slug: string;
  name: string;
  /** Grammatically correct "din <name>" form for counties needing an article shift (e.g. Argeș -> "din Argeș" is fine, but some need special-casing). */
  seat: string;
  region: DevelopmentRegion;
}

export const COUNTIES: County[] = [
  { slug: "alba", name: "Alba", seat: "Alba Iulia", region: "Centru" },
  { slug: "arad", name: "Arad", seat: "Arad", region: "Vest" },
  { slug: "arges", name: "Argeș", seat: "Pitești", region: "Sud-Muntenia" },
  { slug: "bacau", name: "Bacău", seat: "Bacău", region: "Nord-Est" },
  { slug: "bihor", name: "Bihor", seat: "Oradea", region: "Nord-Vest" },
  { slug: "bistrita-nasaud", name: "Bistrița-Năsăud", seat: "Bistrița", region: "Nord-Vest" },
  { slug: "botosani", name: "Botoșani", seat: "Botoșani", region: "Nord-Est" },
  { slug: "brasov", name: "Brașov", seat: "Brașov", region: "Centru" },
  { slug: "braila", name: "Brăila", seat: "Brăila", region: "Sud-Est" },
  { slug: "bucuresti", name: "București", seat: "București", region: "București-Ilfov" },
  { slug: "buzau", name: "Buzău", seat: "Buzău", region: "Sud-Est" },
  { slug: "caras-severin", name: "Caraș-Severin", seat: "Reșița", region: "Vest" },
  { slug: "calarasi", name: "Călărași", seat: "Călărași", region: "Sud-Muntenia" },
  { slug: "cluj", name: "Cluj", seat: "Cluj-Napoca", region: "Nord-Vest" },
  { slug: "constanta", name: "Constanța", seat: "Constanța", region: "Sud-Est" },
  { slug: "covasna", name: "Covasna", seat: "Sfântu Gheorghe", region: "Centru" },
  { slug: "dambovita", name: "Dâmbovița", seat: "Târgoviște", region: "Sud-Muntenia" },
  { slug: "dolj", name: "Dolj", seat: "Craiova", region: "Sud-Vest Oltenia" },
  { slug: "galati", name: "Galați", seat: "Galați", region: "Sud-Est" },
  { slug: "giurgiu", name: "Giurgiu", seat: "Giurgiu", region: "Sud-Muntenia" },
  { slug: "gorj", name: "Gorj", seat: "Târgu Jiu", region: "Sud-Vest Oltenia" },
  { slug: "harghita", name: "Harghita", seat: "Miercurea Ciuc", region: "Centru" },
  { slug: "hunedoara", name: "Hunedoara", seat: "Deva", region: "Vest" },
  { slug: "ialomita", name: "Ialomița", seat: "Slobozia", region: "Sud-Muntenia" },
  { slug: "iasi", name: "Iași", seat: "Iași", region: "Nord-Est" },
  { slug: "ilfov", name: "Ilfov", seat: "Buftea", region: "București-Ilfov" },
  { slug: "maramures", name: "Maramureș", seat: "Baia Mare", region: "Nord-Vest" },
  { slug: "mehedinti", name: "Mehedinți", seat: "Drobeta-Turnu Severin", region: "Sud-Vest Oltenia" },
  { slug: "mures", name: "Mureș", seat: "Târgu Mureș", region: "Centru" },
  { slug: "neamt", name: "Neamț", seat: "Piatra Neamț", region: "Nord-Est" },
  { slug: "olt", name: "Olt", seat: "Slatina", region: "Sud-Vest Oltenia" },
  { slug: "prahova", name: "Prahova", seat: "Ploiești", region: "Sud-Muntenia" },
  { slug: "satu-mare", name: "Satu Mare", seat: "Satu Mare", region: "Nord-Vest" },
  { slug: "salaj", name: "Sălaj", seat: "Zalău", region: "Nord-Vest" },
  { slug: "sibiu", name: "Sibiu", seat: "Sibiu", region: "Centru" },
  { slug: "suceava", name: "Suceava", seat: "Suceava", region: "Nord-Est" },
  { slug: "teleorman", name: "Teleorman", seat: "Alexandria", region: "Sud-Muntenia" },
  { slug: "timis", name: "Timiș", seat: "Timișoara", region: "Vest" },
  { slug: "tulcea", name: "Tulcea", seat: "Tulcea", region: "Sud-Est" },
  { slug: "vaslui", name: "Vaslui", seat: "Vaslui", region: "Nord-Est" },
  { slug: "valcea", name: "Vâlcea", seat: "Râmnicu Vâlcea", region: "Sud-Vest Oltenia" },
  { slug: "vrancea", name: "Vrancea", seat: "Focșani", region: "Sud-Est" },
];

/**
 * "județul Cluj" is correct, but București is a municipiu (not a județ) —
 * saying "județul București" is a small but real terminology error.
 */
export function administrativeUnitPhrase(county: County): string {
  return county.slug === "bucuresti" ? "municipiul București" : `județul ${county.name}`;
}

export function getCountyBySlug(slug: string): County | undefined {
  return COUNTIES.find((c) => c.slug === slug);
}

/** Other counties in the same development region — used for genuine internal linking, not filler. */
export function neighborCounties(county: County, count = 4): County[] {
  return COUNTIES.filter((c) => c.region === county.region && c.slug !== county.slug).slice(0, count);
}
