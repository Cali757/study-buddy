'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (url.includes('identitytoolkit.googleapis.com') && (url.includes('signInWithPassword') || url.includes('signUp'))) {
        return new Response(JSON.stringify({
          idToken: 'mock-token',
          localId: 'test-user',
          email: 'testuser@example.com',
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return originalFetch(input, init);
    };
    return () => {
      window.fetch = originalFetch;
    };

    // Register service worker to intercept identitytoolkit calls at network layer
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/mock-auth-sw.js').catch(() => {});
    }
  }, []);

  return <>{children}</>;
}

