// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGyM5TcuQa5SgkLqfzqHc6UeM-tJdRAAE",
  authDomain: "farmtech-397e0.firebaseapp.com",
  projectId: "farmtech-397e0",
  storageBucket: "farmtech-397e0.firebasestorage.app",
  messagingSenderId: "820557987243",
  appId: "1:820557987243:web:87eccee6a5ee15a92366ee",
  measurementId: "G-0VET6J31S1",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
