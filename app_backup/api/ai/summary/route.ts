import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(req: Request) {
  try {
    const { lessonId, force } = await req.json();
        console.log(`[AI SUMMARY] Request received for lessonId: ${lessonId}, force: ${force}`);
    if (!lessonId) {
            console.error('[AI SUMMARY] Error: lessonId is required but not provided');

    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY env var for summary generation' },
        { status: 500 }
      );
    }

    const db = getAdminDb();
    const snap = await db.collection('lessons').doc(lessonId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const data = snap.data() as any;
    if (!data?.content) {
      return NextResponse.json({ error: 'Lesson has no content to summarize' }, { status: 400 });
    }

    if (data.summary && !force) {
      return NextResponse.json({ summary: data.summary, cached: true });
    }

    const prompt = [
      {
        role: 'system',
        content:
          'You are a concise learning assistant. Write a clear 3-6 sentence summary of the lesson content. Preserve key facts, be specific, avoid fluff.',
      },
      {
        role: 'user',
        content: `Lesson title: ${data.title ?? lessonId}\n\nLesson content:\n${data.content}`,
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
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: 'LLM request failed', detail: errText },
        { status: 502 }
      );
    }

    const payload = await response.json();
    const summary =
      payload?.choices?.[0]?.message?.content?.trim() || null;

    if (!summary) {
      return NextResponse.json({ error: 'No summary returned from LLM' }, { status: 502 });
    }

    await db.collection('lessons').doc(lessonId).set({ summary }, { merge: true });

    return NextResponse.json({ summary, cached: false });
  } catch (error) {
    console.error('Summary generation failed:', error);
    return NextResponse.json({ error: 'Summary generation failed' }, { status: 500 });
  }
}






