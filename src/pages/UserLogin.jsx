import React, { useState } from "react";
import "../css/UserLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../images/newlogo.png";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 🔐 Store UID in localStorage
      localStorage.setItem("user_uid", user.uid);

      navigate("/userdash");
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/user-not-found") {
        alert("No user found with this email. Please register first.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format. Please check your email.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <>
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
    </>
  );
}
