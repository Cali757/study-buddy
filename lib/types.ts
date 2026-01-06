// Type definitions for Firestore collections

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  order: number;
  isPro: boolean;
  courseId: string;
  courseName: string;
  content: string;
  intro?: string;
  summary?: string;
  visible?: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions?: Question[];
}

export interface Question {
  id?: string;
  quizId: string;
  question: string;
  options: string[];
  correctIndex: number;
}

