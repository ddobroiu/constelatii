import type { Metadata } from "next";
import { H2, A } from "@/components/legal/LegalPage";
import { ANPC_SAL_URL, ANPC_URL, OPERATOR, OPERATOR_ADDRESS_LINE, SITE_NAME } from "@/lib/legal";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: `Contact — ${SITE_NAME}`,
  description: `Date de contact și de identificare ale operatorului ${SITE_NAME}.`,
};

export default function ContactPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center px-6 py-16">
      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-4 text-foreground/80">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contact</h1>
        <p>
          Pentru întrebări, reclamații sau cereri privind datele personale, scrie-ne la{" "}
          <A href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</A>. Răspundem de obicei în 1–2 zile lucrătoare.
        </p>

        <H2>Date de identificare</H2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-xl border border-white/10 bg-white/5 p-5 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="text-foreground/50">Denumire</dt>
          <dd>{OPERATOR.name}</dd>
          <dt className="text-foreground/50">CUI</dt>
          <dd>
            {OPERATOR.cui} ({OPERATOR.vatStatus})
          </dd>
          <dt className="text-foreground/50">Nr. Reg. Com.</dt>
          <dd>{OPERATOR.regCom}</dd>
          <dt className="text-foreground/50">EUID</dt>
          <dd>{OPERATOR.euid}</dd>
          <dt className="text-foreground/50">Sediul social</dt>
          <dd>{OPERATOR_ADDRESS_LINE}</dd>
          <dt className="text-foreground/50">E-mail</dt>
          <dd>{OPERATOR.email}</dd>
        </dl>

        <H2>Protecția consumatorilor</H2>
        <p>
          Autoritatea Națională pentru Protecția Consumatorilor: <A href={ANPC_URL}>anpc.ro</A> ·{" "}
          <A href={ANPC_SAL_URL}>ANPC – SAL (Soluționarea alternativă a litigiilor)</A>.
        </p>
      </div>
    </div>
  );
}
