// Type definitions for Firestore collections

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  isPro: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  isPro?: boolean;
}

export interface Question {
  id?: string;
  quizId: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface UserProfile {
  email: string;
  plan: 'free' | 'pro';
  stripeCustomerId?: string;
}

export interface SubscriptionStatus {
  status: 'active' | 'inactive';
  currentPeriodEnd: number;
}

