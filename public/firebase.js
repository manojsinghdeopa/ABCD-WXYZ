// firebase.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInAnonymously, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, collection, deleteDoc, updateDoc, doc, getDoc, getDocs, query, where, setDoc, Timestamp, startAfter, limit, increment, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyCAMfaUeomI3AsuArAEEz-16bCTJC85UhQ",
  authDomain: "abcd-wxyz.firebaseapp.com",
  projectId: "abcd-wxyz",
  storageBucket: "abcd-wxyz.firebasestorage.app",
  messagingSenderId: "210085747891",
  appId: "1:210085747891:web:1af10552756757580524c6",
  measurementId: "G-2BNN57LWNC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// setLogLevel('debug');

export { auth, analytics, db, signInAnonymously, signOut, logEvent, collection, deleteDoc, updateDoc, doc, getDoc, getDocs, query, where, setDoc, Timestamp, startAfter, limit, increment, orderBy };
