'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthChange } from '@/lib/auth';
import { User } from 'firebase/auth';
import { getLessonById, getQuizByLessonId, startLesson, completeLesson, updateLessonMeta, getUserSubscription } from '@/lib/firestore';
import { Lesson, Quiz } from '@/lib/types';

const summarize = (content: string, intro?: string) => {
  if (intro && intro.trim().length) return intro;
  const text = content.replace(/\s+/g, ' ').trim();
  return text.slice(0, 400);
};

export default function LessonClient({ lessonId }: { lessonId: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const sub = await getUserSubscription(authUser.uid);
          setIsPro(sub?.isPro || false);
        } catch (err) {
          console.error('Subscription fetch error:', err);
          setIsPro(false);
        }
      } else {
        setIsPro(false);
        // Do not redirect; show gating UI for anonymous users
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    async function loadLesson() {
      try {
        const lessonData = await getLessonById(lessonId);
        if (!lessonData || lessonData.visible === false) {
          setLesson(null);
          setLoading(false);
          return;
        }
        setLesson(lessonData);

        const summary = summarize(lessonData.content || '', lessonData.intro);
        if (!lessonData.summary) {
          await updateLessonMeta(lessonId, { summary });
          setLesson({ ...lessonData, summary });
        }

        const quizData = await getQuizByLessonId(lessonId);
        setQuiz(quizData);

        if (user) {
          await startLesson(user.uid, lessonId);
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId, user]);

  const handleComplete = async () => {
    if (!user || !lessonId) return;
    setCompleting(true);
    try {
      await completeLesson(user.uid, lessonId);
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  Study Buddy
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/lessons" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Back to Lessons
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
            <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist.</p>
            <Link href="/lessons" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Lessons
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (lesson.isPro && !isPro) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  Study Buddy
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/lessons" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Back to Lessons
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Pro Content Locked</h1>
            <p className="text-gray-600 mb-6">{lesson.title} is a Pro lesson.</p>
            <Link 
              href="/billing" 
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Upgrade to Pro
            </Link>
            <div className="mt-4">
              <Link href="/lessons" className="text-blue-600 hover:text-blue-700">
                ← Back to Lessons
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Study Buddy
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/lessons" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-4 flex items-center gap-2">
          {lesson.isPro && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Pro
            </span>
          )}
          <span className="text-sm text-gray-500">Order {lesson.order}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
        {lesson.summary && (
          <div className="bg-blue-50 border border-blue-100 text-blue-900 px-4 py-3 rounded mb-4">
            <h3 className="font-semibold mb-1">Summary</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">{lesson.summary}</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <p className="text-lg text-gray-700 whitespace-pre-line">{lesson.description}</p>
          <div className="prose max-w-none text-gray-800 whitespace-pre-line">
            {lesson.content}
          </div>
          <div className="mt-6 flex gap-4">
            {quiz ? (
              <Link href={`/quiz/${quiz.id}`} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Take Quiz
              </Link>
            ) : (
              <span className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg">Quiz coming soon</span>
            )}
            <button
              onClick={handleComplete}
              disabled={completing}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {completing ? 'Completing...' : 'Mark as Complete'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

