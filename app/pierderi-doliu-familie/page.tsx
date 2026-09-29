import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";

export const metadata: Metadata = pageMetadata({
  path: "/pierderi-doliu-familie",
  title: "Pierderi și doliu în familie",
  description:
    "O sarcină pierdută, un frate mort înainte să te naști, un membru exclus din familie — ce se întâmplă cu durerea nespusă și cum arată o constelație pentru asta.",
});

export default function PierderiDoliuFamiliePage() {
  return (
    <ArticlePage
      eyebrow="Pierderi și doliu în familie"
      title="Ce se întâmplă cu durerea pe care familia n-a apucat s-o plângă"
      intro={[
        "O sarcină pierdută niciodată menționată. Un copil mort la naștere, „uitat” repede ca să meargă viața mai departe. Un frate al bunicului, exclus din familie și șters din poveste. Constelațiile familiale pornesc de la o observație tulburătoare, dar consecventă: ce e exclus din câmpul de atenție al unei familii nu dispare — cineva, mai târziu, îl poartă mai departe, fără să știe de ce.",
      ]}
      sections={[
        {
          heading: "Legea includerii — „toți cei care aparțin unui sistem au dreptul la un loc”",
          body: [
            "Hellinger a numit-o legea includerii: fiecare persoană care a aparținut cu adevărat unei familii — inclusiv o sarcină pierdută, un copil mort de mic, un membru exclus din rușine sau conflict — are dreptul la un loc în „memoria” sistemului. Când cineva e omis din poveste, din amintire, din discuții („nu mai vorbim despre asta”), sistemul tinde să-l readucă indirect: un membru mai tânăr moștenește, fără explicație, o tristețe care nu-i aparține, o teamă de atașament, sau o loialitate inconștientă față de cel exclus.",
            "Fenomenul se numește identificare sistemică: cineva „ia locul” celui absent, retrăindu-i emoțional soarta, fără nicio legătură conștientă. Un copil se poate simți inexplicabil trist de ziua lui de naștere — și abia mai târziu află că exact atunci ar fi trebuit să se nască un frate pierdut înaintea lui.",
          ],
        },
        {
          heading: "Cum arată o constelație pentru o pierdere",
          body: [
            "Pe tablă, persoana pierdută primește un loc — chiar dacă nu are date biografice complete, chiar dacă nimeni nu-i mai știe numele. Simbolurile disponibile (o inimă frântă, un lanț rupt) exprimă direct natura ruperii. Interpretarea AI e antrenată să recunoască exact acest tipar: o figură absentă din chestionar dar simțită ca prezență, o distanță neobișnuit de mare sau de mică între generații, un „gol” pe tablă pe care utilizatorul îl umple instinctiv cu un alt simbol.",
            "Scopul nu e să retrăiești durerea, ci s-o așezi la locul ei: „ai existat, ai contat, ai un loc” — recunoașterea asta, chiar simbolică, are efect real asupra celor care poartă, fără să știe, ecoul pierderii altcuiva.",
          ],
        },
        {
          heading: "O notă importantă",
          body: [
            "Acest subiect poate atinge dureri reale și recente. O constelație digitală e un instrument de reflecție și de a pune în cuvinte ce simțeai difuz — nu un substitut pentru procesarea unui doliu activ. Dacă pierderea e recentă sau dureroasă, recomandăm cu tărie și sprijinul unui terapeut sau al unui facilitator de constelații familiale cu experiență în doliu.",
          ],
        },
      ]}
      faq={[
        {
          question: "Pot include în constelație o persoană despre care știu foarte puțin?",
          answer:
            "Da — un frate pierdut, un bunic mort tânăr, un membru exclus din poveste. Nu ai nevoie de detalii biografice, doar de intenția de a-i da un loc pe tablă.",
        },
        {
          question: "E normal să simt tristețe fără o cauză clară?",
          answer:
            "Da, e un tipar recunoscut în constelații — se numește identificare sistemică. O constelație te poate ajuta să vezi dacă tristețea e, de fapt, moștenită.",
        },
        {
          question: "Ce fac dacă interpretarea deschide o durere puternică?",
          answer:
            "Oprește-te oricând — nu trebuie parcurs totul dintr-o ședință. Pentru pierderi recente sau intense, discuția cu un specialist e recomandată alături de acest instrument, nu în locul lui.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "pierderi-doliu-familie").map((p) => ({ href: `/${p.slug}`, label: p.label })),
      ]}
    />
  );
}
