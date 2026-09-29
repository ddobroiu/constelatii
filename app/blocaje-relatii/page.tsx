import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";

export const metadata: Metadata = pageMetadata({
  path: "/blocaje-relatii",
  title: "Blocaje în relații: de unde vin",
  description:
    "Tipare care se repetă în relații — cu partenerul, cu părinții, cu prietenii — explicate prin metoda constelațiilor familiale. Descoperă originea blocajului tău printr-o constelație interactivă, interpretată de AI.",
});

export default function BlocajeRelatiiPage() {
  return (
    <ArticlePage
      eyebrow="Blocaje în relații"
      title="De ce se repetă aceleași tipare în relațiile tale?"
      intro={[
        "Te desparți din motive diferite, dar cu același gust în gură. Alegi parteneri diferiți, dar dinamica pare identică. Sau, pur și simplu, apropierea de cineva pornește bine și, la un moment previzibil, se blochează. Constelațiile familiale pornesc de la o idee simplă: tiparele relaționale se învață devreme, în familia de origine, și se repetă apoi automat, oriunde există altă persoană aproape.",
      ]}
      sections={[
        {
          heading: "Un blocaj relațional rareori începe cu relația actuală",
          body: [
            "Frica de apropiere, nevoia de a controla, atracția repetată către parteneri indisponibili emoțional, dificultatea de a cere ajutor sau de a-l primi — toate acestea au, de obicei, o poziție de origine: un rol pe care l-ai învățat în familie, adesea fără să-l alegi conștient. Copilul care a mediat conflictele părinților devine adultul care simte responsabil pentru starea emoțională a partenerului. Copilul care a fost lăsat des singur devine adultul care se retrage la primul semn de conflict, ca să nu mai retrăiască abandonul.",
            "Metoda constelațiilor familiale, dezvoltată de Bert Hellinger, pornește de la observația că aceste tipare nu sunt întâmplătoare — au o logică sistemică. Poziția pe care ai ocupat-o în familie, cine a fost aproape de tine și cine a fost exclus sau distant, cine te-a orientat spre cine — toate lasă o amprentă în felul în care te apropii (sau te ferești) de ceilalți ca adult.",
          ],
        },
        {
          heading: "Cum arată o constelație digitală a unei relații",
          body: [
            "În loc de reprezentanți umani (ca în terapia de grup clasică), construiești o tablă interactivă: alegi cine e relevant pentru situația ta — partenerul, un părinte, poate fostul partener — și îi plasezi la distanța și orientarea pe care le simți real, nu cum ar trebui să fie „corect”. Alegi apoi un simbol pentru fiecare persoană (o inimă, un scut, un lacăt) și, dacă simți nevoia, un conector explicit între două figuri — un zid, un lanț, o inimă care le unește.",
            "Configurația rezultată e citită de o interpretare AI antrenată pe principiile constelațiilor familiale: ce spune distanța, ce spune orientarea, ce spune faptul că ai ales același simbol pentru două persoane diferite, cine lipsește de pe tablă deși ar trebui să fie acolo. Rezultatul nu e un verdict, ci o oglindă — o formulare clară a unui tipar pe care poate îl simțeai difuz, dar nu-l puteai numi.",
          ],
        },
        {
          heading: "Ce poți face cu ce afli",
          body: [
            "O interpretare bună de constelații nu îți spune ce să faci — îți arată mecanismul. Din acel punct, unele lucruri se limpezesc singure: de ce reacționezi disproporționat la o anumită formă de distanță, de ce apropierea prea rapidă te sperie, de ce alegi mereu variante ale aceleiași dinamici. Pentru blocaje vechi sau dureroase, o constelație digitală e un punct de plecare bun, dar nu înlocuiește un terapeut sau un facilitator de constelații cu care să lucrezi direct — mai ales dacă ce descoperi redeschide ceva greu.",
          ],
        },
      ]}
      faq={[
        {
          question: "Constelația se face doar despre relația de cuplu?",
          answer:
            "Nu — poți explora orice relație relevantă: cu un părinte, cu un frate sau o soră, cu un prieten apropiat, chiar cu tine însuți din trecut. Chestionarul de la început te ajută să alegi.",
        },
        {
          question: "Trebuie să știu deja ce e „greșit” în relație?",
          answer:
            "Nu. De multe ori, tocmai lipsa clarității e motivul pentru care faci o constelație — vezi configurația construită de tine și interpretarea o pune în cuvinte.",
        },
        {
          question: "E nevoie ca și cealaltă persoană să participe?",
          answer:
            "Nu. Constelația e despre percepția și tiparul tău — o poți face complet singur, oricând, online.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "blocaje-relatii").map((p) => ({ href: `/${p.slug}`, label: p.label })),
      ]}
    />
  );
}
