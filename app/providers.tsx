'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const urlRaw =
        typeof input === 'string'
          ? input
          : typeof (input as any)?.url === 'string'
          ? ((input as any).url as string)
          : '';

      if (
        urlRaw &&
        (urlRaw.includes('identitytoolkit.googleapis.com') ||
          urlRaw.includes('firestore.googleapis.com'))
      ) {
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
    // Register service worker to intercept identitytoolkit calls at network layer
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/mock-auth-sw.js').catch(() => {});
    }

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}

