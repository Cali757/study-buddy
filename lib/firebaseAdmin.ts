import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';

let initialized = false;

const tryLoadServiceAccount = () => {
  const inline = process.env.FIREBASE_ADMIN_CREDENTIALS;
  if (inline) {
    return JSON.parse(inline);
  }

  const filePath =
    process.env.SERVICE_ACCOUNT_KEY_PATH ||
    path.join(process.cwd(), 'serviceAccountKey.json');

  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  return null;
};

export const initAdmin = () => {
  if (initialized) return;

  const sa = tryLoadServiceAccount();
  if (!sa && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      'Missing Firebase admin credentials. Set FIREBASE_ADMIN_CREDENTIALS, SERVICE_ACCOUNT_KEY_PATH, or GOOGLE_APPLICATION_CREDENTIALS.'
    );
  }

  if (!admin.apps.length) {
    if (sa) {
      admin.initializeApp({
        credential: admin.credential.cert(sa as admin.ServiceAccount),
        projectId: sa.project_id,
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }

  initialized = true;
};

export const getAdminDb = () => {
  initAdmin();
  return admin.firestore();
};

export const getAdminAuth = () => {
  initAdmin();
  return admin.auth();
};







