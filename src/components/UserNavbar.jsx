import React, { useState } from "react";
import { Link } from "react-router-dom";
import profile from "../images/profile.jpg";
import logo from "../images/newlogo.png";

export default function ProfileNavbar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
    return(
        <>
          <div className="userdash-topnav">
                        <div className="userdash-logo">
                            <img src={logo} alt=""  style={{width:'100px', height:'50px'}}/>
                        </div>
                        <div className="userdash-topnav-buttons">
                        <button className="userdash-topnav-home">Home</button> 
                               <Link to='/userguide'> <button className="userdash-topnav-guides">Guides and Techniques</button></Link>
                        </div>
                        <div className="userdash-topnav-profile">
                            <img src={profile} alt="" onClick={toggleDropdown}/>
                            {dropdownVisible && (
                                    <div className="userdash-dropdown">
                                        <Link to="/userprofile">Profile</Link>
                                        <Link to="/userlogin">Logout</Link>
                                    </div>
                                )}
                        </div>
                    </div>
                    </>
    );
}