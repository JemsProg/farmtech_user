import React, { useState } from "react";
import UserProfileNavbar from "../../components/UserProfileNavbar";
import ProfilePic from "../../images/profile.jpg";

export default function UserProfile() {
        const [showEditModal, setShowEditModal] = useState(false);
    return(
        <>
            <div className="userprofile-container">
                <UserProfileNavbar   
                />

                   <div className="profile-content">
                                      <div className="profile-card">
                                          <div className="profile-card-content">
                                              <div className="profile-card-left">
                                                  <div className="profile-card-image">
                                                      <img src={ProfilePic} alt="" />
                                                  </div>
                                                  <div className="profile-card-info">
                                                      <h2>Jerome Gravillo</h2>
                                                      <p>gravillojt@gmail.com</p>
                                                      <button onClick={() => setShowEditModal(true)}>Edit Profile</button>
                                                  </div>
                                              </div>
                                              <div className="profile-card-right">
                                                  <h1>Member Since</h1>
                                                  <div className="profile-right-info">
                                                      <p>Dasmariñas, Cavite</p>
                                                      <p>Feb 01, 2004</p>
                                                      <p>09922209911</p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                  
                              {showEditModal && (
                                  <div className="profile-popup">
                                      <div className="popup-header">
                                          <h1 style={{ color: "#4c7c2f" }}>Profile</h1>
                                          <div className="popup-close" onClick={() => setShowEditModal(false)}>
                                              <h5>X</h5>
                                          </div>
                                      </div>
                                      <p>Edit your account information here.</p>
                                      <div className="profile-section">
                                          <img src={ProfilePic} alt="Profile Picture" />
                                          <button className="profile-btn-change">Change Picture</button>
                                          <button className="profile-btn-delete">Delete Picture</button>
                                          <div className="user-fullname">
                                              <input type="text" placeholder="First Name" style={{ width: "195px" }} />
                                              <input type="text" placeholder="Last Name" style={{ width: "195px" }} />
                                          </div>
                                          <input type="text" placeholder="Email" />
                                          <input type="email" placeholder="Location" />
                                          <input type="text" placeholder="Date of Birth" />
                                          <input type="text" placeholder="Mobile Number" />
                                          <input type="text" placeholder="Password" />
                                          <input type="text" placeholder="Re-enter Password" />
                                          <button className="profile-btn-save" onClick={() => setShowEditModal(false)}>Save Changes</button>
                                      </div>
                                  </div>
                              )}
                          </>
                      );
                  }