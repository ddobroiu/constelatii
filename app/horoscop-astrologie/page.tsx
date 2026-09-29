import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";

export const metadata: Metadata = pageMetadata({
  path: "/horoscop-astrologie",
  title: "Horoscop și astrologie: harta natală",
  description:
    "Nu un horoscop generic de tabloid, ci o hartă natală calculată real (planete, case, aspecte) integrată organic în interpretarea constelației tale familiale. Auto-cunoaștere, nu predicție.",
});

export default function HoroscopAstrologiePage() {
  return (
    <ArticlePage
      eyebrow="Horoscop și astrologie"
      title="O hartă natală reală, nu un horoscop de tabloid"
      intro={[
        "Majoritatea „horoscoapelor” pe care le întâlnești online sunt scrise pentru o singură zodie — a Soarelui — și se potrivesc, vag, la o doisprezecime din populație deodată. O hartă natală reală e altceva: un calcul astronomic precis, bazat pe data, ora și locul exact al nașterii tale, care arată poziția fiecărei planete în momentul acela unic.",
      ]}
      sections={[
        {
          heading: "Ce calculăm, de fapt",
          body: [
            "Din data, ora și locul nașterii, calculăm poziția reală a Soarelui, Lunii și a celorlalte planete în zodiac, plus casele astrologice (zonele de viață pe care le activează fiecare planetă) și aspectele majore dintre planete — conjuncții, opoziții, careuri, trigoane, sextile. E un calcul astronomic, nu o presupunere generică: aceleași formule pe care le folosesc astrologii profesioniști pentru o hartă natală completă.",
            "Fără ora exactă a nașterii, tot putem calcula pozițiile planetare și zodiile, dar casele și Ascendentul (care depind de ora precisă) rămân indisponibile — de aceea, dacă o știi, merită introdusă.",
          ],
        },
        {
          heading: "De ce o integrăm în constelație, nu separat",
          body: [
            "Diferența față de un horoscop obișnuit: harta ta natală nu stă izolată, ca text generic. E țesută în interpretarea constelației tale familiale — dacă un aspect astrologic tensionat rezonează cu un tipar pe care l-ai plasat deja pe tablă (o figură cu care ai o barieră, o relație unde te simți mereu „prea mult” sau „prea puțin”), interpretarea AI îl menționează organic, ca un strat suplimentar de auto-cunoaștere, nu ca predicție sau literă de lege.",
            "Dacă alegi să nu introduci deloc data nașterii, interpretarea funcționează perfect și fără acest strat — harta natală e opțională, nu obligatorie.",
          ],
        },
        {
          heading: "Ce nu facem",
          body: [
            "Nu îți spunem ce se va întâmpla mâine, nu facem predicții financiare sau despre sănătate, și nu tratăm astrologia ca literă de lege. O folosim exact cum o folosesc mulți practicieni serioși: ca un limbaj simbolic suplimentar pentru auto-reflecție, alături de configurația reală pe care ai construit-o cu mâna ta pe tablă.",
          ],
        },
      ]}
      faq={[
        {
          question: "E nevoie de ora exactă a nașterii?",
          answer:
            "Nu e obligatorie, dar fără ea nu putem calcula Ascendentul și casele astrologice — doar pozițiile planetare și zodiile rămân disponibile.",
        },
        {
          question: "Ce sistem de case folosiți?",
          answer:
            "Whole Sign (case întregi) — un sistem astrologic recunoscut, cu calcul exact, fără aproximări.",
        },
        {
          question: "Astrologia înlocuiește interpretarea constelației?",
          answer:
            "Nu — e un strat suplimentar, opțional. Interpretarea principală vine din configurația pe care o construiești pe tablă (poziții, orientări, simboluri).",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "horoscop-astrologie").map((p) => ({ href: `/${p.slug}`, label: p.label })),
      ]}
    />
  );
}
