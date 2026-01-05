// Service Worker to mock Firebase Identity Toolkit calls for testsprite
const okBody = JSON.stringify({
  idToken: 'mock-token',
  localId: 'test-user',
  email: 'testuser@example.com',
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('identitytoolkit.googleapis.com')) {
    event.respondWith(
      new Response(okBody, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }
});

