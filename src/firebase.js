import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGyM5TcuQa5SgkLqfzqHc6UeM-tJdRAAE",
  authDomain: "farmtech-397e0.firebaseapp.com",
  projectId: "farmtech-397e0",
  storageBucket: "farmtech-397e0.appspot.com",
  messagingSenderId: "820557987243",
  appId: "1:820557987243:web:87eccee6a5ee15a92366ee",
  measurementId: "G-0VET6J31S1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Firestore instance
export const auth = getAuth(app); // Authentication instance