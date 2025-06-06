// src/pages/UserLogin.jsx
import React, { useState, useEffect } from "react";
import "../css/UserLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import logo from "../images/newlogo.png";

// Firestore helpers
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If a farmer is already logged in (user_uid in localStorage), redirect to dashboard
    const uid = localStorage.getItem("user_uid");
    if (uid) {
      navigate("/userdash", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1) Sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2) Store UID locally
      localStorage.setItem("user_uid", user.uid);

      // 3) Load the user's profile doc to get firstName / lastName
      const userSnap = await getDoc(doc(db, "users", user.uid));
      let firstName = "";
      let lastName = "";
      if (userSnap.exists()) {
        const u = userSnap.data();
        firstName = u.firstName || "";
        lastName = u.lastName || "";
      }

      // 4) Log this login event in `farmer_log`
      await addDoc(collection(db, "farmer_log"), {
        userId: user.uid,
        firstName,
        lastName,
        activity: "Farmer login on website",
        date: serverTimestamp(),
      });

      // 5) Redirect
      navigate("/userdash");
    } catch (error) {
      console.error("Login error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          alert("No user found with this email. Please register first.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format. Please check your email.");
          break;
        default:
          alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <div className="userlogin-container">
      <div className="userlogin-left">
        <div className="userlogin-title-container"></div>
        <div className="userlogin-left-content">
          <h1>Hi there!</h1>
          <p>Welcome to FarmTech. Farmer's Dashboard</p>
          <form onSubmit={handleLogin}>
            <div className="userlogin-left-input">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="userlogin-forgot">
              <Link to="/forgot">
                <h5>Forgot Password?</h5>
              </Link>
            </div>
            <div className="userlogin-button">
              <button type="submit" className="userlogin-login-btn">
                Log In
              </button>
            </div>
          </form>
          <div className="userlogin-noaccount">
            <p>
              Don't have an account?{" "}
              <Link to="/register">
                <span>CLICK HERE</span>
              </Link>
            </p>
          </div>
          <Link to="/usermarket">
            <button>User UI</button>
          </Link>
        </div>
      </div>
      <div className="userlogin-right-content">
        <img
          src={logo}
          alt=""
          style={{ height: "100px", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
