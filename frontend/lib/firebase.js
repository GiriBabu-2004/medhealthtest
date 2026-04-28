// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "..................",
  authDomain: "................",
  projectId: "................",
  storageBucket: "................",
  messagingSenderId: "..................",
  appId: ".....................",
  measurementId: "..................."
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
