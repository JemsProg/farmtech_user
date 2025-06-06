// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../images/profile.jpg";
import logo from "../images/newlogo.png";
import "../css/Navbar.css";

// Firestore & Auth imports
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase.js";

export default function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  // ────────────────────────────────────────────────────────────────────────────
  // 1) On mount: load firstName/lastName for the current user (from Firestore)
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    if (!uid) return; // If no UID is stored, we won’t attempt to fetch

    (async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const d = userSnap.data();
          setUserProfile({
            firstName: d.firstName || "",
            lastName: d.lastName || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user profile in Navbar:", err);
      }
    })();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((v) => !v);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 2) When “Logout” is confirmed: write a log, clear localStorage, sign out,
  //    then navigate to /userlogin
  // ────────────────────────────────────────────────────────────────────────────
  const confirmLogout = async () => {
    setShowLogoutModal(false);

    try {
      const uid = localStorage.getItem("user_uid");
      // 2a) Write the logout action to Firestore (farmer_log collection)
      await addDoc(collection(db, "farmer_log"), {
        userId: uid,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        activity: "Farmer has logged out",
        date: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to log logout action:", err);
    }

    // 2b) Clear localStorage so protected pages can’t be accessed
    localStorage.removeItem("user_uid");

    // 2c) (Optional) Also sign out from Firebase Auth
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Warning: Firebase signOut failed:", err);
    }

    // 2d) Finally, redirect to the login page
    navigate("/userlogin", { replace: true });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" style={{ width: "100px", height: "50px" }} />
      </div>

      <div className="sidebar-links">
        <Link to="/userdash">
          <button className="sidebar-btn">Home</button>
        </Link>
        <Link to="/crop-records">
          <button className="sidebar-btn">Crop Records</button>
        </Link>
        <Link to="/lots">
          <button className="sidebar-btn">Lots</button>
        </Link>
        <Link to="/guides">
          <button className="sidebar-btn">Guides and Techniques</button>
        </Link>
      </div>

      <div className="sidebar-profile">
        <img
          src={profile}
          alt="Profile"
          onClick={toggleDropdown}
          className="sidebar-profile-img"
        />
        {dropdownVisible && (
          <div className="sidebar-dropdown">
            <Link to="/profile">Profile</Link>
            <a href="#logout" onClick={handleLogoutClick}>
              Logout
            </a>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button
                className="btn cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button className="btn confirm" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
