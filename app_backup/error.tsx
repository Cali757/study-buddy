'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white shadow rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
          <p className="text-gray-700 mb-4">
            We hit an unexpected error while rendering this page. Please try again or return to the dashboard.
          </p>
          {error?.message && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">
              <p className="font-semibold">Error detail</p>
              <p className="break-words">{error.message}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Go to dashboard
            </Link>
            <Link href="/" className="px-4 py-2 text-blue-700 underline">
              Back to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}






