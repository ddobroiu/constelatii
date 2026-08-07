import type { QuestionnaireAnswers } from "../questionnaire/schema";

/**
 * Temporary bridge between the questionnaire and the board while there is no
 * backend session yet (Faza 3). Browser-only, cleared when the tab closes.
 */
const QUESTIONNAIRE_KEY = "constelatii:questionnaire";

export function saveQuestionnaireAnswers(answers: QuestionnaireAnswers) {
  sessionStorage.setItem(QUESTIONNAIRE_KEY, JSON.stringify(answers));
}

export function loadQuestionnaireAnswers(): QuestionnaireAnswers | null {
  const raw = sessionStorage.getItem(QUESTIONNAIRE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuestionnaireAnswers;
  } catch {
    return null;
  }
}
