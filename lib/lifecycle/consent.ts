/**
 * Textele de acord, într-un singur loc: formularele le afișează, serverul le
 * păstrează lângă momentul bifei. Fără importuri de server — ajunge și în browser.
 */

export const LEAD_CONSENT_TEXT =
  "Vreau să primesc pe e-mail ghidul pentru prima constelație și, după câteva zile, un singur mesaj despre cum îmi fac un cont gratuit. Mă pot dezabona oricând, din orice e-mail.";

/**
 * Anunțul de la „Creează cont” (Legea 506/2004, art. 12 alin. 2): fără bifă de
 * refuz. Orice cont nou — cu parolă sau prin Google, pornit de oriunde — se
 * înregistrează cu marketing permis (`marketingOptOut = false`,
 * `marketingChoiceAt = now`); refuzul se face din linkul de dezabonare din
 * fiecare e-mail.
 */
export const SIGNUP_MARKETING_NOTICE =
  "Îți putem trimite ocazional sfaturi și noutăți; te poți dezabona din orice e-mail.";
