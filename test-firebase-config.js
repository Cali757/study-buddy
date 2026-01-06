const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

console.log('Testing Firebase Configuration...');
console.log('Project ID:', serviceAccount.project_id);
console.log('Client Email:', serviceAccount.client_email);

try {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://mywebapp-99a71.firebaseio.com`
  });
  
  console.log('✓ Firebase Admin SDK initialized successfully!');
  console.log('✓ Credentials are valid');
  console.log('✓ Configuration is correct');
  
  // Try to get Firestore instance (this will fail if database doesn't exist)
  try {
    const db = admin.firestore();
    console.log('✓ Firestore instance created');
    console.log('\nAttempting to connect to Firestore database...');
    
    // Try a simple operation
    db.collection('test').limit(1).get()
      .then(() => {
        console.log('✓ Successfully connected to Firestore database!');
        console.log('✓ All Firebase connections are working!');
        process.exit(0);
      })
      .catch((error) => {
        console.log('\n⚠ Firestore database connection failed:');
        console.log('Error:', error.message);
        console.log('\nThis is expected if the Firestore database hasn\'t been created yet.');
        console.log('\nTo fix this:');
        console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
        console.log('2. Select project "MyWebApp" (mywebapp-99a71)');
        console.log('3. Create a Firestore database');
        console.log('\nOR install Java and use Firebase emulator:');
        console.log('1. Install Java JDK');
        console.log('2. Run: firebase emulators:start --only firestore');
        console.log('3. Set: FIRESTORE_EMULATOR_HOST=localhost:8080');
        console.log('4. Run: node seed-admin.js');
        process.exit(1);
      });
  } catch (error) {
    console.log('\n✗ Failed to create Firestore instance:');
    console.log('Error:', error.message);
    console.log('\nThe firebase-admin package may need the Firestore module.');
    console.log('Try running: npm install firebase-admin');
    process.exit(1);
  }
  
} catch (error) {
  console.log('\n✗ Failed to initialize Firebase Admin SDK:');
  console.log('Error:', error.message);
  console.log('\nPlease check:');
  console.log('1. serviceAccountKey.json exists and is valid');
  console.log('2. Credentials are correct');
  process.exit(1);
}
