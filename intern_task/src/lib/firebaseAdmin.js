// lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

console.log("Firebase Project ID: ", process.env.FIREBASE_PROJECT_ID);
console.log("Firebase Client Email: ", process.env.FIREBASE_CLIENT_EMAIL);
const fixedKey = process.env.FIREBASE_PRIVATE_KEY
console.log(`FIREBASE_PRIVATE_KEY="${fixedKey}"`);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();
export { db };
