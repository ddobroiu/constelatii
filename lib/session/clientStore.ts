import type { QuestionnaireAnswers } from "../questionnaire/schema";
import type { NatalChart } from "../astrology/types";

/**
 * Temporary bridge between the questionnaire and the board while there is no
 * backend session yet (Faza 3). Browser-only, cleared when the tab closes.
 */
const QUESTIONNAIRE_KEY = "constelatii:questionnaire";
const NATAL_CHART_KEY = "constelatii:natalChart";

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

export function saveNatalChart(chart: NatalChart) {
  sessionStorage.setItem(NATAL_CHART_KEY, JSON.stringify(chart));
}

export function loadNatalChart(): NatalChart | null {
  const raw = sessionStorage.getItem(NATAL_CHART_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NatalChart;
  } catch {
    return null;
  }
}
