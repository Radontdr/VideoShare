import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "video-sharing-29edc.firebaseapp.com",
  projectId: "video-sharing-29edc",
  storageBucket: "video-sharing-29edc.firebasestorage.app",
  messagingSenderId: "676670259290",
  appId: "1:676670259290:web:aaa69b534373413e9a5863"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
const provider= new GoogleAuthProvider();
export default app;
