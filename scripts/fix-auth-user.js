const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

const USERS = [
  { email: 'testuser@example.com', password: 'TestPassword123' },
  { email: 'test@example.com', password: 'TestPassword123' },
];

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function main() {
  try {
    for (const { email, password } of USERS) {
      let user;
      try {
        user = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(user.uid, { password, emailVerified: true });
        console.log(`Updated password for ${email} (uid: ${user.uid})`);
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          user = await admin.auth().createUser({
            email,
            password,
            emailVerified: true,
          });
          console.log(`Created user ${email} (uid: ${user.uid})`);
        } else {
          throw err;
        }
      }
    }
    console.log('Done.');
  } catch (err) {
    console.error('Failed to ensure test user:', err);
    process.exit(1);
  }
}

main();

