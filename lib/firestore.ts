import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  arrayUnion,
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
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

// Lessons collection
export const getLessons = async (): Promise<Lesson[]> => {
  try {
    const lessonsRef = collection(db, 'lessons');
    const q = query(lessonsRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const lessons: Lesson[] = [];
    querySnapshot.forEach((doc) => {
      lessons.push({
        id: doc.id,
        ...doc.data()
      } as Lesson);
    });
    
    return lessons;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

export const getLessonById = async (id: string): Promise<Lesson | null> => {
  try {
    const lessonRef = doc(db, 'lessons', id);
    const lessonSnap = await getDoc(lessonRef);
    
    if (lessonSnap.exists()) {
      const data = lessonSnap.data() as any;
      return {
        id: lessonSnap.id,
        title: data.title,
        description: data.description,
        order: data.order ?? 0,
        isPro: data.isPro ?? false,
        courseId: data.courseId ?? '',
        courseName: data.courseName ?? '',
        content: data.content ?? '',
        intro: data.intro ?? data.description ?? '',
        summary: data.summary,
        visible: data.visible ?? true,
      } as Lesson;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    throw error;
  }
};

// Quizzes collection
export const getQuizByLessonId = async (lessonId: string): Promise<Quiz | null> => {
  try {
    const quizzesRef = collection(db, 'quizzes');
    const q = query(quizzesRef, where('lessonId', '==', lessonId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const quizDoc = querySnapshot.docs[0];
      return {
        id: quizDoc.id,
        ...quizDoc.data()
      } as Quiz;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

export const getQuizById = async (id: string): Promise<Quiz | null> => {
  try {
    const quizRef = doc(db, 'quizzes', id);
    const quizSnap = await getDoc(quizRef);
    
    if (quizSnap.exists()) {
      const data = quizSnap.data() as any;
      return {
        id: quizSnap.id,
        lessonId: data.lessonId,
        title: data.title ?? 'Quiz',
        questions: data.questions,
      } as Quiz;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

// Questions collection
export const getQuestionsByQuizId = async (quizId: string): Promise<Question[]> => {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(questionsRef, where('quizId', '==', quizId));
    const querySnapshot = await getDocs(q);
    
    const questions: Question[] = [];
    querySnapshot.forEach((doc) => {
      questions.push({
        id: doc.id,
        ...doc.data()
      } as Question);
    });
    
    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Update lesson metadata
export const updateLessonMeta = async (
  id: string,
  updates: Partial<Pick<Lesson, 'visible' | 'isPro' | 'summary' | 'intro'>>
) => {
  try {
    const lessonRef = doc(db, 'lessons', id);
    await updateDoc(lessonRef, updates);
  } catch (error) {
    console.error('Error updating lesson meta:', error);
    throw error;
  }
};

// User Progress collection
export const getUserProgress = async (uid: string): Promise<UserProgress> => {
  try {
    const progressRef = doc(db, 'userProgress', uid);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return progressSnap.data() as UserProgress;
    }
    
    // Initialize progress if it doesn't exist
    const initialProgress: UserProgress = {
      uid,
      lessonsStarted: [],
      lessonsCompleted: [],
      quizzesCompleted: []
    };
    await setDoc(progressRef, initialProgress);
    return initialProgress;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const startLesson = async (uid: string, lessonId: string): Promise<void> => {
  try {
    const progressRef = doc(db, 'userProgress', uid);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      await setDoc(progressRef, {
        uid,
        lessonsStarted: [lessonId],
        lessonsCompleted: [],
        quizzesCompleted: []
      });
    } else {
      const progress = progressSnap.data() as UserProgress;
      if (!progress.lessonsStarted.includes(lessonId)) {
        await updateDoc(progressRef, {
          lessonsStarted: arrayUnion(lessonId)
        });
      }
    }
  } catch (error) {
    console.error('Error starting lesson:', error);
    throw error;
  }
};

export const completeLesson = async (uid: string, lessonId: string): Promise<void> => {
  try {
    const progressRef = doc(db, 'userProgress', uid);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      await setDoc(progressRef, {
        uid,
        lessonsStarted: [lessonId],
        lessonsCompleted: [lessonId],
        quizzesCompleted: []
      });
    } else {
      const progress = progressSnap.data() as UserProgress;
      const updates: any = {};
      
      if (!progress.lessonsStarted.includes(lessonId)) {
        updates.lessonsStarted = arrayUnion(lessonId);
      }
      if (!progress.lessonsCompleted.includes(lessonId)) {
        updates.lessonsCompleted = arrayUnion(lessonId);
      }
      
      if (Object.keys(updates).length > 0) {
        await updateDoc(progressRef, updates);
      }
    }
  } catch (error) {
    console.error('Error completing lesson:', error);
    throw error;
  }
};

export const completeQuiz = async (
  uid: string, 
  quizId: string, 
  score: number, 
  totalQuestions: number
): Promise<void> => {
  try {
    const progressRef = doc(db, 'userProgress', uid);
    const progressSnap = await getDoc(progressRef);
    
    const quizResult = {
      quizId,
      score,
      totalQuestions,
      completedAt: new Date()
    };
    
    if (!progressSnap.exists()) {
      await setDoc(progressRef, {
        uid,
        lessonsStarted: [],
        lessonsCompleted: [],
        quizzesCompleted: [quizResult]
      });
    } else {
      const progress = progressSnap.data() as UserProgress;
      const existingQuiz = progress.quizzesCompleted.find(q => q.quizId === quizId);
      
      if (!existingQuiz) {
        await updateDoc(progressRef, {
          quizzesCompleted: arrayUnion(quizResult)
        });
      }
    }
  } catch (error) {
    console.error('Error completing quiz:', error);
    throw error;
  }
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
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid,
        isPro: data.isPro || false,
        subscriptionStatus: data.subscriptionStatus || null,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    }
    
    // Initialize user subscription if it doesn't exist
    const initialSubscription: UserSubscription = {
      uid,
      isPro: false,
      subscriptionStatus: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(userRef, initialSubscription);
    return initialSubscription;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    // Fail open as free to avoid breaking UI when Firestore is unreachable in tests
    return {
      uid,
      isPro: false,
      subscriptionStatus: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
};

export const updateUserSubscription = async (
  uid: string,
  updates: Partial<UserSubscription>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
};

export const setUserPro = async (uid: string, isPro: boolean, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    const updateData: any = {
      isPro,
      subscriptionStatus: isPro ? 'active' : null,
      updatedAt: new Date()
    };
    
    if (stripeCustomerId) {
      updateData.stripeCustomerId = stripeCustomerId;
    }
    
    if (stripeSubscriptionId) {
      updateData.stripeSubscriptionId = stripeSubscriptionId;
    }
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid,
        createdAt: new Date(),
        ...updateData
      });
    } else {
      await updateDoc(userRef, updateData);
    }
  } catch (error) {
    console.error('Error setting user Pro status:', error);
    throw error;
  }
};

