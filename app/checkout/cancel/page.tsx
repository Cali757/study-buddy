'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthChange } from '@/lib/auth';
import { StitchShell } from '@/components/StitchShell';

export default function CheckoutCancelPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        router.push('/login');
      } else {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('isPro', 'false');
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <StitchShell title="Payment Canceled">
        <div className="min-h-[40vh] flex items-center justify-center text-xl">Loading...</div>
      </StitchShell>
    );
  }

  return (
    <StitchShell title="Payment Canceled">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-slate-200 p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Canceled</h1>
            <p className="text-gray-600 mb-4">
              Your payment was canceled. No charges were made.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              href="/billing"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Try Again
            </Link>
            <Link
              href="/dashboard"
              className="block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </StitchShell>
  );
}


















