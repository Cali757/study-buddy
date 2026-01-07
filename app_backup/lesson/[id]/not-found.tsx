import Link from "next/link";

export default function NotFound() {
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
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-lg text-gray-600 mb-6">
            The lesson you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/lessons" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
          >
            Back to Lessons
          </Link>
        </div>
      </main>
    </div>
  );
}

