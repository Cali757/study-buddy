'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import { getLessons, updateLessonMeta } from '@/lib/firestore';
import { Lesson } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { StitchShell } from '@/components/StitchShell';

export default function AdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      const token = await user.getIdTokenResult();
      if (!token.claims?.admin) {
        router.push('/');
        return;
      }
      setIsAdmin(true);
      try {
        const data = await getLessons();
        setLessons(data);
      } catch (err) {
        console.error('Failed to load lessons', err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const toggleField = async (id: string, field: 'isPro' | 'visible', current: boolean) => {
    setSavingId(id);
    try {
      await updateLessonMeta(id, { [field]: !current });
      setLessons((prev) =>
        prev.map((l) => (l.id === id ? { ...l, [field]: !current } : l))
      );
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setSavingId(null);
    }
  };

  const generateSummary = async (lessonId: string) => {
    setSavingId(`summary-${lessonId}`);
    setMessage(null);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Summary generation failed');
      }
      const body = await res.json();
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, summary: body.summary } : l))
      );
      setMessage(`Summary generated for ${lessonId}`);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Summary generation failed');
    } finally {
      setSavingId(null);
    }
  };

  const generateQuiz = async (lessonId: string) => {
    setSavingId(`quiz-${lessonId}`);
    setMessage(null);
    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Quiz generation failed');
      }
      setMessage(`Quiz generated for ${lessonId}`);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Quiz generation failed');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <StitchShell title="Admin">
        <div className="min-h-[40vh] flex items-center justify-center text-xl">Loading...</div>
      </StitchShell>
    );
  }

  if (!isAdmin) {
    return (
      <StitchShell title="Admin">
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin access required</h1>
            <p className="text-gray-600">Please sign in with an admin account.</p>
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Go to Login
            </Link>
          </div>
        </div>
      </StitchShell>
    );
  }

  return (
    <StitchShell title="Admin">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Lesson Controls</h1>
        {message && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 rounded p-3">
            {message}
          </div>
        )}
        <div className="bg-white shadow-sm rounded-lg border border-slate-200 divide-y">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{lesson.title}</span>
                  <span className="text-xs text-gray-500">({lesson.id})</span>
                  <span className="text-xs text-gray-500">Order {lesson.order}</span>
                </div>
                <div className="text-sm text-gray-600">{lesson.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleField(lesson.id, 'visible', lesson.visible ?? true)}
                  disabled={savingId === lesson.id}
                  className={`px-3 py-1 rounded text-sm ${
                    lesson.visible === false
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {lesson.visible === false ? 'Hidden' : 'Visible'}
                </button>
                <button
                  onClick={() => toggleField(lesson.id, 'isPro', lesson.isPro)}
                  disabled={savingId === lesson.id}
                  className={`px-3 py-1 rounded text-sm ${
                    lesson.isPro ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {lesson.isPro ? 'Pro' : 'Free'}
                </button>
                <button
                  onClick={() => generateSummary(lesson.id)}
                  disabled={savingId === `summary-${lesson.id}`}
                  className="px-3 py-1 rounded text-sm bg-yellow-100 text-yellow-800"
                >
                  {savingId === `summary-${lesson.id}` ? 'Summarizing...' : 'Generate Summary'}
                </button>
                <button
                  onClick={() => generateQuiz(lesson.id)}
                  disabled={savingId === `quiz-${lesson.id}`}
                  className="px-3 py-1 rounded text-sm bg-indigo-100 text-indigo-800"
                >
                  {savingId === `quiz-${lesson.id}` ? 'Generating Quiz...' : 'Generate Quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StitchShell>
  );
}

