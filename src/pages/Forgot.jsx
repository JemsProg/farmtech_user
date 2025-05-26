import React, { useState } from "react";
import "../css/Forgot.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../images/newlogo.png";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handlePasswordReset = async () => {
        if (!email.trim()) {
            setMessage("Please enter your email address.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("A password reset link has been sent to your email.");
        } catch (error) {
            console.error("Error sending password reset email:", error);
            if (error.code === "auth/user-not-found") {
                setMessage("No user found with this email address.");
            } else if (error.code === "auth/invalid-email") {
                setMessage("Invalid email address. Please try again.");
            } else {
                setMessage("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <>
            <div className="forgot-container">
                <div className="forgot-left">
                    <div className="forgot-title-container">
                        <div className="forgot-back-button" onClick={() => window.history.back()}>
                            ← Back
                        </div>
                    </div>
                    <div className="forgot-left-content">
                        <h1>Forgot Password?</h1>
                        <p>Enter your email address to reset your password</p>
                        <div className="forgot-left-input">
                            <input
                                type="email"
                                placeholder="Enter your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="forgot-button">
                            <button className="forgot-reset-btn" onClick={handlePasswordReset}>
                                Verify
                            </button>
                        </div>
                        {message && <p className="forgot-message">{message}</p>}
                    </div>
                </div>
                <div className="forgot-right">
                    <img src={logo} alt="Logo" style={{ height: "100px", objectFit: "contain" }} />
                </div>
            </div>
        </>
    );
}