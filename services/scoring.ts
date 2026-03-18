import { Question, QuizAnswer, Language } from '../types';

/** Calculates normalized 0-100 scores per dimension from quiz answers */
export const calculateScores = (
  questions: Question[],
  answers: QuizAnswer[],
  language: Language
) => {
  const dimSum: Record<string, number> = {};
  const dimCount: Record<string, number> = {};

  questions.forEach(q => {
    const ans = answers.find(a => a.questionId === q.id);
    if (ans) {
      dimSum[q.dimension] = (dimSum[q.dimension] || 0) + ans.value;
      dimCount[q.dimension] = (dimCount[q.dimension] || 0) + 1;
    }
  });

  return Object.keys(dimSum).map(dim => {
    const normalized = Math.round((dimSum[dim] / (dimCount[dim] * 5)) * 100);
    let label = normalized > 60 ? 'High' : normalized < 40 ? 'Low' : 'Balanced';
    if (language === 'zh') label = normalized > 60 ? '高倾向' : normalized < 40 ? '低倾向' : '平衡';
    else if (language === 'ja') label = normalized > 60 ? '高い' : normalized < 40 ? '低い' : 'バランス';
    return { dimension: dim, score: normalized, label };
  });
};
