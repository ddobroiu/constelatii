import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";

export const metadata: Metadata = pageMetadata({
  path: "/meditatie",
  title: "Meditație și practică interioară",
  description:
    "O constelație familială e, în esență, o formă de meditație activă — te pregătești, te retragi din zgomotul de zi cu zi și observi ce simți, nu ce gândești. Cum să te pregătești pentru o practică reală.",
});

export default function MeditatiePage() {
  return (
    <ArticlePage
      eyebrow="Meditație și practică interioară"
      title="O constelație e o formă de meditație — doar cu o hartă în față"
      intro={[
        "Meditația clasică te învață să observi ce se întâmplă înăuntru, fără să intervii imediat cu mintea. O constelație familială face ceva foarte asemănător, dar cu un suport concret: în loc să observi doar gânduri care trec, observi o configurație — poziții, distanțe, direcții — și lași corpul, nu doar mintea, să-ți spună ce simte real despre ea.",
      ]}
      sections={[
        {
          heading: "De ce contează pregătirea",
          body: [
            "Diferența dintre o constelație superficială și una care chiar arată ceva stă în starea din care pornești. Dacă ajungi direct din agitația zilei — notificări, liste de sarcini, zgomot — vei plasa figurile din cap, „logic”, nu din ce simți real. De aceea recomandăm câteva minute de retragere înainte: telefonul pe silențios, un loc liniștit, respirație lentă, atenție îndreptată spre corp, nu spre gânduri despre situație.",
            "Nu trebuie experiență anterioară de meditație. E suficient să încetinești suficient cât să simți diferența dintre „cred că” și „simt că” atunci când te gândești la persoana sau situația pe care vrei s-o explorezi.",
          ],
        },
        {
          heading: "Ce înseamnă „practică” aici",
          body: [
            "La fel ca meditația, constelațiile câștigă din repetiție — nu neapărat multe constelații diferite, ci disponibilitatea de a reveni cu sinceritate la ce apare, chiar dacă e inconfortabil. O singură ședință poate aduce claritate; revenirea periodică, cu teme noi sau cu aceeași temă privită din alt unghi, adâncește ce ai văzut deja.",
            "Practic, pe platformă asta înseamnă: începi cu o retragere scurtă (avem un ecran dedicat exact pentru asta, cu cronometru și muzică ambientală opțională), construiești constelația din ce simți în acel moment, nu din ce „ar trebui” să simți, și lași interpretarea să numească ce ai plasat deja intuitiv.",
          ],
        },
      ]}
      faq={[
        {
          question: "Am nevoie de experiență în meditație ca să fac o constelație?",
          answer:
            "Nu. E util să știi să te oprești câteva minute din activitatea zilnică, atât — restul e ghidat pas cu pas prin chestionar și tablă.",
        },
        {
          question: "Cât durează o sesiune completă?",
          answer:
            "Retragerea recomandată e de aproximativ 10 minute, plus timpul de construire a constelației (de obicei 10-15 minute) și citirea interpretării — în total, sub o oră.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "meditatie").map((p) => ({ href: `/${p.slug}`, label: p.label })),
      ]}
    />
  );
}
