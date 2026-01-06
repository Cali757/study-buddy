import fs from 'fs';
import path from 'path';
import { google, drive_v3 } from 'googleapis';
import admin from 'firebase-admin';
import mammoth from 'mammoth';

type LessonInput = {
  id: string;
  title: string;
  order: number;
  content: string;
  intro: string;
  description?: string;
  isPro: boolean;
  visible?: boolean;
};

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'mywebapp-99a71';
const SERVICE_ACCOUNT_PATH =
  process.env.SERVICE_ACCOUNT_KEY_PATH ||
  path.join(process.cwd(), 'serviceAccountKey.json');
const DRIVE_FOLDER_ID = process.env.DRIVE_LESSON_FOLDER_ID;

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Missing service account file at ${SERVICE_ACCOUNT_PATH}`);
  process.exit(1);
}

if (!DRIVE_FOLDER_ID) {
  console.error('Missing DRIVE_LESSON_FOLDER_ID env var');
  process.exit(1);
}

const serviceAccount = JSON.parse(
  fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      ...serviceAccount,
      projectId: PROJECT_ID,
    }),
    projectId: PROJECT_ID,
  });
}

const db = admin.firestore();

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const orderFromName = (name: string) => {
  const match = name.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const introFromContent = (content: string) => {
  const paragraphs = content.split(/\n\s*\n/).map((p) => p.trim());
  return paragraphs[0]?.slice(0, 400) || '';
};

async function fetchGoogleDoc(fileId: string) {
  const res = (await drive.files.export(
    { fileId, mimeType: 'text/markdown' } as any,
    { responseType: 'text' }
  )) as any;
  return res.data as string;
}

async function fetchFileContent(file: drive_v3.Schema$File) {
  if (!file.id || !file.name || !file.mimeType) {
    throw new Error('Invalid file metadata');
  }

  const mime = file.mimeType;

  if (mime === 'application/vnd.google-apps.document') {
    return await fetchGoogleDoc(file.id);
  }

  const res = (await drive.files.get(
    { fileId: file.id, alt: 'media', supportsAllDrives: true } as any,
    { responseType: 'arraybuffer' }
  )) as any;
  const buffer = Buffer.from(res.data as ArrayBuffer);

  if (
    mime === 'text/markdown' ||
    mime === 'text/plain' ||
    mime === 'application/octet-stream'
  ) {
    return buffer.toString('utf8');
  }

  if (
    mime ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await (mammoth as any).convertToMarkdown({ buffer });
    return result.value;
  }

  throw new Error(`Unsupported mime type: ${mime}`);
}

async function ingestLessons() {
  console.log('Listing files from Drive folder:', DRIVE_FOLDER_ID);
  const listRes = await drive.files.list({
    q: `'${DRIVE_FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, parents)',
    pageSize: 200,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    corpora: 'allDrives',
  });

  const files = listRes.data.files || [];
  if (!files.length) {
    console.log('No files found in the Drive folder.');
    return;
  }

  console.log(`Found ${files.length} lesson files.`);

  for (const file of files) {
    if (!file.name) continue;
    try {
      const content = await fetchFileContent(file);
      const order = orderFromName(file.name);
      const id = slugify(file.name);
      const title = file.name.replace(/\.[^/.]+$/, '');
      const intro = introFromContent(content);

      const lesson: LessonInput = {
        id,
        title,
        order,
        content,
        intro,
        isPro: false,
      };

      await db.collection('lessons').doc(id).set(lesson, { merge: true });
      console.log(`Ingested lesson: ${id} (${title})`);
    } catch (err) {
      console.error(`Failed to ingest ${file.name}:`, err);
    }
  }

  console.log('Ingestion complete.');
}

ingestLessons().catch((err) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});

