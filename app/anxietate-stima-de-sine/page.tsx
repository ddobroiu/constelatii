import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";

export const metadata: Metadata = pageMetadata({
  path: "/anxietate-stima-de-sine",
  title: "Anxietate și stimă de sine: originea sistemică",
  description:
    "Anxietatea cronică și stima de sine scăzută nu apar mereu din nimic — uneori sunt un rol moștenit din familie. Descoperă originea printr-o constelație interpretată de AI.",
});

export default function AnxietateStimaDeSinePage() {
  return (
    <ArticlePage
      eyebrow="Anxietate și stimă de sine"
      title="Anxietatea care nu are, aparent, niciun motiv"
      intro={[
        "Ai o viață relativ stabilă, dar cari o neliniște de fond care nu se leagă de nimic anume. Sau ești extrem de eficient în tot ce faci, dar simțul valorii proprii rămâne mereu condiționat de următoarea realizare. Constelațiile familiale privesc astfel de stări nu doar ca traumă personală, ci și ca semnal al locului tău în sistemul de familie — uneori porți, fără să știi, o tensiune care nu a pornit de la tine.",
      ]}
      sections={[
        {
          heading: "Anxietatea ca „loialitate invizibilă”",
          body: [
            "În constelații, copiii sunt profund loiali sistemului din care fac parte — mult mai loiali decât conștientizează. Un copil crescut de un părinte anxios preia adesea nivelul de vigilență al părintelui ca stare de bază, nu ca reacție la un pericol real. Un copil născut într-o perioadă de criză a familiei (financiară, un doliu, o boală) poate purta, ca adult, o alertă constantă fără o cauză prezentă — corpul lui a învățat devreme că lumea nu e sigură.",
            "La fel, stima de sine condiționată — „valorez doar dacă performez” — are frecvent o origine relațională: atenția sau afecțiunea unui părinte a fost legată de realizări, nu de prezența simplă a copilului. Adultul rezultat muncește compulsiv pentru o siguranță emoțională pe care, de fapt, n-o poate obține din performanță.",
          ],
        },
        {
          heading: "Ce arată o constelație a stării interioare",
          body: [
            "Spre deosebire de o constelație despre o relație anume, aici figura centrală ești adesea doar tu, poziționat față de „starea” sau „tema” pe care o explorezi, plus figurile familiale relevante — părinți, un frate, uneori un bunic ale cărui poveri par să fi trecut mai departe. Distanța, orientarea și simbolurile alese (o mască pentru fațada calmă, un scut pentru vigilență, o ancoră pentru nevoia de stabilitate) dau interpretării AI material concret pentru a lega starea ta actuală de o poziție sau un rol moștenit.",
            "Nu orice anxietate are origine sistemică — unele au cauze medicale sau psihologice care merită evaluate direct. Dar pentru anxietatea „fără motiv aparent” sau stima de sine cronic condiționată, o constelație oferă adesea prima explicație care „se potrivește” cu adevărat.",
          ],
        },
        {
          heading: "De la înțelegere la reglare",
          body: [
            "A vedea că neliniștea ta a fost, la origine, a altcuiva — a unui părinte, a unui sistem întreg sub presiune — are un efect de eliberare reală: nu mai trebuie dusă mai departe cu aceeași intensitate. Pentru anxietate persistentă sau afectare semnificativă a vieții de zi cu zi, o constelație digitală completează, nu înlocuiește, sprijinul unui psihoterapeut.",
          ],
        },
      ]}
      faq={[
        {
          question: "Constelația înlocuiește terapia pentru anxietate?",
          answer:
            "Nu. E un instrument de reflecție care poate arăta o origine posibilă a tiparului — pentru anxietate persistentă sau intensă, recomandăm și sprijinul unui specialist.",
        },
        {
          question: "Ce fac dacă nu știu exact de unde vine anxietatea mea?",
          answer:
            "Nu trebuie să știi dinainte. Chestionarul te ghidează să alegi figurile relevante chiar dacă legătura nu-ți e încă limpede — interpretarea te ajută s-o vezi.",
        },
        {
          question: "Are legătură cu harta natală astrologică?",
          answer:
            "Dacă adaugi data, ora și locul nașterii, interpretarea integrează și plasamentele astrologice relevante — de exemplu, poziții care arată sensibilitate sau nevoie de siguranță — alături de configurația de pe tablă.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "anxietate-stima-de-sine").map((p) => ({ href: `/${p.slug}`, label: p.label })),
      ]}
    />
  );
}
