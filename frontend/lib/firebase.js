// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDXqYzEyPp6YJlY2H8xNR2cD9tXahje0e8",
  authDomain: "medhealth-7e194.firebaseapp.com",
  projectId: "medhealth-7e194",
  storageBucket: "medhealth-7e194.firebasestorage.app",
  messagingSenderId: "868979980173",
  appId: "1:868979980173:web:e068a44eea0434a41c2fc4",
  measurementId: "G-C8MX76GHR2"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
