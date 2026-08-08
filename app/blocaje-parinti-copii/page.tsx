import type { Metadata } from "next";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";
import { featuredCounties } from "@/lib/seo/counties";

export const metadata: Metadata = {
  title: "Blocaje părinți-copii — ordinea iubirii | Constelații Familiale",
  description:
    "De ce copiii poartă, fără să știe, poveri care nu le aparțin — și cum arată o relație părinte-copil dezechilibrată. Constelații familiale explicate, cu interpretare AI.",
};

export default function BlocajeParintiCopiiPage() {
  return (
    <ArticlePage
      eyebrow="Blocaje părinți-copii"
      title="Copilul care a devenit părintele părintelui său"
      intro={[
        "Bert Hellinger a numit-o „ordinea iubirii”: părinții dau, copiii primesc — direcția asta nu se inversează fără cost. Când un copil ajunge, emoțional, să aibă grijă de un părinte (să-l liniștească, să-i țină companie, să-i repare căsnicia sau starea de spirit), ceva din creșterea lui se oprește acolo. Rămâne, ca adult, un fel de copil-adult obosit, cu dificultăți să primească, să se relaxeze sau să ceară ajutor fără vinovăție.",
      ]}
      sections={[
        {
          heading: "Ce înseamnă, concret, o „inversare de rol”",
          body: [
            "Nu e nevoie de un eveniment dramatic. E suficient un părinte copleșit — de divorț, de depresie, de sărăcie, de doliu — și un copil sensibil care simte gaura și încearcă instinctiv s-o umple. Devine confidentul mamei, mediatorul certurilor părinților, cel care „nu face probleme” ca să nu mai adauge greutate. Sistemic, copilul a urcat, pentru o vreme, deasupra locului lui în familie — și a rămas acolo mult după ce nevoia inițială a trecut.",
            "Efectele apar la maturitate: dificultate să ceri ajutor, sentiment cronic de responsabilitate pentru starea emoțională a celorlalți, epuizare fără cauză clară, sau — la polul opus — o relație distantă, aproape formală, cu propriul copil, pentru că modelul de „părinte” învățat a fost unul de supraviețuire, nu de prezență calmă.",
          ],
        },
        {
          heading: "Cum arată o constelație a relației părinte-copil",
          body: [
            "Pe tablă plasezi figurile relevante — tu, părintele (sau copilul tău), eventual un frate sau o soră — la distanța și înălțimea relațională pe care le simți, nu cum „ar trebui”. Simbolurile aleg direcția: cine poartă o povară vizibilă (un scut, un lanț), cine e orientat spre celălalt și cine e cu spatele. Interpretarea AI citește configurația prin principiile ordinii sistemice — cine pare să fi ocupat locul cuiva mai mare, unde direcția firească „părinte spre copil” pare inversată.",
            "Aceeași structură funcționează și invers: mulți părinți fac o constelație despre relația cu propriul copil, ca să vadă dacă repetă, fără să vrea, un tipar moștenit din propria copilărie — de exemplu, aceeași distanță emoțională pe care au primit-o ei.",
          ],
        },
        {
          heading: "Ce se schimbă când vezi tiparul",
          body: [
            "Simpla recunoaștere — „am fost, de fapt, părintele părintelui meu” — are efect. Nu rezolvă totul instant, dar dă permisiunea internă de a lăsa jos o povară care oricum nu era a ta de dus. Pentru dinamici vechi și dureroase (abuz, neglijare, doliu netratat), o constelație digitală e un prim pas util, dar recomandăm continuarea cu un terapeut sau un facilitator de constelații familiale cu experiență.",
          ],
        },
      ]}
      faq={[
        {
          question: "Constelația e utilă și dacă părintele meu a murit?",
          answer:
            "Da — de fapt, relațiile neîncheiate din cauza unui deces sunt un motiv frecvent pentru o constelație. Poți explora relația exact cum o simți acum, indiferent dacă persoana mai trăiește.",
        },
        {
          question: "Pot face o constelație despre relația cu copilul meu adult?",
          answer:
            "Da. Alegi rolul „copilul meu” din chestionar și explorezi dinamica actuală, indiferent de vârsta lui.",
        },
        {
          question: "Ce fac dacă descopăr o inversare de rol dureroasă?",
          answer:
            "Interpretarea numește tiparul, nu îl repară singură. Pentru poveri vechi, discuția cu un terapeut sau un facilitator de constelații e recomandată — găsești un punct de plecare clar în raportul primit.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "blocaje-parinti-copii").map((p) => ({ href: `/${p.slug}`, label: p.label })),
        ...featuredCounties().map((c) => ({
          href: `/constelatii-familiale/${c.slug}`,
          label: `Constelații în ${c.name}`,
        })),
      ]}
    />
  );
}
