const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));

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
    await auth.updateUser(existing.uid, { password, emailVerified: true, disabled: false });
    console.log(`Updated password for ${email} (uid: ${existing.uid})`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      const created = await auth.createUser({ email, password, emailVerified: true, disabled: false });
      console.log(`Created user: ${email} (uid: ${created.uid})`);
    } else {
      throw err;
    }
  }
}

async function main() {
  for (const u of users) {
    await ensureUser(u);
  }
  console.log('Test users reset complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

