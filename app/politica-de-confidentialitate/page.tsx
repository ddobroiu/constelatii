import type { Metadata } from "next";
import LegalPage, { A, H2, UL } from "@/components/legal/LegalPage";
import { LEGAL_LINKS, OPERATOR, OPERATOR_ADDRESS_LINE, SITE_DOMAIN, SITE_NAME } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Politica de confidențialitate — ${SITE_NAME}`,
  description: `Cum prelucrează ${OPERATOR.name} datele personale ale utilizatorilor ${SITE_DOMAIN}.`,
};

export default function ConfidentialitatePage() {
  return (
    <LegalPage title="Politica de confidențialitate">
      <p>
        Această politică explică, conform art. 13 din Regulamentul (UE) 2016/679 („GDPR”), ce date personale
        prelucrăm când folosești {SITE_DOMAIN} („{SITE_NAME}”), de ce, pe ce temei, cui le transmitem, cât le
        păstrăm și ce drepturi ai.
      </p>

      <H2>1. Operatorul de date</H2>
      <p>
        {OPERATOR.name}, CUI {OPERATOR.cui}, Nr. Reg. Com. {OPERATOR.regCom}, cu sediul în {OPERATOR_ADDRESS_LINE}.
        Contact pentru orice întrebare sau cerere privind datele personale:{" "}
        <A href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</A>. Nu am desemnat un responsabil cu protecția datelor
        (DPO); cererile se trimit la adresa de e-mail de mai sus.
      </p>

      <H2>2. Ce date prelucrăm, de ce și pe ce temei</H2>
      <UL>
        <li>
          <strong>Datele contului</strong> — nume, e-mail, parolă (stocată doar criptat, ca hash), cod de recomandare,
          contul care te-a recomandat, data acceptării Termenilor. Scop: crearea și administrarea contului.
          Temei: executarea contractului (art. 6 alin. (1) lit. b GDPR).
        </li>
        <li>
          <strong>Datele constelației</strong> — relația aleasă, temele bifate, textele libere pe care le scrii,
          persoanele (rolurile) așezate pe tablă, pozițiile, simbolurile și culorile alese, interpretările generate.
          Scop: generarea interpretării și, dacă ai cont, salvarea constelației și a raportului. Temei: executarea
          contractului (art. 6 alin. (1) lit. b) și, întrucât aceste informații pot dezvălui aspecte despre sănătatea
          ta emoțională sau psihică ori viața de familie, <strong>consimțământul tău explicit</strong> (art. 9 alin.
          (2) lit. a GDPR), pe care ți-l cerem printr-o bifă separată înainte de generarea interpretării.
        </li>
        <li>
          <strong>Datele nașterii (opțional)</strong> — data, ora și locul nașterii, folosite pentru calculul hărții
          natale; căutarea locului este trimisă serviciului de geocodare OpenStreetMap Nominatim (doar textul
          căutat). Temei: consimțământ și executarea contractului; pasul poate fi sărit.
        </li>
        <li>
          <strong>Datele de plată și facturare</strong> — nume, e-mail, adresă de facturare, cod fiscal (dacă îl
          introduci), pachetul cumpărat, suma, identificatorii plății Stripe, data acordului pentru începerea
          imediată a serviciului și versiunea Termenilor, datele facturii. Datele cardului sunt prelucrate direct de
          Stripe; noi nu le vedem și nu le stocăm. Temei: executarea contractului (lit. b) și obligația legală de
          evidență contabilă și fiscală (art. 6 alin. (1) lit. c; Legea contabilității nr. 82/1991, Codul fiscal).
        </li>
        <li>
          <strong>E-mailuri tranzacționale</strong> — confirmarea plății și link-ul facturii. Temei: executarea
          contractului. Nu trimitem newslettere sau mesaje de marketing.
        </li>
        <li>
          <strong>Date tehnice și de securitate</strong> — adresa IP, tipul browserului, jurnale ale serverului,
          cookies strict necesare de autentificare. Scop: funcționarea, securitatea și prevenirea fraudei sau a
          abuzului. Temei: interesul nostru legitim (art. 6 alin. (1) lit. f).
        </li>
        <li>
          <strong>Statistici de utilizare</strong> — pagini vizitate, sursa vizitei, identificatori de vizitator
          (Google Analytics 4, mydashboard.ro). Temei: consimțământul tău (art. 6 alin. (1) lit. a), exprimat în
          bannerul de cookies; fără acord aceste instrumente nu se încarcă.
        </li>
        <li>
          <strong>Marketing / reclame</strong> — identificatori de cookie și de browser, paginile vizitate și
          evenimente precum vizualizarea pachetelor, începerea plății și plata finalizată (valoare, monedă,
          identificatorul comenzii, fără nume sau e-mail), prin TikTok Pixel. Scop: măsurarea eficienței reclamelor
          și afișarea de reclame relevante. Temei: consimțământul tău (art. 6 alin. (1) lit. a), exprimat în
          bannerul de cookies la categoria „Marketing / reclame”; fără acord pixelul nu se încarcă, iar acordul poate
          fi retras oricând din „Setări cookies”.
        </li>
      </UL>
      <p>
        Furnizarea datelor contului și a datelor de facturare este necesară pentru a încheia contractul și a primi
        factura; fără ele nu putem furniza serviciul plătit. Celelalte date (texte libere, datele nașterii,
        statistici) sunt opționale.
      </p>
      <p>
        Te rugăm să nu introduci în textele libere date care identifică direct alte persoane (nume complete,
        adrese, telefoane) sau detalii medicale care nu sunt necesare.
      </p>

      <H2>3. Inteligența artificială și decizii automate</H2>
      <p>
        Interpretările sunt generate de modelul Claude, furnizat de Anthropic, PBC (SUA), prin API. Transmitem
        doar datele constelației (nu numele sau e-mailul tău) și doar după ce îți dai consimțământul explicit.
        Conform condițiilor comerciale ale Anthropic, datele trimise prin API nu sunt folosite pentru antrenarea
        modelelor și sunt păstrate de furnizor pentru o perioadă limitată (în principiu cel mult 30 de zile), pentru
        siguranță și prevenirea abuzurilor. Interpretarea nu produce efecte juridice și nu te afectează în mod
        similar semnificativ; nu luăm decizii bazate exclusiv pe prelucrare automată în sensul art. 22 GDPR.
      </p>

      <H2>4. Cui transmitem datele</H2>
      <p>Folosim următorii furnizori (persoane împuternicite), fiecare doar pentru scopul indicat:</p>
      <UL>
        <li>Hetzner Online GmbH (Germania/Finlanda, UE) — găzduirea aplicației și a bazei de date;</li>
        <li>Anthropic, PBC (SUA) — generarea interpretărilor AI;</li>
        <li>Stripe Payments Europe, Ltd. (Irlanda) și afiliații Stripe (SUA) — procesarea plăților;</li>
        <li>Oblio Software SRL (România) — emiterea facturilor și transmiterea în RO e-Factura (ANAF);</li>
        <li>Resend (Plus Five Five, Inc., SUA) — trimiterea e-mailurilor tranzacționale;</li>
        <li>
          OpenStreetMap Foundation (Nominatim) — căutarea locului nașterii, doar textul căutat, fără date de
          identificare;
        </li>
        <li>Google Ireland Limited / Google LLC — Google Analytics 4, doar cu acordul tău;</li>
        <li>
          TikTok Technology Limited (Irlanda) — TikTok Pixel, măsurarea eficienței reclamelor și retargeting, doar
          cu acordul tău pentru marketing;
        </li>
        <li>
          mydashboard.ro — instrument intern de statistici și monitorizare, operat de aceeași societate ({OPERATOR.name}),
          doar cu acordul tău pentru statistici; primește și alerte tehnice fără date ale clienților, în afara
          identificatorului plății.
        </li>
      </UL>
      <p>
        Putem divulga date autorităților doar când legea ne obligă (de exemplu ANAF, instanțe, organe de cercetare).
        Nu vindem datele tale.
      </p>

      <H2>5. Transferuri în afara SEE</H2>
      <p>
        Unii furnizori (Anthropic, Stripe, Resend, Google, TikTok) sunt în SUA sau în alte țări din afara SEE ori
        au acces de acolo. Transferurile se fac în
        baza deciziei de adecvare pentru Cadrul UE-SUA privind protecția datelor (EU-US Data Privacy Framework),
        pentru furnizorii certificați, și/sau a clauzelor contractuale standard adoptate de Comisia Europeană,
        împreună cu măsuri suplimentare (criptare în tranzit). Poți cere detalii la {OPERATOR.email}.
      </p>

      <H2>6. Cât păstrăm datele</H2>
      <UL>
        <li>
          Contul, constelațiile salvate și rapoartele — cât timp ai cont; le ștergem la cererea ta de închidere a
          contului (în cel mult 30 de zile), cu excepția datelor pe care legea ne obligă să le păstrăm.
        </li>
        <li>
          Interpretările cerute fără cont — nu le stocăm pe serverele noastre; datele stau doar în browserul tău
          (sessionStorage) până închizi fila.
        </li>
        <li>
          Facturile și documentele justificative ale plăților — 10 ani, conform Legii nr. 82/1991.
        </li>
        <li>Jurnale tehnice — cel mult 90 de zile, dacă nu sunt necesare pentru investigarea unui incident.</li>
        <li>
          Cookies de statistici și de marketing — conform <A href={LEGAL_LINKS.cookies}>Politicii de cookies</A>; alegerea privind
          cookies — 6 luni.
        </li>
      </UL>

      <H2>7. Drepturile tale</H2>
      <p>Conform GDPR, ai dreptul:</p>
      <UL>
        <li>de acces la datele tale și de a primi o copie;</li>
        <li>la rectificarea datelor inexacte;</li>
        <li>la ștergerea datelor („dreptul de a fi uitat”);</li>
        <li>la restricționarea prelucrării;</li>
        <li>la portabilitatea datelor;</li>
        <li>de opoziție față de prelucrarea bazată pe interes legitim;</li>
        <li>
          de a-ți retrage oricând consimțământul (pentru prelucrarea datelor constelației sau pentru cookies), fără a
          afecta legalitatea prelucrării anterioare retragerii — pentru cookies, folosește linkul „Setări cookies”
          din subsolul paginii;
        </li>
        <li>de a nu face obiectul unei decizii bazate exclusiv pe prelucrare automată;</li>
        <li>
          de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter
          Personal (ANSPDCP), B-dul G-ral. Gheorghe Magheru nr. 28-30, sector 1, București,{" "}
          <A href="https://www.dataprotection.ro">www.dataprotection.ro</A>.
        </li>
      </UL>
      <p>
        Pentru exercitarea drepturilor, scrie-ne la {OPERATOR.email}, de pe adresa asociată contului. Răspundem în
        cel mult o lună de la primirea cererii (termen care poate fi prelungit în condițiile GDPR).
      </p>

      <H2>8. Securitate</H2>
      <p>
        Folosim conexiuni criptate (HTTPS), parole stocate ca hash, acces restricționat la baza de date și furnizori
        care oferă garanții adecvate. Nicio metodă de transmitere sau stocare nu este însă complet sigură.
      </p>

      <H2>9. Minori</H2>
      <p>
        Serviciul nu se adresează persoanelor sub 18 ani și nu colectăm cu bună știință date ale minorilor. Dacă
        afli că un minor ne-a transmis date, scrie-ne și le vom șterge.
      </p>

      <H2>10. Modificări</H2>
      <p>
        Putem actualiza această politică; versiunea și data intrării în vigoare sunt afișate la începutul paginii.
      </p>
    </LegalPage>
  );
}
