import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import ProfileNavbar from "../components/Navbar";
import { db } from "../firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DefaultPic from "../assets/default-profile.png";

export default function Profile() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});

  const uid = localStorage.getItem("user_uid");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) return;
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        console.log("user data:", snap.data());
        setUserData(snap.data());
        setEditData(snap.data());
      } else {
        console.warn("No user data found for UID:", uid);
      }
    };
    fetchUserData();
  }, [uid]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", uid), editData);
      setUserData(editData);
      setShowEditModal(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <>
      <div className="profile-container">
        <ProfileNavbar />
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-card-content">
              <div className="profile-card-left">
                <div className="profile-card-image">
                  <img src={DefaultPic} alt="Profile" />
                </div>
                <div className="profile-card-info">
                  <h2>
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p>{userData.email}</p>
                  <button onClick={() => setShowEditModal(true)}>
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="profile-card-right">
                <h1>Details: </h1>
                <div className="profile-right-info">
                  <p>{userData.location}</p>
                  <p>{userData.dateOfBirth}</p>
                  <p>{userData.mobileNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="profile-popup">
          <div className="popup-header">
            <h1 style={{ color: "#4c7c2f" }}>Edit Profile</h1>
            <div
              className="popup-close"
              onClick={() => setShowEditModal(false)}
            >
              <h5>X</h5>
            </div>
          </div>
          <div className="profile-section">
            <input
              type="text"
              placeholder="First Name"
              value={editData.firstName || ""}
              onChange={(e) =>
                setEditData({ ...editData, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={editData.lastName || ""}
              onChange={(e) =>
                setEditData({ ...editData, lastName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Email"
              value={editData.email || ""}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              value={editData.location || ""}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={editData.dateOfBirth || ""}
              onChange={(e) =>
                setEditData({ ...editData, dateOfBirth: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={editData.mobileNumber || ""}
              onChange={(e) =>
                setEditData({ ...editData, mobileNumber: e.target.value })
              }
            />
            <button className="profile-btn-save" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
