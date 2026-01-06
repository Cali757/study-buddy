'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { onAuthChange } from '@/lib/auth';
import { User } from 'firebase/auth';
import { getLessons, getUserSubscription } from '@/lib/firestore';
import { Lesson } from '@/lib/types';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
              {user && (
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
              )}
              <Link href="/lessons" className="px-4 py-2 text-sm font-medium text-blue-600">
                Lessons
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Lessons</h1>
        <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4 text-purple-800">
          <p className="font-semibold">Upgrade to Premium Access</p>
          <p className="text-sm">Unlock all pro lessons with a premium plan.</p>
        </div>
        {lessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No lessons available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow p-6 relative">
                {lesson.isPro && (
                  <span className="absolute top-4 right-4 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Pro
                  </span>
                )}
                <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                {lesson.isPro && !isPro ? (
                  <div className="space-y-2">
                    <Link 
                      href="/billing" 
                      className="block text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Upgrade to Access
                    </Link>
                    <p className="text-xs text-gray-500 text-center">Pro content</p>
                  </div>
                ) : (
                  <Link 
                    href={`/lesson/${lesson.id}`} 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Lesson →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}





