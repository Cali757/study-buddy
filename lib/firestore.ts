import { Lesson, Quiz, Question } from './types';

export interface UserProgress {
  uid: string;
  lessonsStarted: string[];
  lessonsCompleted: string[];
  quizzesCompleted: Array<{
    quizId: string;
    score: number;
    totalQuestions: number;
    completedAt: any;
  }>;
}

const readProFlag = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('isPro') === 'true';
};

const writeProFlag = (isPro: boolean) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('isPro', isPro ? 'true' : 'false');
};

const sampleLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Sample Lesson 1',
    description: 'Offline sample lesson when Firestore is unreachable.',
    order: 1,
    isPro: false,
    courseId: 'sample',
    courseName: 'Sample Course',
    content: 'Sample lesson content',
    intro: 'Sample intro',
    summary: 'Sample summary',
    visible: true,
  },
  {
    id: 'lesson-pro-1',
    title: 'Pro Lesson 1',
    description: 'Locked Pro content example.',
    order: 2,
    isPro: true,
    courseId: 'sample',
    courseName: 'Sample Course',
    content: 'Pro lesson content',
    intro: 'Pro intro',
    summary: 'Pro summary',
    visible: true,
  },
];

const sampleQuiz: Quiz = {
  id: 'sample-quiz',
  lessonId: 'lesson-1',
  title: 'Sample Quiz',
  questions: [
    {
      id: 'sample-q1',
      quizId: 'sample-quiz',
      question: 'Which option is correct?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
    },
  ],
};

const sampleProgress = (uid: string): UserProgress => ({
  uid,
  lessonsStarted: ['lesson-1'],
  lessonsCompleted: ['lesson-1'],
  quizzesCompleted: [
    {
      quizId: sampleQuiz.id,
      score: 1,
      totalQuestions: 1,
      completedAt: new Date(),
    },
  ],
});

// Lessons collection (offline-friendly mock)
export const getLessons = async (): Promise<Lesson[]> => {
  return sampleLessons;
};

export const getLessonById = async (id: string): Promise<Lesson | null> => {
  const found = sampleLessons.find((l) => l.id === id) ?? sampleLessons[0];
  return { ...found, id };
};

// Upsert a lesson (admin/UI writes)
export const upsertLesson = async (lesson: Partial<Lesson> & { id: string }) => {};

// Quizzes collection
export const getQuizByLessonId = async (lessonId: string): Promise<Quiz | null> => {
  return { ...sampleQuiz, lessonId };
};

export const getQuizById = async (id: string): Promise<Quiz | null> => {
  return { ...sampleQuiz, id };
};

// Upsert a quiz (stores questions on the quiz doc)
export const upsertQuiz = async (
  quiz: Partial<Quiz> & { lessonId: string; id?: string }
): Promise<string> => {
  return quiz.id ?? quiz.lessonId;
};

// Questions collection
export const getQuestionsByQuizId = async (quizId: string): Promise<Question[]> => {
  return (sampleQuiz.questions ?? []).map((q) => ({ ...q, quizId }));
};

// Update lesson metadata
export const updateLessonMeta = async (
  id: string,
  updates: Partial<Pick<Lesson, 'visible' | 'isPro' | 'summary' | 'intro'>>
) => {};

export const setLessonSummary = async (id: string, summary: string) => {
  return;
};

// User Progress collection
export const getUserProgress = async (uid: string): Promise<UserProgress> => {
  return sampleProgress(uid);
};

export const startLesson = async (uid: string, lessonId: string): Promise<void> => {
  return;
};

export const completeLesson = async (uid: string, lessonId: string): Promise<void> => {
  return;
};

export const completeQuiz = async (
  uid: string, 
  quizId: string, 
  score: number, 
  totalQuestions: number
): Promise<void> => {
  return;
};

// User subscription collection
export interface UserSubscription {
  uid: string;
  isPro: boolean;
  subscriptionStatus: 'active' | 'canceled' | 'incomplete' | 'trialing' | 'past_due' | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: any;
  updatedAt: any;
}

export const getUserSubscription = async (uid: string): Promise<UserSubscription | null> => {
  return {
    uid,
    isPro: readProFlag(),
    subscriptionStatus: readProFlag() ? 'active' : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateUserSubscription = async (
  uid: string,
  updates: Partial<UserSubscription>
): Promise<void> => {
  if (updates.isPro !== undefined) {
    writeProFlag(Boolean(updates.isPro));
  }
};

export const setUserPro = async (uid: string, isPro: boolean, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<void> => {
  writeProFlag(isPro);
};

