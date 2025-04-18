import { initializeApp, getApps,getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5-S9BQUrHZG2DMBeNjaw8GHnFegg69GE",
  authDomain: "assignment-arthex-tech.firebaseapp.com",
  projectId: "assignment-arthex-tech",
  storageBucket: "assignment-arthex-tech.appspot.com",
  messagingSenderId: "345430812774",
  appId: "1:345430812774:web:bf2a5970a772afa17b65a7",
  measurementId: "G-9LQB2ER76W",
};
// console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)


const app = !getApps().legth?initializeApp(firebaseConfig):getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app,auth, db,storage };


// Only import getAnalytics in client-side code if you need it
// import { getAnalytics } from "firebase/analytics";
// const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;