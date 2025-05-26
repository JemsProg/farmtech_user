import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../images/profile.jpg";
import logo from "../images/newlogo.png";
import "../css/Navbar.css";

export default function Navbar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // NEW
    const navigate = useNavigate(); // NEW

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLogoutClick = (e) => {
        e.preventDefault(); // Prevent immediate navigation
        setShowLogoutModal(true); // Open modal
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        navigate("/userlogin"); // Redirect to logout
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={logo} alt="Logo" style={{ width: '100px', height: '50px' }} />
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
                <img src={profile} alt="Profile" onClick={toggleDropdown} className="sidebar-profile-img" />
                {dropdownVisible && (
                    <div className="sidebar-dropdown">
                        <Link to="/profile">Profile</Link>
                        <a href="/userlogin" onClick={handleLogoutClick}>Logout</a> {/* Intercepted */}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to log out?</p>
                        <div className="modal-buttons">
                            <button className="btn cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="btn confirm" onClick={confirmLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
