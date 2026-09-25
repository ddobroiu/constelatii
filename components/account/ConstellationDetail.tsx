"use client";

import { useState } from "react";
import UnlockPanel from "@/components/report/UnlockPanel";
import FullReportView from "@/components/report/FullReportView";
import type { FullReport } from "@/lib/claude/schema";

interface ConstellationDetailProps {
  id: string;
  teaserText: string | null;
  initialFullReport: FullReport | null;
}

export default function ConstellationDetail({ id, teaserText, initialFullReport }: ConstellationDetailProps) {
  const [fullReport, setFullReport] = useState<FullReport | null>(initialFullReport);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      {teaserText && <p className="text-lg italic text-foreground/90">{teaserText}</p>}

      {!fullReport && (
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-full bg-white/10" />
          <div className="mt-2">
            <UnlockPanel constellationId={id} onUnlocked={setFullReport} />
          </div>
        </div>
      )}

      {fullReport && <FullReportView report={fullReport} />}
    </div>
  );
}
