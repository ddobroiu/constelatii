import type { Metadata } from "next";
import ArticlePage from "@/components/seo/ArticlePage";
import { PILLARS } from "@/lib/seo/pillars";
import { featuredCounties } from "@/lib/seo/counties";

export const metadata: Metadata = {
  alternates: { canonical: "/compatibilitate-cuplu" },
  title: "Compatibilitate în cuplu — dincolo de zodie | Constelații Familiale",
  description:
    "De ce te atrag mereu aceleași tipuri de persoane și ce spune, de fapt, compatibilitatea astrologică. Sinastrie + constelații familiale, într-o interpretare AI personalizată.",
};

export default function CompatibilitateCuplulPage() {
  return (
    <ArticlePage
      eyebrow="Compatibilitate în cuplu"
      title="Compatibilitatea nu se citește doar din zodie"
      intro={[
        "„Suntem compatibili?” e întrebarea din spatele fiecărui test de zodii căutat la 2 dimineața. Astrologia chiar are un răspuns parțial — sinastria, adică suprapunerea a două hărți natale, arată unde există chimie ușoară și unde apar frecări reale. Dar chimia bună pe hârtie nu explică de ce ești atras constant de un anumit tip de persoană, sau de ce relații „compatibile” pe hârtie se blochează în același loc. Partea aia ține de tipare învățate în familie, nu de poziția planetelor.",
      ]}
      sections={[
        {
          heading: "Ce arată, real, sinastria astrologică",
          body: [
            "Sinastria compară planetele din harta ta cu planetele din harta celuilalt: unde se ating Soarele și Luna voastre, unde Venus al unuia atinge Marte al celuilalt, ce aspecte se formează între cele două seturi de poziții. Aspectele armonioase (trigon, sextil) arată zone de fluiditate — comunicare ușoară, atracție firească. Aspectele tensionate (careu, opoziție) nu înseamnă incompatibilitate, ci arată unde va fi nevoie de efort conștient — de multe ori exact acolo cresc relațiile cele mai transformatoare, nu cele mai confortabile.",
            "Limita sinastriei: îți spune unde e chimie și unde e fricțiune, dar nu îți spune de ce continui să alegi genul acesta de fricțiune, relație după relație. Aici intervine partea sistemică.",
          ],
        },
        {
          heading: "De ce te atrag mereu variante ale aceluiași om",
          body: [
            "Constelațiile familiale pornesc de la o observație simplă: alegem parteneri care ne permit să repetăm o dinamică familiară — nu pentru că am vrea suferință, ci pentru că e configurația relațională pe care sistemul nostru nervos o recunoaște drept „normală”. Cine a fost distant emoțional în familia ta de origine? Cine trebuia mereu „câștigat”? Cine avea nevoie de tine mai mult decât tu de el? Aceste roluri se recreează, adesea cu parteneri complet diferiți ca personalitate de suprafață, dar identici ca funcție relațională.",
            "O constelație digitală pune asta vizual: plasezi partenerul actual (sau un candidat) și figurile relevante din familie pe aceeași tablă, la distanța și orientarea pe care le simți real. Interpretarea AI citește configurația și îți arată dacă atracția actuală repetă un tipar, sau chiar dacă unul dintre voi ocupă, fără să știe, poziția emoțională a altcuiva din familia ta.",
          ],
        },
        {
          heading: "Compatibilitate reală vs. familiaritate confundată cu chimie",
          body: [
            "Multe cupluri confundă „ne simțim ca acasă” cu „suntem compatibili” — când, de fapt, „ca acasă” poate însemna doar „recunoscut”. O relație sănătoasă poate să înceapă chiar puțin inconfortabil, pentru că nu retrage un tipar vechi. Combinând sinastria (ce e ușor între voi astral) cu o constelație (ce tipar familial se activează prin relația asta), obții o imagine mai completă decât oricare dintre cele două singură.",
          ],
        },
      ]}
      faq={[
        {
          question: "Pot face o constelație despre o relație care încă nu a început?",
          answer:
            "Da — poți explora o atracție, o ezitare sau o persoană la care te gândești des, chiar dacă relația nu e formalizată încă. Tabla nu cere o relație „oficială”.",
        },
        {
          question: "Am nevoie de datele de naștere ale partenerului pentru sinastrie?",
          answer:
            "Pentru harta ta natală ai nevoie de propriile date de naștere. Interpretarea combină harta ta cu configurația de pe tablă — nu cerem date personale despre altcineva.",
        },
        {
          question: "Ce fac dacă descopăr că repet un tipar dureros?",
          answer:
            "Interpretarea îți arată mecanismul, nu un verdict definitiv. E un punct de plecare bun pentru reflecție — pentru tipare vechi sau dureroase, recomandăm și discuția cu un terapeut sau un facilitator de constelații.",
        },
      ]}
      relatedLinks={[
        ...PILLARS.filter((p) => p.slug !== "compatibilitate-cuplu").map((p) => ({ href: `/${p.slug}`, label: p.label })),
        ...featuredCounties().map((c) => ({
          href: `/constelatii-familiale/${c.slug}`,
          label: `Constelații în ${c.name}`,
        })),
      ]}
    />
  );
}
