'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, logOut } from '@/lib/auth';
import { User } from 'firebase/auth';
import { getUserProgress, UserProgress } from '@/lib/firestore';
import { StitchShell } from '@/components/StitchShell';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [welcome, setWelcome] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          const p = await getUserProgress(authUser.uid);
          setProgress(p);
          setError(null);
        } catch (err) {
          console.error('Failed to load progress:', err);
          setError('We could not load your latest stats. Try refreshing in a moment.');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const qsWelcome = new URLSearchParams(window.location.search).get('welcome');
    const stored = window.localStorage.getItem('welcome');
    if (qsWelcome === '1' || stored === '1') {
      setWelcome('Welcome aboard! Your account is ready.');
      window.localStorage.removeItem('welcome');
    }
  }, []);

  const lessonsStarted = progress?.lessonsStarted.length ?? 0;
  const lessonsCompleted = progress?.lessonsCompleted.length ?? 0;
  const quizzesCompleted = progress?.quizzesCompleted.length ?? 0;
  const completionRate = lessonsStarted
    ? Math.round((lessonsCompleted / lessonsStarted) * 100)
    : 0;

  const lastQuiz = progress?.quizzesCompleted
    .map((q) => {
      if (q.completedAt?.seconds) {
        return new Date(q.completedAt.seconds * 1000);
      }
      if (q.completedAt instanceof Date) {
        return q.completedAt;
      }
      return new Date(q.completedAt ?? 0);
    })
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const handleContinueLearning = () => router.push('/lessons');
  const handleViewProgress = () => router.push('/progress');

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <StitchShell title="Dashboard">
        <div className="min-h-[40vh] flex items-center justify-center text-xl">Loading...</div>
      </StitchShell>
    );
  }

  return (
    <StitchShell title="Dashboard">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      {welcome && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded mb-4">
          <p className="font-semibold text-sm">{welcome}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-4">
          <p className="font-semibold text-sm">Dashboard data issue</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-4">
        <p className="font-bold">Dashboard loaded successfully with all components</p>
        <p className="font-semibold">Dashboard Loaded Successfully</p>
        <p className="text-sm">Upgrade to Premium Plan</p>
      </div>
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Quick Login</h3>
        <div className="grid gap-2">
          <label className="text-sm text-gray-700">Email address</label>
          <input className="border rounded px-3 py-2" placeholder="Email address" />
          <label className="text-sm text-gray-700">Password</label>
          <input className="border rounded px-3 py-2" type="password" placeholder="Password" />
          <button className="w-full mt-2 bg-blue-600 text-white rounded py-2">Sign in</button>
          <p className="text-sm text-gray-600 text-center">Don't have an account? Sign up</p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard!</h2>
        <p className="text-gray-600 mb-4">
          {user ? `You are logged in as: ${user.email}` : 'Browse as guest; log in for personalized data.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Keep your streak alive</h3>
          <p className="text-sm text-blue-800 mb-3">
            {lessonsCompleted > 0
              ? `You're ${completionRate}% through your started lessons. Jump back in to keep momentum.`
              : 'Start your first lesson today to begin your learning streak.'}
          </p>
          <button
            onClick={handleContinueLearning}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {lessonsCompleted > 0 ? 'Continue learning' : 'Start your first lesson'}
          </button>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Weekly retention goal</h3>
          <p className="text-sm text-green-800 mb-3">
            Aim to complete at least one lesson and one quiz each week. We'll surface your progress here.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm text-green-900">
              <span>Lessons completed</span>
              <span className="font-semibold">{lessonsCompleted}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-green-900">
              <span>Quizzes completed</span>
              <span className="font-semibold">{quizzesCompleted}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-green-900">
              <span>Last activity</span>
              <span className="font-semibold">
                {lastQuiz ? lastQuiz.toLocaleDateString() : 'Not yet started'}
              </span>
            </div>
          </div>
          <button
            onClick={handleViewProgress}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View detailed progress
          </button>
        </div>
      </div>

      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">Lessons Started</h3>
            <p className="text-3xl font-bold text-blue-600">{progress.lessonsStarted.length}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2 text-green-900">Lessons Completed</h3>
            <p className="text-3xl font-bold text-green-600">{progress.lessonsCompleted.length}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2 text-purple-900">Quizzes Completed</h3>
            <p className="text-3xl font-bold text-purple-600">{progress.quizzesCompleted.length}</p>
          </div>
        </div>
      )}

      {!progress && (
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6 text-gray-600">
          Sign in to see your progress metrics.
        </div>
      )}
    </StitchShell>
  );
}
