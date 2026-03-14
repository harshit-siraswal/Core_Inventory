// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4rPNV9ogU6Fp3yezLqGFVGp6As132Pf0",
  authDomain: "core-inventory-20d52.firebaseapp.com",
  projectId: "core-inventory-20d52",
  storageBucket: "core-inventory-20d52.firebasestorage.app",
  messagingSenderId: "10980916097",
  appId: "1:10980916097:web:923f22d65d089dfdee8680",
  measurementId: "G-7M1W5MXYZ9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
