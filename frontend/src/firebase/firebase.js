// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC7Ngwj5rtnNTYBZcRlev0kWAG4rVzZVvc",
  authDomain: "emergency-crisis-39724.firebaseapp.com",
  projectId: "emergency-crisis-39724",
  storageBucket: "emergency-crisis-39724.firebasestorage.app",
  messagingSenderId: "310390984044",
  appId: "1:310390984044:web:e635d2ce4926ce7e4db749",
  measurementId: "G-261FTNVCEF"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const messaging = (await isSupported()) ? getMessaging(app) : null;