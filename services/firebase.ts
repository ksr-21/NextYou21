
// Use compat imports to support v8-style global syntax in Firebase v9+
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Note: In a real app, these would be loaded via environment variables.
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
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Use instance methods for auth and firestore as per v8 API
export const auth = firebase.auth();
export const db = firebase.firestore();

// Ensure persistence is set to LOCAL (this is usually default, but explicit is better for UX guarantees)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
  console.error("Auth Persistence Error:", error);
});
