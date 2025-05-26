import React, { useState } from "react";
import "../css/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import logo from "../images/newlogo.png";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        location: "",
        mobile: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;
    
            console.log("User created:", user.uid);
    
            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                location: formData.location,
                mobile: formData.mobile,
                createdAt: new Date(),
            });
    
            console.log("User data saved to Firestore");
    
            alert("Registration successful!");
    
            // Automatically log in the user and redirect to dashboard
            navigate("/userdash");
        } catch (error) {
            console.error("Error during registration:", error);
            if (error.code === "auth/email-already-in-use") {
                alert("This email is already in use. Please log in.");
            } else if (error.code === "auth/invalid-email") {
                alert("Invalid email format. Please check your email.");
            } else if (error.code === "auth/weak-password") {
                alert("Password is too weak. Please use a stronger password.");
            } else {
                alert("Registration failed: " + error.message);
            }
        }
    };

    return (
        <>
            <div className="register-container">
                <div className="register-left-container">
                    <div className="register-left-title"></div>
                    <h1>Get Started</h1>
                    <p style={{ marginTop: "10px" }}>
                        Welcome to <span>Farm</span>Tech. Farmer's Dashboard
                    </p>
                    <div className="register-left-inputs">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        >
                            <option value="" disabled>
                                Location
                            </option>
                            <option value="Alfonso">Alfonso</option>
                            <option value="Amadeo">Amadeo</option>
                            <option value="Bacoor">Bacoor</option>
                            <option value="Carmona">Carmona</option>
                            <option value="Cavite City">Cavite City</option>
                            <option value="Dasmariñas">Dasmariñas</option>
                            <option value="General Emilio Aguinaldo">General Emilio Aguinaldo</option>
                            <option value="General Mariano Alvarez">General Mariano Alvarez</option>
                            <option value="General Trias">General Trias</option>
                            <option value="Imus">Imus</option>
                            <option value="Indang">Indang</option>
                            <option value="Kawit">Kawit</option>
                            <option value="Magallanes">Magallanes</option>
                            <option value="Maragondon">Maragondon</option>
                            <option value="Mendez">Mendez</option>
                            <option value="Naic">Naic</option>
                            <option value="Noveleta">Noveleta</option>
                            <option value="Rosario">Rosario</option>
                            <option value="Silang">Silang</option>
                            <option value="Tagaytay">Tagaytay</option>
                            <option value="Tanza">Tanza</option>
                            <option value="Ternate">Ternate</option>
                            <option value="Trece Martires">Trece Martires</option>
                        </select>
                        <input
                            type="text"
                            name="mobile"
                            placeholder="Mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button className="register-btn" onClick={handleRegister}>
                            Register
                        </button>
                        <h5>
                            Already have an account?{" "}
                            <Link to="/userlogin">
                                <span>Log in</span>
                            </Link>
                        </h5>
                    </div>
                </div>

                <div className="register-right-container">
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