import React, { useState, useEffect } from "react";
import "../css/UserLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase.js";
import logo from "../images/newlogo.png";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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
    const uid = localStorage.getItem("user_uid");
    if (uid) navigate("/userdash", { replace: true });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) {
        await signOut(auth);
        return Swal.fire({
          icon: "error",
          title: "No Profile Found",
          text: "Please register first.",
        });
      }
      const profile = userSnap.data();
      const status = profile.status || "Pending";

      if (status === "Pending") {
        await signOut(auth);
        return Swal.fire({
          icon: "info",
          title: "Pending Approval",
          text: "Your account is still pending approval. Please check back later.",
        });
      }
      if (status === "Denied") {
        await signOut(auth);
        return Swal.fire({
          icon: "error",
          title: "Account Denied",
          text: "Your account has been denied. Please contact the administrator.",
        });
      }

      localStorage.setItem("user_uid", user.uid);
      await addDoc(collection(db, "farmer_log"), {
        userId: user.uid,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        activity: "Farmer login on website",
        date: serverTimestamp(),
      });

      navigate("/userdash");
    } catch (error) {
      console.error("Login error:", error);
      let title = "Login failed";
      let text = error.message;
      let icon = "error";

      switch (error.code) {
        case "auth/user-not-found":
          title = "No User Found";
          text = "Please register first.";
          break;
        case "auth/wrong-password":
          title = "Wrong Password";
          text = "Please try again.";
          break;
        case "auth/invalid-email":
          title = "Invalid Email";
          text = "Please check your email format.";
          break;
      }

      Swal.fire({ icon, title, text });
    }
  };

  return (
    <div className="userlogin-container">
      <div className="userlogin-left">
        <div className="userlogin-title-container" />
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
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
          alt="FarmTech Logo"
          style={{ height: "100px", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
