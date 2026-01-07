'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { onAuthChange } from '@/lib/auth';
import { User } from 'firebase/auth';
import { getLessons, getUserSubscription } from '@/lib/firestore';
import { Lesson } from '@/lib/types';
import { StitchShell } from '@/components/StitchShell';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const lessonsData = await getLessons();
        setLessons(lessonsData.filter((l) => l.visible ?? true));
      } catch (error) {
        console.error('Error loading lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const subscription = await getUserSubscription(authUser.uid);
          setIsPro(subscription?.isPro || false);
        } catch (err) {
          console.error('Error loading subscription:', err);
        }
      }
      loadLessons();
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <StitchShell title="Lessons">
        <div className="min-h-[40vh] flex items-center justify-center text-xl">Loading...</div>
      </StitchShell>
    );
  }

  return (
    <StitchShell title="Lessons">
      <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-900">
        <p className="font-semibold">Upgrade to Premium Access</p>
        <p className="text-sm">Unlock all pro lessons with a premium plan.</p>
      </div>
      {lessons.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-600">No lessons available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-xl border border-slate-200 p-6 relative shadow-sm">
              {lesson.isPro && (
                <span className="absolute top-4 right-4 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Pro
                </span>
              )}
              <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
              <p className="text-slate-600 mb-4">{lesson.description}</p>
              {lesson.isPro && !isPro ? (
                <div className="space-y-2">
                  <Link
                    href="/billing"
                    className="block text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Upgrade to Access
                  </Link>
                  <p className="text-xs text-slate-500 text-center">Pro content</p>
                </div>
              ) : (
                <Link
                  href={`/lesson/${lesson.id}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Lesson →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </StitchShell>
  );
}





