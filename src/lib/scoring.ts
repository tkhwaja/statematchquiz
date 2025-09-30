import { AnswerMap, StateScore } from "./types";
import questionsData from "@/data/questions.json";
import statesData from "@/data/states.json";

export function calculateScores(answers: AnswerMap): StateScore[] {
  // Initialize scores for all states
  const stateScores: Record<string, number> = {};
  statesData.forEach(state => {
    stateScores[state.state_code] = 0;
  });

  // Calculate total weight for each state based on answers
  questionsData.forEach(question => {
    const selectedChoiceId = answers[question.id];
    if (!selectedChoiceId) return;

    const selectedChoice = question.choices.find(c => c.id === selectedChoiceId);
    if (!selectedChoice) return;

    // Add weights from this choice to state scores
    Object.entries(selectedChoice.weights).forEach(([stateCode, weight]) => {
      stateScores[stateCode] = (stateScores[stateCode] || 0) + weight;
    });
  });

  // Convert to array and sort by score
  const rankedStates = Object.entries(stateScores)
    .map(([stateCode, score]) => {
      const stateData = statesData.find(s => s.state_code === stateCode);
      return {
        state: stateCode,
        city: stateData?.top_cities[0] || "",
        score
      };
    })
    .sort((a, b) => b.score - a.score);

  // Return top 5
  return rankedStates.slice(0, 5);
}

export function validateAnswers(answers: AnswerMap): boolean {
  // Check that all questions are answered
  const requiredQuestions = questionsData.map(q => q.id);
  return requiredQuestions.every(qId => answers[qId]);
}
