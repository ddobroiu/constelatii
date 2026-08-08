"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionnaireWizard from "@/components/questionnaire/QuestionnaireWizard";
import BirthDataStep from "@/components/questionnaire/BirthDataStep";
import { saveQuestionnaireAnswers, saveNatalChart } from "@/lib/session/clientStore";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import type { NatalChart } from "@/lib/astrology/types";

export default function ChestionarPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);

  function handleWizardComplete(values: QuestionnaireAnswers) {
    saveQuestionnaireAnswers(values);
    setAnswers(values);
  }

  function handleBirthDataComplete(chart: NatalChart | null) {
    if (chart) saveNatalChart(chart);
    router.push("/harta");
  }

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">
      <div className="relative z-10 flex w-full flex-col items-center">
        {!answers ? (
          <QuestionnaireWizard onComplete={handleWizardComplete} />
        ) : (
          <BirthDataStep onComplete={handleBirthDataComplete} />
        )}
      </div>
    </div>
  );
}
