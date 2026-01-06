import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

type AiQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

const normalizeQuestions = (raw: any, fallbackTitle: string, quizId: string) => {
  const questions = Array.isArray(raw?.questions) ? raw.questions : [];
  const cleaned: AiQuestion[] = questions
    .map((q: any) => ({
      question: typeof q?.question === 'string' ? q.question.trim() : '',
      options: Array.isArray(q?.options)
        ? q.options.map((o: any) => String(o)).filter((o: any) => o.length > 0)
        : [],
      correctIndex: typeof q?.correctIndex === 'number' ? q.correctIndex : -1,
    }))
    .filter((q: AiQuestion) => q.question && q.options.length >= 2 && q.correctIndex >= 0);

  // Limit to max 10 questions for safety
  const limited = cleaned.slice(0, 10);

  return {
    lessonId: quizId,
    title: raw?.title || `Quiz for ${fallbackTitle}`,
    questions: limited,
  };
};

export async function POST(req: Request) {
  try {
    const { lessonId, force } = await req.json();
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY env var for quiz generation' },
        { status: 500 }
      );
    }

    const db = getAdminDb();
    const lessonSnap = await db.collection('lessons').doc(lessonId).get();
    if (!lessonSnap.exists) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    const lesson = lessonSnap.data() as any;
    if (!lesson?.content) {
      return NextResponse.json({ error: 'Lesson has no content to generate a quiz' }, { status: 400 });
    }

    if (!force) {
      const existingSnap = await db.collection('quizzes').doc(lessonId).get();
      if (existingSnap.exists) {
        return NextResponse.json({ quizId: lessonId, cached: true });
      }
    }

    const prompt = [
      {
        role: 'system',
        content:
          'You generate multiple-choice quizzes. Respond ONLY with valid JSON matching: {"questions":[{"question":string,"options":[string,string,string,string],"correctIndex":number}]}. Provide 3-5 concise questions. Options must be unique. correctIndex is 0-based.',
      },
      {
        role: 'user',
        content: `Create a quiz for the lesson below.\nTitle: ${lesson.title ?? lessonId}\nContent:\n${lesson.content}`,
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: prompt,
        max_tokens: 800,
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: 'LLM request failed', detail: errText }, { status: 502 });
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No quiz returned from LLM' }, { status: 502 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON from LLM' }, { status: 502 });
    }

    const quizData = normalizeQuestions(parsed, lesson.title ?? lessonId, lessonId);
    if (!quizData.questions.length) {
      return NextResponse.json({ error: 'No valid questions generated' }, { status: 502 });
    }

    await db.collection('quizzes').doc(lessonId).set(
      {
        lessonId,
        title: quizData.title,
        questions: quizData.questions,
      },
      { merge: true }
    );

    return NextResponse.json({
      quizId: lessonId,
      questions: quizData.questions,
      cached: false,
    });
  } catch (error) {
    console.error('Quiz generation failed:', error);
    return NextResponse.json({ error: 'Quiz generation failed' }, { status: 500 });
  }
}






