"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionnaireWizard from "@/components/questionnaire/QuestionnaireWizard";
import BirthDataStep from "@/components/questionnaire/BirthDataStep";
import PreparationScreen from "@/components/questionnaire/PreparationScreen";
import { saveQuestionnaireAnswers, saveNatalChart } from "@/lib/session/clientStore";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";
import type { NatalChart } from "@/lib/astrology/types";

type Stage = "wizard" | "birthData" | "prepare";

export default function ChestionarPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("wizard");

  function handleWizardComplete(values: QuestionnaireAnswers) {
    saveQuestionnaireAnswers(values);
    setStage("birthData");
  }

  function handleBirthDataComplete(chart: NatalChart | null) {
    if (chart) saveNatalChart(chart);
    setStage("prepare");
  }

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">
      <div className="relative z-10 flex w-full flex-col items-center">
        {stage === "wizard" && <QuestionnaireWizard onComplete={handleWizardComplete} />}
        {stage === "birthData" && <BirthDataStep onComplete={handleBirthDataComplete} />}
        {stage === "prepare" && <PreparationScreen onContinue={() => router.push("/harta")} />}
      </div>
    </div>
  );
}
