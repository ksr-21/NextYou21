
// Use compat imports to support v8-style global syntax in Firebase v9+
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Note: In a real app, these would be loaded via environment variables.
// Since we are building the app for the user, we assume the environment
// provides these via process.env.FIREBASE_CONFIG or similar if available.
const firebaseConfig = {
 apiKey: "AIzaSyB8_Qg6z6BhXX2cjdZm0ux6bO-0bATbObE",
  authDomain: "to-do-14502.firebaseapp.com",
  projectId: "to-do-14502",
  storageBucket: "to-do-14502.firebasestorage.app",
  messagingSenderId: "750508288684",
  appId: "1:750508288684:web:36c3089a1e2838dc588d09",
  measurementId: "G-7TNYJG6X7K"
};

// Initialize Firebase with v8-style check for existing apps to prevent double initialization
// The compat library allows using the traditional firebase.initializeApp and firebase.auth/firestore methods
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
// Use instance methods for auth and firestore as per v8 API
export const auth = firebase.auth();
export const db = firebase.firestore();
