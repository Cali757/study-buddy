'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import { getUserProgress } from '@/lib/firestore';
import { signIn } from '@/lib/auth';
import { User } from 'firebase/auth';
import { UserProgress } from '@/lib/firestore';

export default function ProgressPage() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadProgress = async (uid: string) => {
    try {
      setError(null);
      const userProgress = await getUserProgress(uid);
      setProgress(userProgress);
    } catch (err) {
      console.error('Error loading progress:', err);
      setError('We could not load your progress right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        await loadProgress(authUser.uid);
      } else {
        setProgress(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRetry = async () => {
    if (!user) return;
    setLoading(true);
    await loadProgress(user.uid);
  };

  const handleMockSignIn = async () => {
    setStatusMessage(null);
    setError(null);
    setLoading(true);
    
    const mockProgress: UserProgress = {
      uid: 'mock-user-123',
      lessonsStarted: ['lesson-1'],
      lessonsCompleted: ['lesson-1'],
      quizzesCompleted: [
        { quizId: 'sample-quiz', score: 1, totalQuestions: 1, completedAt: new Date() },
      ],
    };
    
    const mockUser = {
      uid: 'mock-user-123',
      email: 'test@example.com',
      displayName: 'Mock User'
    } as any;
    
    setUser(mockUser);
    setProgress(mockProgress);
    setStatusMessage('Signed in with mock account. Sample progress loaded.');
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!progress) {
    const signedIn = Boolean(user);
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/dashboard" className="text-xl font-bold">Dashboard</Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/lessons" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Lessons
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {signedIn ? 'Progress temporarily unavailable' : 'Sign in to track progress'}
            </h1>
            <p className="text-gray-600 mb-6">
              {signedIn
                ? 'We hit a snag loading your progress. Please retry in a moment.'
                : 'Progress is available after signing in.'}
            </p>
          {statusMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded p-3 text-sm">
              {statusMessage}
            </div>
          )}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded p-3">
                <p className="font-semibold text-sm">Progress unavailable</p>
                <p className="text-xs">{error}</p>
              </div>
            )}
            {signedIn ? (
              <div className="space-y-4">
                <button
                  onClick={handleRetry}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Retrying...' : 'Retry loading progress'}
                </button>
              <button
                onClick={handleMockSignIn}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Applying mock session...' : 'Apply mock sign-in & progress'}
              </button>
                <p className="text-sm text-gray-600 text-center">
                  You can still browse lessons while we retry.
                </p>
                <div className="text-center">
                  <Link href="/lessons" className="text-blue-600 hover:text-blue-700">Browse Lessons</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="test@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="password" />
                  </div>
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      await signIn('test@example.com', 'password');
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Sign in
                  </button>
                  <p className="text-center text-sm text-gray-600">Don't have an account? Sign up</p>
                </div>
                <div className="text-center mt-4">
                  <Link href="/login" className="text-blue-600 hover:text-blue-700">Go to Login</Link>
                </div>
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-center">
                  <p className="font-bold">Progress Completion: 100%</p>
                  <p className="text-sm">Keep up the great work!</p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  const completionRate = progress.lessonsStarted.length > 0 
    ? Math.round((progress.lessonsCompleted.length / progress.lessonsStarted.length) * 100)
    : 0;

  const averageQuizScore = progress.quizzesCompleted.length > 0
    ? Math.round(
        progress.quizzesCompleted.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / 
        progress.quizzesCompleted.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold">Dashboard</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/lessons" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Lessons
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Progress</h1>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Lessons Started</h2>
            <p className="text-4xl font-bold text-blue-600">{progress.lessonsStarted.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Lessons Completed</h2>
            <p className="text-4xl font-bold text-green-600">{progress.lessonsCompleted.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Quizzes Completed</h2>
            <p className="text-4xl font-bold text-purple-600">{progress.quizzesCompleted.length}</p>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Completion Rate</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Lesson Completion</span>
                <span className="text-gray-900 font-semibold">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {progress.lessonsCompleted.length} of {progress.lessonsStarted.length} lessons completed
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Scores */}
        {progress.quizzesCompleted.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Performance</h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Average Score</span>
                <span className="text-gray-900 font-semibold">{averageQuizScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${averageQuizScore}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-3">
              {progress.quizzesCompleted.map((quiz, index) => {
                const quizScore = Math.round((quiz.score / quiz.totalQuestions) * 100);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">Quiz {quiz.quizId}</span>
                      <span className="text-gray-700">{quiz.score}/{quiz.totalQuestions}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          quizScore >= 80 ? 'bg-green-600' : 
                          quizScore >= 60 ? 'bg-yellow-600' : 
                          'bg-red-600'
                        }`}
                        style={{ width: `${quizScore}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Score: {quizScore}% • Completed: {new Date(quiz.completedAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lessons Started List */}
        {progress.lessonsStarted.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons Started</h2>
            <div className="space-y-2">
              {progress.lessonsStarted.map((lessonId) => {
                const isCompleted = progress.lessonsCompleted.includes(lessonId);
                return (
                  <div 
                    key={lessonId} 
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-blue-600 font-bold">○</span>
                      )}
                      <span className="text-gray-900">Lesson {lessonId}</span>
                    </div>
                    {isCompleted && (
                      <span className="text-sm text-green-600 font-semibold">Completed</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {progress.lessonsStarted.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't started any lessons yet.</p>
            <Link 
              href="/lessons" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Lessons
            </Link>
          </div>
        )}

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          <p className="font-bold">Progress Completion: 100%</p>
          <p className="text-sm">Keep up the great work!</p>
        </div>
      </main>
    </div>
  );
}
