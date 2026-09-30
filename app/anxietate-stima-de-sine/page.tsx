import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";

export const metadata: Metadata = pageMetadata({
  path: "/anxietate-stima-de-sine",
  title: "Anxietate și stimă de sine: originea sistemică",
  description:
    "Anxietatea și stima de sine scăzută pot avea multe cauze. Constelațiile familiale propun o perspectivă: uneori reflectă tipare din familie. Explorează-le printr-o constelație interpretată de AI, ca exercițiu de reflecție.",
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
            "Pentru unii oameni, a observa că o parte din neliniștea lor seamănă cu cea a unui părinte sau a unei familii trecute prin greutăți aduce claritate și un sentiment de ușurare. Nu e un rezultat garantat și nu e un tratament. Pentru anxietate persistentă sau care îți afectează viața de zi cu zi, adresează-te unui medic sau unui psihoterapeut; constelația digitală poate fi cel mult un exercițiu de reflecție alături de acest sprijin.",
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
