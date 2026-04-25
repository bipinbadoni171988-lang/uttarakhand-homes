import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAd4YUFIH6tmgYhSO96jD7XDiUqaL40oUI",
  authDomain: "uttarakhand-homes-6bdec.firebaseapp.com",
  projectId: "uttarakhand-homes-6bdec",
  storageBucket: "uttarakhand-homes-6bdec.firebasestorage.app",
  messagingSenderId: "249480800352",
  appId: "1:249480800352:web:d317628f43754f4f847b05"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);