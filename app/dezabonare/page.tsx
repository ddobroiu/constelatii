import type { Metadata } from "next";
import Link from "next/link";

import { OPERATOR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Dezabonare",
  robots: { index: false, follow: false },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Pagina din linkul „Dezabonează-te” din e-mailuri. Nu dezabonează la simpla
 * deschidere (scanerele de linkuri deschid tot): cere un click pe buton — un
 * formular obișnuit, fără JavaScript, către /api/dezabonare.
 */
export default async function DezabonarePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const id = typeof params.id === "string" && UUID.test(params.id) ? params.id : null;
  const done = params.gata === "1";
  const failed = params.eroare === "1";

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div className="relative z-10 w-full max-w-sm text-center">
        {done ? (
          <>
            <h1 className="mb-3 text-2xl font-semibold">Gata, te-ai dezabonat.</h1>
            <p className="text-sm text-foreground/60">
              Nu mai primești e-mailuri cu noutăți și sfaturi. Contul tău, dacă ai unul, rămâne neatins; vei
              primi doar mesajele strict necesare, precum confirmarea unei plăți.
            </p>
          </>
        ) : failed || !id ? (
          <>
            <h1 className="mb-3 text-2xl font-semibold">Linkul nu mai merge.</h1>
            <p className="text-sm text-foreground/60">
              Folosește linkul de dezabonare dintr-un e-mail primit de la noi, sau scrie-ne la{" "}
              <a href={`mailto:${OPERATOR.email}`} className="text-accent hover:underline">
                {OPERATOR.email}
              </a>{" "}
              și te scoatem noi din listă.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-3 text-2xl font-semibold">Te dezabonezi?</h1>
            <p className="text-sm text-foreground/60">
              Nu vei mai primi e-mailuri cu noutăți și sfaturi de la Constelații Familiale. Contul tău, dacă ai
              unul, rămâne neatins.
            </p>
            <form method="post" action="/api/dezabonare" className="mt-8">
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="from" value="page" />
              <button
                type="submit"
                className="w-full rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft"
              >
                Da, dezabonează-mă
              </button>
            </form>
            <p className="mt-5 text-sm text-foreground/50">
              <Link href="/" className="hover:underline">
                M-am răzgândit
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
