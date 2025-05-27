// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../images/profile.jpg";
import logo from "../images/newlogo.png";
import "../css/Navbar.css";

import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";

export default function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  // load farmer name for logging
  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    if (!uid) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const d = snap.data();
        setUserProfile({
          firstName: d.firstName || "",
          lastName: d.lastName || "",
        });
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

  const confirmLogout = async () => {
    setShowLogoutModal(false);

    try {
      const uid = localStorage.getItem("user_uid");
      // write the logout action
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

    // clear out any stored uid if you like:
    // localStorage.removeItem("user_uid");

    navigate("/userlogin");
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
