import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";

export const metadata: Metadata = pageMetadata({
  path: "/terapie-autocunoastere",
  title: "Terapie și autocunoaștere",
  description:
    "Un instrument de auto-reflecție bazat pe metoda constelațiilor familiale (Bert Hellinger), gândit ca punct de plecare pentru terapie sau pentru discuția cu un terapeut, nu ca înlocuitor al ei. Explorează-ți tiparele printr-o constelație interactivă interpretată de AI.",
});

export default function TerapieAutocunoasterePage() {
  return (
    <ArticlePage
      eyebrow="Terapie și autocunoaștere"
      title="Un instrument de auto-reflecție, nu un înlocuitor de terapie"
      intro={[
        "Constelațiile familiale sunt o abordare sistemică dezvoltată de Bert Hellinger, practicată tradițional în grup, cu reprezentanți umani pentru fiecare membru al familiei. Ideea de la care pornește: unele tipare emoționale pe care le trăim ca adulți — neliniște, sentimentul de a nu aparține, dificultăți relaționale repetitive — pot fi legate și de dinamica familiei din care venim, nu doar de biografia noastră individuală. Constelația de aici e un exercițiu de autocunoaștere, nu o formă de psihoterapie și nu un tratament.",
      ]}
      sections={[
        {
          heading: "De ce o variantă digitală, solo",
          body: [
            "O ședință clasică de constelații familiale se face în grup, cu un facilitator și reprezentanți. Nu toată lumea are acces ușor la așa ceva — costă, necesită programare, uneori și curaj să te expui în fața unui grup. Varianta digitală păstrează principiile centrale ale metodei (poziție, distanță, orientare, simbolism) într-un format accesibil oricând, din orice județ din România, complet privat.",
            "Nu e o versiune „mai slabă” a metodei — e o unealtă diferită, potrivită pentru explorare individuală, reflecție înainte de o ședință reală, sau pur și simplu pentru cineva care vrea claritate asupra unui tipar specific fără să facă încă pasul către terapie.",
          ],
        },
        {
          heading: "Ce poți explora",
          body: [
            "Un chestionar ghidat te ajută să identifici tema centrală — relația cu un părinte, cu un partener, cu un frate sau o soră, sau dinamica familiei extinse. Alegi apoi figurile relevante, le poziționezi pe o tablă interactivă exact cum le simți (nu cum „ar trebui”), le atribui o culoare și un simbol, și poți plasa explicit un conector — un zid, o inimă, un lanț — între oricare două figuri, pentru a arăta natura reală a legăturii dintre ele.",
            "O interpretare bazată pe Claude, antrenată pe principiile constelațiilor familiale, analizează configurația completă: distanțele, orientările, simbolurile alese, cine lipsește de pe tablă — și, opțional, elemente din harta ta natală astrologică — și produce o interpretare narativă, empatică, specifică situației tale reale.",
          ],
        },
        {
          heading: "Limitele metodei, spuse clar",
          body: [
            "Acest instrument nu pune diagnostic psihologic, nu înlocuiește un terapeut și nu e potrivit ca răspuns unic la traume severe sau crize acute. E gândit ca punct de plecare pentru reflecție — o oglindă, nu un verdict. Dacă ce descoperi redeschide o durere veche sau grea, următorul pas sănătos e un spațiu terapeutic real, cu un om lângă tine.",
          ],
        },
      ]}
      faq={[
        {
          question: "Cât durează o constelație digitală?",
          answer: "De obicei 10-20 de minute pentru a construi tabla și a completa chestionarul, plus timpul de generare a interpretării.",
        },
        {
          question: "Am nevoie de experiență anterioară cu constelații familiale?",
          answer: "Nu — chestionarul și interfața te ghidează pas cu pas, fără cunoștințe prealabile.",
        },
        {
          question: "Poate înlocui terapia de familie?",
          answer:
            "Nu. E un instrument de auto-reflecție și un punct de plecare util, dar pentru situații complexe sau dureri vechi, recomandăm un terapeut sau un facilitator de constelații familiale.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "terapie-autocunoastere").map((p) => ({ href: `/${p.slug}`, label: p.label })),
      ]}
    />
  );
}
