import type { Metadata } from "next";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";
import { featuredCounties } from "@/lib/seo/counties";

export const metadata: Metadata = {
  alternates: { canonical: "/de-ce-nu-atrag-relatii" },
  title: "De ce nu atrag relații — când pur și simplu nu se întâmplă | Constelații Familiale",
  description:
    "Nu vorbim despre relații care se repetă greșit, ci despre relații care nu apar deloc. Descoperă originea sistemică a acestui gol printr-o constelație interpretată de AI.",
};

export default function DeCeNuAtragRelatiiPage() {
  return (
    <ArticlePage
      eyebrow="De ce nu atrag relații"
      title="Nu e că alegi greșit — e că, undeva, relația nici nu ajunge să înceapă"
      intro={[
        "E o senzație diferită de „mă despart mereu din același motiv”. E mai degrabă o absență: treci prin perioade lungi fără nimeni, oamenii par să nu se apropie cu adevărat, sau apropierea se oprește brusc, înainte să înceapă orice. Dacă relațiile pur și simplu nu se întâmplă, indiferent cât de mult îți dorești, cauza e rareori lipsa de opțiuni — de obicei e ceva ce ține locul liber ocupat, fără să știi.",
      ]}
      sections={[
        {
          heading: "Un loc „ocupat” ține pe oricine altcineva la distanță",
          body: [
            "În constelații, un loc emoțional rămas neînchis — o iubire din trecut la care nu ți-ai luat cu adevărat rămas bun, o loialitate față de un părinte singur pe care simți nevoia să-l „ții companie” la nivel inconștient, sau chiar identificarea cu un membru al familiei care a rămas singur o viață întreagă — poate ocupa exact locul unde ar trebui să încapă un partener nou. Nu e o alegere conștientă; e un tipar care funcționează în fundal, protejând un echilibru vechi cu prețul unei goliciuni actuale.",
            "Alteori, cauza e o loialitate directă: dacă un părinte a rămas singur sau a suferit mult într-o relație, un copil poate simți, fără cuvinte, că a fi fericit în cuplu ar fi un fel de trădare. Rezultatul: sabotaj discret al oricărei apropieri, chiar și atunci când persoana își dorește sincer o relație.",
          ],
        },
        {
          heading: "Cum arată o constelație despre absența relației",
          body: [
            "Aici figura centrală ești tu, în raport cu „locul” pe care l-ar ocupa un partener — plus orice figură din trecut sau din familie care pare, intuitiv, legată de acest gol. Distanța, orientarea și simbolul ales pentru acea figură (o ancoră, un lanț, o inimă frântă) dau interpretării AI material concret pentru a arăta cine sau ce ține, de fapt, locul ocupat.",
          ],
        },
        {
          heading: "Ce se schimbă când vezi tiparul",
          body: [
            "A vedea clar ce anume ocupă locul — o persoană, o loialitate, o poveste de familie — nu garantează instant o relație nouă, dar elimină confuzia epuizantă a „nu știu de ce nu se întâmplă nimic”. E un prim pas real, iar pentru situații vechi sau dureroase, completează bine munca alături de un terapeut sau un facilitator de constelații.",
          ],
        },
      ]}
      faq={[
        {
          question: "Diferă de pagina „Blocaje în relații”?",
          answer:
            "Da — „Blocaje în relații” explică tipare care se repetă în relații pe care le ai. Această pagină e despre absența relațiilor înseși, nu despre cum arată ele odată începute.",
        },
        {
          question: "Trebuie să știu despre cine e vorba, dinainte?",
          answer:
            "Nu. Deseori tocmai construirea tablei — plasarea figurilor relevante și observarea distanțelor — scoate la iveală conexiunea pe care nu o vedeai clar înainte.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "de-ce-nu-atrag-relatii").map((p) => ({ href: `/${p.slug}`, label: p.label })),
        ...featuredCounties().map((c) => ({
          href: `/constelatii-familiale/${c.slug}`,
          label: `Constelații în ${c.name}`,
        })),
      ]}
    />
  );
}
