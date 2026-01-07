import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">SaaS Project</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/lessons"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Lessons
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your SaaS Application
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A complete Next.js application with Firebase authentication, 
            ready to build your next big idea.
          </p>
          <p className="text-sm text-purple-700 mb-4">Pro lessons are unlocked for premium users only</p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/lessons"
              className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Authentication</h3>
            <p className="text-gray-600">
              Secure Firebase authentication with email and password
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Next.js Framework</h3>
            <p className="text-gray-600">
              Built with the latest Next.js App Router and TypeScript
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Tailwind CSS</h3>
            <p className="text-gray-600">
              Beautiful, responsive design with Tailwind CSS
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
