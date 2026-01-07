import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                SaaS Project
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About This Project</h1>
        <div className="bg-white rounded-lg shadow p-8 space-y-4">
          <p className="text-lg text-gray-700">
            This is a complete SaaS application built with modern web technologies.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-6">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Next.js 15 with App Router</li>
            <li>TypeScript for type safety</li>
            <li>Firebase Authentication</li>
            <li>Firestore Database integration</li>
            <li>Tailwind CSS for styling</li>
            <li>Protected routes and pages</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
