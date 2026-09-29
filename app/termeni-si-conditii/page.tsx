import type { Metadata } from "next";
import LegalPage, { A, H2, UL } from "@/components/legal/LegalPage";
import {
  ANPC_SAL_URL,
  ANPC_URL,
  LEGAL_LINKS,
  OPERATOR,
  OPERATOR_ADDRESS_LINE,
  PRICE_NOTE,
  SITE_DOMAIN,
  SITE_NAME,
} from "@/lib/legal";

export const metadata: Metadata = {
  alternates: { canonical: "/termeni-si-conditii" },
  title: `Termeni și condiții — ${SITE_NAME}`,
  description: `Termenii și condițiile de utilizare a serviciului ${SITE_NAME} (${SITE_DOMAIN}).`,
};

export default function TermeniPage() {
  return (
    <LegalPage title="Termeni și condiții">
      <H2>1. Cine suntem</H2>
      <p>
        Site-ul {SITE_DOMAIN} și serviciul „{SITE_NAME}” (denumit în continuare „Serviciul”) sunt operate de{" "}
        <strong>{OPERATOR.name}</strong>, cu sediul social în {OPERATOR_ADDRESS_LINE}, înregistrată la Registrul
        Comerțului sub nr. {OPERATOR.regCom}, EUID {OPERATOR.euid}, CUI {OPERATOR.cui}, {OPERATOR.vatStatus}{" "}
        („Furnizorul”, „noi”). Ne poți contacta la <A href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</A>.
      </p>
      <p>
        Prin utilizarea Serviciului sau prin crearea unui cont, confirmi că ai citit și accepți acești Termeni. Dacă
        nu ești de acord cu ei, te rugăm să nu folosești Serviciul.
      </p>

      <H2>2. Ce este Serviciul</H2>
      <p>
        {SITE_NAME} este un instrument digital de auto-reflecție inspirat din metoda constelațiilor familiale
        (sistemice). Completezi un scurt chestionar, poți adăuga opțional datele nașterii (pentru o hartă natală
        astrologică), așezi figuri pe o tablă interactivă, iar un model de inteligență artificială (Claude, dezvoltat
        de Anthropic) generează o interpretare scrisă: o interpretare inițială scurtă, gratuită, și — contra unui
        credit — un raport complet.
      </p>
      <p className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-foreground/90">
        <strong>Important:</strong> Serviciul NU este terapie psihologică, psihoterapie, consiliere, act medical sau
        diagnostic și nu înlocuiește consultul unui medic, psiholog, psihoterapeut sau alt specialist. Interpretările
        au caracter informativ și de auto-cunoaștere. Elementele astrologice sunt oferite ca strat simbolic de
        reflecție, nu ca predicții. Dacă treci printr-o criză, ai gânduri de a-ți face rău sau ești în pericol,
        sună imediat la 112 sau adresează-te unui specialist.
      </p>

      <H2>3. Inteligența artificială</H2>
      <UL>
        <li>
          Interpretările sunt generate automat de un model AI pe baza datelor pe care le introduci. Ele pot fi
          incomplete, inexacte sau nepotrivite situației tale reale și nu reprezintă opinia unui specialist.
        </li>
        <li>
          Nu lua decizii importante (de sănătate, juridice, financiare, familiale) doar pe baza lor. Folosește-le
          critic, ca punct de plecare pentru reflecție.
        </li>
        <li>
          Ești responsabil pentru informațiile pe care le introduci. Te rugăm să nu incluzi date care identifică
          direct alte persoane (nume complete, adrese, date de contact) și să scrii doar ce este necesar.
        </li>
        <li>
          Pentru a genera interpretarea, datele introduse sunt transmise furnizorului nostru de AI, numai cu
          acordul tău explicit, exprimat înainte de generare. Detalii în{" "}
          <A href={LEGAL_LINKS.privacy}>Politica de confidențialitate</A>.
        </li>
      </UL>

      <H2>4. Contul</H2>
      <UL>
        <li>
          Interpretarea inițială se poate obține fără cont. Pentru salvarea constelațiilor și pentru raportul complet
          este nevoie de un cont, creat cu nume, adresă de e-mail și parolă.
        </li>
        <li>
          Trebuie să ai cel puțin 18 ani pentru a crea un cont și a face plăți. Serviciul nu se adresează minorilor.
        </li>
        <li>
          Răspunzi de păstrarea confidențialității parolei și de activitatea din contul tău. Anunță-ne imediat dacă
          suspectezi o utilizare neautorizată.
        </li>
        <li>
          Poți cere oricând închiderea contului și ștergerea datelor scriindu-ne la {OPERATOR.email}. Creditele
          nefolosite la data închiderii la cererea ta nu se rambursează, cu excepția cazurilor prevăzute de lege.
        </li>
      </UL>

      <H2>5. Prețuri, credite și plată</H2>
      <UL>
        <li>
          Interpretarea inițială este gratuită. Raportul complet al unei constelații se deblochează cu un credit.
          Creditele se cumpără în pachete (de exemplu 1, 3 sau 5 credite), la prețurile afișate pe pagina{" "}
          <A href="/pachete">Pachete</A> în momentul comenzii, în lei (RON).
        </li>
        <li>
          {PRICE_NOTE} Prețurile afișate sunt prețurile finale plătite.
        </li>
        <li>
          Plata este unică (nu există abonament și nici reînnoire automată). Creditele se adaugă în portofelul
          contului după confirmarea plății, nu expiră și pot fi folosite pentru orice constelație salvată în cont.
          Un credit deblochează o singură constelație, o singură dată.
        </li>
        <li>
          Creditele nu sunt bani electronici, nu sunt transferabile între conturi și nu pot fi schimbate în bani,
          cu excepția cazurilor prevăzute de lege sau de acești Termeni.
        </li>
        <li>
          Plata se face cu cardul prin procesatorul Stripe (Stripe Payments Europe, Ltd.). Nu stocăm datele cardului
          tău. Pe pagina de plată Stripe îți cere numele, adresa de facturare și, opțional, codul fiscal, pentru
          factură.
        </li>
        <li>
          Factura se emite automat, prin platforma Oblio, și se transmite în sistemul RO e-Factura atunci când legea
          o cere. Link-ul facturii ți se trimite prin e-mail. Furnizorul nu este plătitor de TVA, astfel că factura
          nu conține TVA.
        </li>
        <li>
          Dacă generarea raportului complet eșuează din cauze tehnice, creditul cheltuit îți este restituit automat
          în portofel.
        </li>
      </UL>

      <H2>6. Dreptul de retragere</H2>
      <p>
        Ca și consumator, ai în principiu dreptul de a te retrage dintr-un contract încheiat la distanță în termen de
        14 zile, fără a preciza motivele, conform OUG nr. 34/2014. Potrivit art. 16 lit. a) și lit. m) din OUG nr.
        34/2014, acest drept nu se aplică:
      </p>
      <UL>
        <li>
          pentru furnizarea de conținut digital care nu este livrat pe un suport material, dacă executarea a început
          cu acordul tău prealabil expres și după ce ai confirmat că ai luat cunoștință de faptul că îți pierzi
          dreptul de retragere (art. 16 lit. m);
        </li>
        <li>
          pentru serviciile prestate integral, dacă prestarea a început cu acordul tău prealabil expres și după ce ai
          confirmat că ai luat cunoștință de faptul că îți pierzi dreptul de retragere odată ce contractul a fost
          executat integral (art. 16 lit. a).
        </li>
      </UL>
      <p>
        Înainte de plată îți cerem, printr-o bifă separată, să soliciți furnizarea imediată și să confirmi că, odată
        cu începerea executării (adăugarea creditelor în cont și, ulterior, generarea rapoartelor), îți pierzi
        dreptul de retragere. Păstrăm data și ora acestui acord și versiunea Termenilor acceptată.
      </p>
      <p>
        Pentru orice problemă legată de o plată (plată dublă, credite neadăugate, eroare tehnică), scrie-ne la{" "}
        {OPERATOR.email}. Tratăm reclamațiile în cel mult 30 de zile. Drepturile tale legale de consumator (inclusiv
        cele privind conformitatea conținutului și serviciilor digitale, conform OUG nr. 141/2021) nu sunt afectate.
      </p>

      <H2>7. Utilizare acceptabilă</H2>
      <p>Te angajezi să nu folosești Serviciul pentru:</p>
      <UL>
        <li>introducerea de conținut ilegal, defăimător, amenințător sau care încalcă drepturile altor persoane;</li>
        <li>introducerea de date personale ale altor persoane dincolo de ce este strict necesar pentru reflecția ta;</li>
        <li>
          încercări de a perturba, supraîncărca sau accesa neautorizat Serviciul, de a ocoli limitele sau plățile, ori
          de a extrage automat conținut;
        </li>
        <li>revânzarea sau exploatarea comercială a Serviciului sau a rapoartelor fără acordul nostru scris.</li>
      </UL>
      <p>
        Putem suspenda sau închide un cont care încalcă acești Termeni sau legea, după caz cu notificare prealabilă.
        Dacă măsura nu se datorează culpei tale, îți restituim contravaloarea creditelor nefolosite.
      </p>

      <H2>8. Conținut și proprietate intelectuală</H2>
      <UL>
        <li>
          Site-ul, aplicația, textele, simbolurile și designul aparțin Furnizorului sau licențiatorilor săi și sunt
          protejate de lege.
        </li>
        <li>
          Datele pe care le introduci rămân ale tale. Ne acorzi dreptul neexclusiv de a le prelucra strict în măsura
          necesară furnizării Serviciului (generarea și păstrarea interpretărilor în contul tău).
        </li>
        <li>
          Poți folosi rapoartele generate pentru tine în scop personal, necomercial.
        </li>
      </UL>

      <H2>9. Răspundere</H2>
      <UL>
        <li>
          Serviciul este oferit ca instrument de auto-reflecție. Nu răspundem pentru deciziile luate exclusiv pe baza
          interpretărilor generate de AI.
        </li>
        <li>
          Depunem eforturi rezonabile ca Serviciul să fie disponibil, dar pot exista întreruperi pentru mentenanță
          sau din cauze independente de noi (furnizori, rețea).
        </li>
        <li>
          Limitările de mai sus nu se aplică în cazul faptei intenționate sau al culpei grave, al prejudiciilor aduse
          vieții, integrității corporale sau sănătății și nu limitează drepturile pe care ți le conferă legislația
          privind protecția consumatorilor.
        </li>
      </UL>

      <H2>10. Date personale și cookies</H2>
      <p>
        Prelucrarea datelor personale este descrisă în <A href={LEGAL_LINKS.privacy}>Politica de confidențialitate</A>,
        iar folosirea cookies în <A href={LEGAL_LINKS.cookies}>Politica de cookies</A>.
      </p>

      <H2>11. Modificarea Termenilor</H2>
      <p>
        Putem actualiza acești Termeni (de exemplu la schimbări legislative sau ale Serviciului). Versiunea și data
        intrării în vigoare sunt afișate la începutul paginii. Modificările importante le anunțăm pe site sau prin
        e-mail înainte de intrarea în vigoare. Cumpărările deja făcute rămân guvernate de versiunea acceptată la data
        comenzii.
      </p>

      <H2>12. Legea aplicabilă, reclamații și litigii</H2>
      <p>
        Acești Termeni sunt guvernați de legea română. Reclamațiile ni le poți trimite la {OPERATOR.email}; încercăm
        să rezolvăm orice neînțelegere pe cale amiabilă. Litigiile nesoluționate amiabil se judecă de instanțele
        competente din România; dacă ești consumator, poți sesiza și instanța de la domiciliul tău, conform legii.
      </p>
      <p>
        Ca și consumator, te poți adresa Autorității Naționale pentru Protecția Consumatorilor (
        <A href={ANPC_URL}>anpc.ro</A>) și poți apela la procedura de soluționare alternativă a litigiilor (
        <A href={ANPC_SAL_URL}>ANPC – SAL</A>).
      </p>
    </LegalPage>
  );
}
