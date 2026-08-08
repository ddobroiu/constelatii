import type { Metadata } from "next";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";
import { featuredCounties } from "@/lib/seo/counties";

export const metadata: Metadata = {
  title: "De ce nu atrag bani — blocajul de a primi | Constelații Familiale",
  description:
    "Muncești mult, faci „tot ce trebuie” și tot nu vine — de ce? De multe ori nu e o problemă de efort, ci un blocaj sistemic pe partea de a primi. Descoperă-l printr-o constelație interpretată de AI.",
};

export default function DeCeNuAtragBaniPage() {
  return (
    <ArticlePage
      eyebrow="De ce nu atrag bani"
      title="Nu e că nu muncești destul — e că ceva din tine nu lasă banii să intre"
      intro={[
        "Ai citit despre mentalitatea de abundență, ai încercat afirmații, poate ai schimbat joburi sau ți-ai luat curaj să ceri mai mult — și tot nu se schimbă nimic cu adevărat. Oportunitățile trec pe lângă tine, sau vin și apoi se retrag la fel de repede. Când efortul conștient nu produce rezultatul așteptat, de obicei nu e o problemă de strategie — e un blocaj mai vechi, pe partea de a primi, nu de a munci.",
      ]}
      sections={[
        {
          heading: "„A atrage” bani înseamnă, de fapt, a-ți permite să primești",
          body: [
            "Constelațiile familiale disting clar între a munci pentru bani (efort, competență, timp) și a-ți permite să-i primești (o capacitate interioară, adesea blocată de loialități invizibile). Poți fi extrem de capabil și totuși să respingi, sistematic și inconștient, exact resursa pe care o ceri conștient — pentru că undeva, primirea a fost asociată cu un cost: vinovăție față de un părinte care n-a avut, teamă de a deveni „prea diferit” de familie, sau o convingere veche că a avea mult înseamnă a lua de la altcineva.",
            "Acest tipar explică de ce „mentalitatea de abundență” citită dintr-o carte nu rezolvă mare lucru — nu e o problemă de gândire pozitivă, e o problemă de permisiune sistemică, moștenită.",
          ],
        },
        {
          heading: "Semne că blocajul e de primire, nu de efort",
          body: [
            "Câștigi bine, dar banii „dispar” repede, fără o explicație clară. Refuzi sau minimizezi ofertele bune înainte să le analizezi cu adevărat. Te simți vinovat sau expus atunci când lucrurile încep, în sfârșit, să meargă bine. Compari constant ce ai cu ce au părinții tăi la vârsta ta — și simți nevoia, nespusă, să nu-i depășești.",
          ],
        },
        {
          heading: "Ce arată o constelație despre blocajul de a primi",
          body: [
            "Pe tablă, plasezi figurile relevante pentru relația ta cu banii — de obicei un părinte sau un bunic asociat cu un tipar financiar puternic — și alegi un simbol care descrie sincer relația: un lacăt (ceva ce ții închis), o barieră (refuz), un lanț (obligație veche). Interpretarea AI citește configurația prin principiile sistemice ale echilibrului dintre a da și a primi — și poate arăta exact față de cine simți că „nu ai voie” să ai mai mult.",
          ],
        },
      ]}
      faq={[
        {
          question: "Diferă de pagina „Blocaje financiare”?",
          answer:
            "Se leagă, dar unghiul e diferit: „Blocaje financiare” acoperă relația generală cu banii (frică, cheltuială, conflict); această pagină se concentrează strict pe blocajul de a primi — de ce oportunitățile bune par să nu „prindă”.",
        },
        {
          question: "Cât durează până se vede o schimbare?",
          answer:
            "O constelație nu schimbă contul bancar peste noapte — dar numirea clară a tiparului („nu-mi permit să primesc mai mult decât X”) e adesea primul pas real către o relație diferită cu banii.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "de-ce-nu-atrag-bani").map((p) => ({ href: `/${p.slug}`, label: p.label })),
        ...featuredCounties().map((c) => ({
          href: `/constelatii-familiale/${c.slug}`,
          label: `Constelații în ${c.name}`,
        })),
      ]}
    />
  );
}
