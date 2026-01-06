import { google } from 'googleapis';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Google Drive folder ID containing the courses
const FOLDER_ID = '160JcFAcnLycSBZbe0KLWTQqermzSAkzi';

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../google-drive-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

async function listFilesInFolder(folderId: string) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType)',
      orderBy: 'name',
    });
    return response.data.files || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

async function getFileContent(fileId: string): Promise<string> {
  try {
    const response = await drive.files.export({
      fileId: fileId,
      mimeType: 'text/plain',
    }, { responseType: 'text' });
    return response.data as string;
  } catch (error) {
    console.error(`Error getting content for file ${fileId}:`, error);
    throw error;
  }
}

async function ingestCourses() {
  console.log('Starting Google Drive ingestion...');
  
  try {
    // Get all files/folders in the main folder
    const courses = await listFilesInFolder(FOLDER_ID);
    console.log(`Found ${courses.length} courses`);

    for (const course of courses) {
      console.log(`\nProcessing course: ${course.name}`);
      
      if (course.mimeType === 'application/vnd.google-apps.folder') {
        // This is a course folder, get lessons inside
        const lessons = await listFilesInFolder(course.id!);
        console.log(`  Found ${lessons.length} lessons in ${course.name}`);

        for (let i = 0; i < lessons.length; i++) {
          const lesson = lessons[i];
          console.log(`  Processing lesson: ${lesson.name}`);

          if (lesson.mimeType === 'application/vnd.google-apps.document') {
            // Get the content of the Google Doc
            const content = await getFileContent(lesson.id!);
            
            // Create lesson document in Firestore
            const lessonData = {
              title: lesson.name,
              content: content,
              courseId: course.id,
              courseName: course.name,
              order: i + 1,
              driveFileId: lesson.id,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              isPro: false, // Default to free
              isVisible: true, // Default to visible
            };

            // Use the Drive file ID as the document ID for easy updates
            await db.collection('lessons').doc(lesson.id!).set(lessonData);
            console.log(`    ✓ Saved lesson: ${lesson.name}`);
          }
        }
      } else if (course.mimeType === 'application/vnd.google-apps.document') {
        // This is a standalone lesson document
        console.log(`  Processing standalone lesson: ${course.name}`);
        const content = await getFileContent(course.id!);
        
        const lessonData = {
          title: course.name,
          content: content,
          courseId: 'standalone',
          courseName: 'Standalone Lessons',
          order: 1,
          driveFileId: course.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          isPro: false,
          isVisible: true,
        };

        await db.collection('lessons').doc(course.id!).set(lessonData);
        console.log(`  ✓ Saved standalone lesson: ${course.name}`);
      }
    }

    console.log('\n✅ Ingestion complete!');
  } catch (error) {
    console.error('Error during ingestion:', error);
    throw error;
  }
}

// Run the ingestion
ingestCourses()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
