// Datele operatorului și versiunea documentelor legale — o singură sursă,
// folosită în footer, pagina de contact, paginile legale, JSON-LD și la plată.

export const LEGAL_VERSION = "2026-09-26";
/** Data de intrare în vigoare, în formatul afișat pe pagini. */
export const LEGAL_EFFECTIVE_DATE = "26.09.2026";

export const OPERATOR = {
  name: "CULOAREA DIN VIAȚA SA S.R.L.",
  cui: "44820819",
  vatStatus: "neplătitor de TVA",
  regCom: "J2021001108100",
  euid: "ROONRC.J2021001108100",
  address: {
    street: "Sat Topliceni nr. 214, Com. Topliceni",
    locality: "Topliceni",
    county: "jud. Buzău",
    postalCode: "127630",
    country: "România",
    countryCode: "RO",
  },
  email: "contact@constelatii.com",
} as const;

export const SITE_NAME = "Constelații Familiale";
export const SITE_DOMAIN = "constelatii.com";

export const OPERATOR_ADDRESS_LINE = `${OPERATOR.address.street}, ${OPERATOR.address.county}, ${OPERATOR.address.postalCode}, ${OPERATOR.address.country}`;

/** Mențiunea de preț, peste tot unde apare un preț. */
export const PRICE_NOTE = "Preț final; furnizorul nu este plătitor de TVA.";

export const LEGAL_LINKS = {
  terms: "/termeni-si-conditii",
  privacy: "/politica-de-confidentialitate",
  cookies: "/politica-cookies",
  contact: "/contact",
} as const;

export const ANPC_URL = "https://anpc.ro";
export const ANPC_SAL_URL = "https://anpc.ro/ce-este-sal/";

export function organizationJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: SITE_NAME,
        legalName: OPERATOR.name,
        url: baseUrl,
        email: OPERATOR.email,
        taxID: OPERATOR.cui,
        identifier: OPERATOR.euid,
        address: {
          "@type": "PostalAddress",
          streetAddress: OPERATOR.address.street,
          addressLocality: OPERATOR.address.locality,
          addressRegion: "Buzău",
          postalCode: OPERATOR.address.postalCode,
          addressCountry: OPERATOR.address.countryCode,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: SITE_NAME,
        inLanguage: "ro-RO",
        publisher: { "@id": `${baseUrl}/#organization` },
      },
    ],
  };
}
