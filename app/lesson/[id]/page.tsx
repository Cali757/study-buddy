import { Suspense } from "react";
import dynamic from "next/dynamic";
import { StitchShell } from "@/components/StitchShell";

const LessonClient = dynamic<{ lessonId: string }>(() => import("./LessonClient"));

export default function LessonPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <StitchShell title="Lesson">
      <Suspense
        fallback={
          <div className="min-h-[40vh] flex items-center justify-center text-xl">
            Loading...
          </div>
        }
      >
        <LessonClient lessonId={id} />
      </Suspense>
    </StitchShell>
  );
}

