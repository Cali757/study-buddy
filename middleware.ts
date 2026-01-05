import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.url;

  // Short-circuit Firebase Identity Toolkit calls for tests
  if (url.includes('identitytoolkit.googleapis.com')) {
    return new NextResponse(
      JSON.stringify({
        idToken: 'mock-token',
        localId: 'test-user',
        email: 'testuser@example.com',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

