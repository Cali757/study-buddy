import { Suspense } from "react";
import dynamic from "next/dynamic";

const LessonClient = dynamic<{ lessonId: string }>(
  () => import("./LessonClient"),
  { ssr: false }
);

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>}>
      <LessonClient lessonId={id} />
    </Suspense>
  );
}

