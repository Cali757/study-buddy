const admin = require('firebase-admin');
const path = require('path');

// Resolve service account key from project root
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

const users = [
  { email: 'testuser@example.com', password: 'TestPassword123' },
  { email: 'test@example.com', password: 'TestPassword123' },
];

async function ensureUser({ email, password }) {
  try {
    const existing = await auth.getUserByEmail(email);
    console.log(`User already exists: ${email} (uid: ${existing.uid})`);
    return existing;
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      const created = await auth.createUser({ email, password, emailVerified: true, disabled: false });
      console.log(`Created user: ${email} (uid: ${created.uid})`);
      return created;
    }
    throw err;
  }
}

async function main() {
  for (const user of users) {
    await ensureUser(user);
  }
  console.log('Test users ready');
}

main().catch((err) => {
  console.error('Error creating test users:', err);
  process.exit(1);
});

