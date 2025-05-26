import React, { useState } from "react";
import { Link } from "react-router-dom";
import profile from "../images/profile.jpg";
import logo from "../images/newlogo.png";
import "../css/Navbar.css";

export default function Navbar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
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
                        <Link to="/userlogin">Logout</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
