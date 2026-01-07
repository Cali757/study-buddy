'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
};

export function StitchShell({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500/10 text-blue-600">
                🚚
              </div>
              <Link href="/" className="text-lg font-bold tracking-tight">
                Study Buddy
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/lessons" className="hover:text-blue-600">
                Lessons
              </Link>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/billing" className="hover:text-blue-600">
                Pricing
              </Link>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white py-2 px-4 rounded-full shadow hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 pt-12 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-600">
                  🚚
                </div>
                <span className="text-lg font-bold">Study Buddy</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                The intelligent study companion for freight brokering, dispatching, and trucking
                professionals.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-4">Platform</h4>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <Link href="/stitch" className="hover:text-blue-600">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/billing" className="hover:text-blue-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/lessons" className="hover:text-blue-600">
                    Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/progress" className="hover:text-blue-600">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-4">Resources</h4>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <Link href="/lessons" className="hover:text-blue-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/lessons" className="hover:text-blue-600">
                    Industry Reports
                  </Link>
                </li>
                <li>
                  <Link href="/lessons" className="hover:text-blue-600">
                    Freight Glossary
                  </Link>
                </li>
                <li>
                  <Link href="/lessons" className="hover:text-blue-600">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <a className="hover:text-blue-600" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600" href="#">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600" href="#">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>© 2023 Study Buddy Inc. All rights reserved.</p>
            <div className="flex gap-4 text-slate-400">
              <a className="hover:text-blue-600" href="#">
                Twitter
              </a>
              <a className="hover:text-blue-600" href="#">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

