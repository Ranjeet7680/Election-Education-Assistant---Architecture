// Core type definitions for the election education system

export type Country = 'india' | 'usa' | 'uk';

export type ElectionType = 
  | 'parliamentary' 
  | 'assembly' 
  | 'local' 
  | 'presidential' 
  | 'congressional';

export interface Location {
  country: Country;
  state?: string;
  district?: string;
  constituency?: string;
}

export interface User {
  id: string;
  location: Location;
  language: string;
  isFirstTimeVoter: boolean;
  age?: number;
  registrationStatus?: 'not_registered' | 'pending' | 'registered';
}

export interface ElectionPhase {
  id: string;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  status: 'upcoming' | 'active' | 'completed';
  userAction?: string;
  actionDeadline?: Date;
}

export interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  alternatives?: string[];
  exampleUrl?: string;
}

export interface VotingStep {
  id: string;
  order: number;
  title: string;
  description: string;
  tips?: string[];
  commonMistakes?: string[];
  videoUrl?: string;
}

export interface ElectionInfo {
  country: Country;
  state?: string;
  electionType: ElectionType;
  phases: ElectionPhase[];
  requiredDocuments: Document[];
  votingSteps: VotingStep[];
  registrationUrl?: string;
  voterListCheckUrl?: string;
  officialSourceUrl: string;
  helplineNumber?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  userId: string;
  completedSteps: string[];
  quizScore: number;
  badges: Badge[];
  lastUpdated: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export type ConversationIntent = 
  | 'learn_process'
  | 'register'
  | 'check_status'
  | 'find_booth'
  | 'required_documents'
  | 'timeline'
  | 'quiz'
  | 'general_question';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: ConversationIntent;
  metadata?: Record<string, any>;
}
