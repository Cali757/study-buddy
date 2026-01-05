/* Seed users directly via Identity Toolkit REST API for test credentials */

const fetch = require('node-fetch');

// Updated API key for Firebase project mywebapp-99a71
const key = 'AIzaSyC9enQBPijdpD66r-dmcrcovv89f-Ebkc4';
const email = 'testuser@example.com';
const password = 'TestPassword123';

async function main() {
  const signUp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const su = await signUp.json();
  console.log('signUp', su);

  const signIn = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const si = await signIn.json();
  console.log('signIn', si);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

