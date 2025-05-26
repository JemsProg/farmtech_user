import React, { useState } from "react";
import { Link } from "react-router-dom";
import profile from "../images/profile.jpg";
import logo from "../images/newlogo.png";

export default function UserProfileNavbar() {
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
                        <Link to='/usermarket'>   
                         <button className="userdash-topnav-home" style={{backgroundColor:"white", color:"black"}}>Home</button> 
                        </Link>
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