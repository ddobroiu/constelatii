import type { FullReport } from "@/lib/claude/schema";

/** Afișarea raportului complet — folosită atât imediat după deblocare, cât și la reluarea unei constelații salvate. */
export default function FullReportView({ report }: { report: FullReport }) {
  return (
    <>
      <div className="h-px bg-white/10" />
      <p className="text-foreground/80">{report.introducere}</p>
      {report.sectiuni.map((sectiune, i) => (
        <div key={i}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{sectiune.titlu}</h3>
          <p className="whitespace-pre-line text-foreground/80">{sectiune.continut}</p>
        </div>
      ))}
      <p className="text-foreground/80">{report.concluzie}</p>
    </>
  );
}
