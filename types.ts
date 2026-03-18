
export enum AppStep {
  WELCOME,
  DEMOGRAPHICS,
  LOADING_QUIZ,
  QUIZ,
  ANALYZING,
  RESULTS,
  LOOKUP,
  MATCHMAKING,
  INBOX,
  CHAT
}

export enum Dimension {
  WEALTH = 'Wealth & Consumption',
  FAMILY = 'Family & Boundaries',
  LIFESTYLE = 'Lifestyle & Pace',
  COMMUNICATION = 'Conflict & Comms',
  GROWTH = 'Growth & Beliefs'
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

/** Likert scale 1-5; enforced at the type level */
export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface QuizAnswer {
  questionId: number;
  value: LikertValue;
}

export interface MatchProfile {
  soulId: string;
  summary: string;
  mbtiType?: string;
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
  /** Fixed spelling: was compatabilityAdvice */
  compatibilityAdvice: string;
  history?: {
    questions: Question[];
    answers: QuizAnswer[];
  };
  timestamp?: number;
  /** Seed used for deterministic question selection — enables no-DB Soul ID lookup */
  seed?: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  soulId: string;
  status: 'pending' | 'completed' | 'failed';
  questions: Question[];
  answers: QuizAnswer[];
  analysisResult?: MatchProfile;
  createdAt: string;
}

export interface SocialProfile {
  id: string;
  soulTitle: string;
  summary: string;
  radarScores: number[];
  distance?: number;
  age?: number;
  gender?: string;
  idealPartner?: any;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  otherUser?: SocialProfile;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

/** Re-export Language from config — types.ts remains the single import target for callers */
export type { Language } from './config/languages';
