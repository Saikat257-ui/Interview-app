import type { Question, Answer } from '../types';

export const generateQuestions = (): Question[] => {
  const easyQuestions = [
    {
      id: 'easy-1',
      text: 'What is React and why would you use it for building user interfaces?',
      difficulty: 'easy' as const,
      timeLimit: 20,
    },
    {
      id: 'easy-2',
      text: 'Explain the difference between let, const, and var in JavaScript.',
      difficulty: 'easy' as const,
      timeLimit: 20,
    },
  ];

  const mediumQuestions = [
    {
      id: 'medium-1',
      text: 'How does React handle state management and what are the benefits of using Redux?',
      difficulty: 'medium' as const,
      timeLimit: 60,
    },
    {
      id: 'medium-2',
      text: 'Explain the concept of middleware in Node.js and provide an example use case.',
      difficulty: 'medium' as const,
      timeLimit: 60,
    },
  ];

  const hardQuestions = [
    {
      id: 'hard-1',
      text: 'How would you optimize the performance of a React application with a large number of components? Discuss specific techniques and tools.',
      difficulty: 'hard' as const,
      timeLimit: 120,
    },
    {
      id: 'hard-2',
      text: 'Explain the event loop in Node.js and how it handles asynchronous operations. How does this differ from traditional multi-threaded environments?',
      difficulty: 'hard' as const,
      timeLimit: 120,
    },
  ];

  return [
    ...easyQuestions,
    ...mediumQuestions,
    ...hardQuestions,
  ];
};

export const calculateScore = (answer: string, difficulty: string): number => {
  const length = answer.trim().length;

  // Base scoring on answer length and difficulty
  let baseScore: number;
  switch (difficulty) {
    case 'easy':
      baseScore = length > 50 ? 80 + Math.min((length - 50) * 0.4, 20) : Math.max(length * 1.6, 20);
      break;
    case 'medium':
      baseScore = length > 100 ? 75 + Math.min((length - 100) * 0.25, 25) : Math.max(length * 0.75, 30);
      break;
    case 'hard':
      baseScore = length > 150 ? 70 + Math.min((length - 150) * 0.2, 30) : Math.max(length * 0.47, 25);
      break;
    default:
      baseScore = 50;
  }

  return Math.min(Math.round(baseScore), 100);
};

export const generateSummary = (answers: Answer[]): string => {
  if (!answers.length) {
    return 'No answers provided during the interview.';
  }
  
  const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
  const averageScore = Math.round(totalScore / answers.length);

  const easyAnswers = answers.filter(a => a.difficulty === 'easy');
  const mediumAnswers = answers.filter(a => a.difficulty === 'medium');
  const hardAnswers = answers.filter(a => a.difficulty === 'hard');

  const easyAvg = easyAnswers.length > 0
    ? Math.round(easyAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / easyAnswers.length)
    : 0;
  const mediumAvg = mediumAnswers.length > 0
    ? Math.round(mediumAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / mediumAnswers.length)
    : 0;
  const hardAvg = hardAnswers.length > 0
    ? Math.round(hardAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / hardAnswers.length)
    : 0;

  let summary = `Candidate completed the interview with an overall score of ${averageScore}/100. `;

  if (easyAvg >= 80) summary += 'Strong fundamentals in basic concepts. ';
  else if (easyAvg >= 60) summary += 'Good understanding of basic concepts. ';
  else summary += 'Needs improvement in fundamental concepts. ';

  if (mediumAvg >= 75) summary += 'Solid grasp of intermediate topics. ';
  else if (mediumAvg >= 50) summary += 'Developing competency in intermediate areas. ';
  else summary += 'Requires more experience with intermediate concepts. ';

  if (hardAvg >= 70) summary += 'Excellent problem-solving and advanced technical skills.';
  else if (hardAvg >= 50) summary += 'Capable of handling complex technical challenges with guidance.';
  else summary += 'Would benefit from more exposure to advanced technical scenarios.';

  return summary;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};