"use client";

import { useRouter } from "next/navigation";
import Starfield from "@/components/Starfield";
import QuestionnaireWizard from "@/components/questionnaire/QuestionnaireWizard";
import { saveQuestionnaireAnswers } from "@/lib/session/clientStore";
import type { QuestionnaireAnswers } from "@/lib/questionnaire/schema";

export default function ChestionarPage() {
  const router = useRouter();

  function handleComplete(answers: QuestionnaireAnswers) {
    saveQuestionnaireAnswers(answers);
    router.push("/harta");
  }

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">
      <Starfield count={80} />
      <div className="relative z-10 flex w-full flex-col items-center">
        <QuestionnaireWizard onComplete={handleComplete} />
      </div>
    </div>
  );
}
