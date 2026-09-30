/**
 * Textele de acord, într-un singur loc: formularele le afișează, serverul le
 * păstrează lângă momentul bifei. Fără importuri de server — ajunge și în browser.
 */

export const LEAD_CONSENT_TEXT =
  "Vreau să primesc pe e-mail ghidul pentru prima constelație și, după câteva zile, un singur mesaj despre cum îmi fac un cont gratuit. Mă pot dezabona oricând, din orice e-mail.";

export const SIGNUP_MARKETING_NOTICE =
  "Îți trimitem pe e-mail pașii de început și, din când în când, sfaturi și noutăți despre Constelații Familiale. Te poți dezabona oricând, cu un click, din orice e-mail.";

export const SIGNUP_OPT_OUT_LABEL = "Nu vreau emailuri cu noutăți și sfaturi";

/**
 * „Continuă cu Google” pleacă din pagină; alegerea de pe „Creează cont” ajunge la
 * întoarcere printr-un cookie scurt („in” / „out”). Pe „Autentificare” se șterge:
 * contul creat de acolo rămâne fără alegere (marketingChoiceAt NULL) și primește
 * doar bun venit, fără e-mailurile periodice.
 */
export const MARKETING_CHOICE_COOKIE = "cf_mkt";
