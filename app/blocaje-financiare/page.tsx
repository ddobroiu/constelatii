import type { Metadata } from "next";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";
import { featuredCounties } from "@/lib/seo/counties";

export const metadata: Metadata = {
  alternates: { canonical: "/blocaje-financiare" },
  title: "Blocaje financiare — rădăcini familiale ale relației cu banii | Constelații Familiale",
  description:
    "De ce muncești mult și banii tot nu rămân, de ce ceri mai puțin decât meriți sau de ce bogăția te sperie — tiparele financiare au adesea origine familială. Explorează-le printr-o constelație interactivă interpretată de AI.",
};

export default function BlocajeFinanciarePage() {
  return (
    <ArticlePage
      eyebrow="Blocaje financiare"
      title="Relația cu banii se moștenește ca orice altă relație"
      intro={[
        "Câștigi bine și tot nu simți siguranță. Ceri mai puțin decât meriți, de fiecare dată. Banii vin, apoi „trebuie” să plece la fel de repede. Sau, dimpotrivă, aduni mereu, dar niciodată nu simți destul. Constelațiile familiale privesc banii nu ca pe o chestiune izolată de matematică personală, ci ca pe încă un loc unde se joacă tiparele de familie.",
      ]}
      sections={[
        {
          heading: "Banii ca loialitate ascunsă",
          body: [
            "Un tipar frecvent, observat constant în practica constelațiilor: un copil care câștigă vizibil mai mult sau trăiește mai bine decât părinții simte, adesea inconștient, o formă de vinovăție — și găsește moduri să „egalizeze”, fie cheltuind excesiv, fie sabotând oportunități, fie rămânând într-un prag financiar care nu-i depășește niciodată originea. Nu e lene, nu e incompetență — e loialitate sistemică, invizibilă pentru cel care o trăiește.",
            "Alte tipare comune: cine a crescut cu lipsuri asociază banii cu frica și îi ține strâns, chiar și atunci când abundența ar fi posibilă. Cine a crescut într-o familie unde banii erau motiv de conflict evită subiectul complet, inclusiv negocierea propriului salariu. Cine a moștenit un rol de „salvator” financiar al familiei extinse continuă acest rol și la vârsta adultă, în alte relații.",
          ],
        },
        {
          heading: "Ce arată o constelație despre bani",
          body: [
            "Într-o constelație digitală axată pe bani, plasezi pe tablă figurile relevante — poate un părinte cu care asociezi un anumit tipar financiar, poate un bunic a cărui poveste cu banii încă circulă în familie ca legendă. Alegi simboluri și, dacă e cazul, un conector explicit între tine și acea figură — un lanț (obligație), o ancoră (greutate resimțită), sau o barieră (refuz de a discuta subiectul deschis).",
            "Interpretarea AI analizează configurația în lumina acestor principii sistemice: cine ești tu în raport cu figura respectivă, ce distanță și orientare ai ales, ce spune simbolul despre relația ta reală cu resursele și cu cei care ți le-au transmis, direct sau indirect.",
          ],
        },
        {
          heading: "De ce nu e doar despre mindset",
          body: [
            "Cărțile despre „mentalitatea de abundență” pot ajuta la nivel conștient, dar un tipar cu rădăcină sistemică rezistă adesea afirmațiilor pozitive, pentru că nu e un blocaj de gândire — e o loialitate față de cineva drag. O constelație nu îți schimbă contul bancar peste noapte, dar îți poate arăta exact ce anume repeți și față de cine, ceea ce e primul pas real către o relație diferită cu banii.",
          ],
        },
      ]}
      faq={[
        {
          question: "Constelația financiară are legătură cu astrologia?",
          answer:
            "Dacă adaugi și data nașterii, interpretarea poate integra organic elemente din harta natală relevante pentru relația cu resursele — ca strat suplimentar, nu ca predicție.",
        },
        {
          question: "Funcționează dacă nu știu exact de unde vine tiparul?",
          answer:
            "Da — de multe ori tocmai construirea tablei (cine e acolo, cât de aproape, cum e orientat) scoate la iveală conexiunea pe care nu o vedeai clar dinainte.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "blocaje-financiare").map((p) => ({ href: `/${p.slug}`, label: p.label })),
        ...featuredCounties().map((c) => ({
          href: `/constelatii-familiale/${c.slug}`,
          label: `Constelații în ${c.name}`,
        })),
      ]}
    />
  );
}
