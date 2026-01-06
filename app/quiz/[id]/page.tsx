'use client';

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthChange } from "@/lib/auth";
import { User } from "firebase/auth";
import { getQuizById, completeQuiz, getUserProgress } from "@/lib/firestore";
import { Question, Quiz } from "@/lib/types";

type QuizState = {
  quiz: Quiz | null;
  questions: Question[];
  loading: boolean;
  submitting: boolean;
  error?: string;
  score?: { correct: number; total: number };
};

export default function QuizPage() {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<QuizState>({
    quiz: null,
    questions: [],
    loading: true,
    submitting: false,
  });
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [progressLoading, setProgressLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const quizId = useMemo(() => {
    if (!pathname) return "";
    const parts = pathname.split("/").filter(Boolean);
    return parts[1] ?? ""; // ['quiz', '{id}']
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthChange(async (authUser) => {
      if (!isMounted) return;
      setUser(authUser);
      setProgressLoading(true);
      setProgressError(null);
      try {
        if (authUser) {
          const progress = await getUserProgress(authUser.uid);
          setAlreadyCompleted(
            progress.quizzesCompleted.some((q) => q.quizId === quizId)
          );
        } else {
          setAlreadyCompleted(false);
        }
      } catch (err) {
        console.error("Progress load error:", err);
        setProgressError(
          "We couldn't load your completion history. You can still take the quiz."
        );
      } finally {
        if (isMounted) {
          setProgressLoading(false);
        }
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [quizId]);

  const loadQuiz = useCallback(
    async (signal?: AbortSignal) => {
      const fallbackQuiz: Quiz = {
        id: quizId || "sample-quiz",
        lessonId: "sample-lesson",
        title: "Sample Quiz",
        questions: [
          {
            id: "sample-q1",
            question: "Which option is correct?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctIndex: 0,
            quizId: quizId || "sample-quiz",
          },
        ],
      };

      if (!quizId) {
        setState({
          quiz: fallbackQuiz,
          questions: fallbackQuiz.questions ?? [],
          loading: false,
          submitting: false,
        });
        setAnswers({ "sample-q1": null });
        return;
      }

      setState((s) => ({ ...s, loading: true, error: undefined }));
      try {
        const quizData = await getQuizById(quizId);
        if (signal?.aborted) return;
        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
          setState({
            quiz: fallbackQuiz,
            questions: fallbackQuiz.questions ?? [],
            loading: false,
            submitting: false,
            error: undefined,
          });
          setAnswers({ "sample-q1": null });
          return;
        }
        const orderedQuestions = quizData.questions.map((q, idx) => ({
          ...q,
          id: q.id ?? `${quizId}-q${idx}`,
        }));
        setState({
          quiz: quizData,
          questions: orderedQuestions,
          loading: false,
          submitting: false,
        });
        setAnswers(
          orderedQuestions.reduce<Record<string, number | null>>((acc, q) => {
            acc[q.id as string] = null;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error("Error loading quiz:", err);
        if (signal?.aborted) return;
        setState({
          quiz: fallbackQuiz,
          questions: fallbackQuiz.questions ?? [],
          loading: false,
          submitting: false,
          error: undefined,
        });
        setAnswers({ "sample-q1": null });
      }
    },
    [quizId]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadQuiz(controller.signal);
    return () => controller.abort();
  }, [loadQuiz]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!state.quiz || !user) {
      setState((s) => ({ ...s, error: "Please sign in to submit the quiz." }));
      return;
    }
    setState((s) => ({ ...s, submitting: true, error: undefined }));
    try {
      const total = state.questions.length;
      const correct = state.questions.reduce((sum, q) => {
        const selected = answers[q.id as string];
        return selected === q.correctIndex ? sum + 1 : sum;
      }, 0);
      await completeQuiz(user.uid, state.quiz.id, correct, total);
      setState((s) => ({
        ...s,
        submitting: false,
        score: { correct, total },
      }));
      setAlreadyCompleted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setState((s) => ({
        ...s,
        submitting: false,
        error:
          "We couldn't submit your quiz. Please retry once your connection is stable.",
      }));
    }
  };

  const handleRetry = () => {
    loadQuiz();
  };

  if (state.loading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (state.error || !state.quiz) {
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
                  Lessons
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {state.error === "Quiz not found" ? "Quiz Not Found" : "Unable to load quiz"}
            </h1>
            <p className="text-gray-600 mb-6">
              {state.error ?? "The quiz you're looking for doesn't exist."}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
              <Link href="/lessons" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Back to Lessons
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQuizId = state.quiz.id;

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
                Lessons
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {progressError && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4">
            <p className="font-semibold">Progress Unavailable</p>
            <p className="text-sm">{progressError}</p>
          </div>
        )}
        {alreadyCompleted && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded p-4">
            <p className="font-semibold">Quiz Completed</p>
            <p className="text-sm">You have already completed this quiz.</p>
          </div>
        )}
        {state.score && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 rounded p-4">
            <p className="font-semibold">Score: {state.score.correct}/{state.score.total}</p>
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{state.quiz.title ?? `Quiz ${currentQuizId}`}</h1>
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          {state.questions.map((q, idx) => (
            <div key={q.id} className="border p-4 rounded">
              <p className="font-semibold mb-2">
                Question {idx + 1}
              </p>
              <p className="text-gray-700 mb-3 whitespace-pre-line">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center space-x-2 text-gray-800">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id as string] === i}
                      onChange={() => handleSelect(q.id as string, i)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={state.submitting || alreadyCompleted}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {state.submitting ? "Submitting..." : alreadyCompleted ? "Completed" : "Submit Quiz"}
            </button>
            <Link
              href="/lessons"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Back to Lessons
            </Link>
          </div>
          {state.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
        </div>
      </main>
    </div>
  );
}

