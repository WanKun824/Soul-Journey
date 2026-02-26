
export enum AppStep {
  WELCOME,
  DEMOGRAPHICS,
  LOADING_QUIZ,
  QUIZ,
  ANALYZING,
  RESULTS,
  LOOKUP
}

export enum Dimension {
  WEALTH = 'Wealth & Consumption',      // Spending habits, debt, financial security
  FAMILY = 'Family & Boundaries',       // Parents, children, in-laws, boundaries
  LIFESTYLE = 'Lifestyle & Pace',       // Weekends, cleanliness, work-life balance
  COMMUNICATION = 'Conflict & Comms',   // Argument style, emotional regulation
  GROWTH = 'Growth & Beliefs'           // Ambition, politics, religion, self-improvement
}

export type QuestionType = 'likert' | 'choice';

export interface Question {
  id: number;
  text: string;
  dimension: string; 
  questionType: QuestionType; 
  options?: string[]; 
  correctAnswerIndex?: number; 
  positiveLabel?: string; 
  negativeLabel?: string; 
}

export interface UserDemographics {
  age: string;
  gender: string;
  interestedIn: string;
}

export interface QuizAnswer {
  questionId: number;
  value: number; 
}

export interface MatchProfile {
  soulId: string; 
  summary: string;
  mbtiType?: string; // Kept for legacy compatibility or heuristic mapping
  scores: {
    dimension: string;
    score: number; 
    label: string; 
  }[];
  idealPartner: {
    description: string;
    traits: string[];
    dealBreakers: string[];
  };
  compatabilityAdvice: string;
  // History for review
  history?: {
    questions: Question[];
    answers: QuizAnswer[];
  };
  timestamp?: number;
}

export type Language = 'en' | 'zh' | 'ja';
