import React, { useState } from "react";
import "../css/Register.css";
import { Link, useNavigate } from "react-router-dom";

import { auth, db, storage } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

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
    confirmPassword: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const mobileRegex = /^(\+63\s?9\d{9})$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      location,
      mobile,
      password,
      confirmPassword,
    } = formData;
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !location.trim() ||
      !mobile.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg("You must agree to the Terms & Conditions to register.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!mobileRegex.test(mobile)) {
      setErrorMsg(
        "Mobile number must start with +63 and follow this format: +63 9XXXXXXXXX"
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let uploadedFileURL = "";
      if (selectedFile) {
        setUploading(true);
        const path = `registration_docs/${user.uid}/${selectedFile.name}`;
        const fileRef = storageRef(storage, path);
        await uploadBytes(fileRef, selectedFile);
        uploadedFileURL = await getDownloadURL(fileRef);
        setUploading(false);
      }

      // ← Here we add status: "pending"
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        location,
        mobile: mobile.trim(),
        status: "Pending",
        createdAt: new Date(),
        ...(uploadedFileURL && { documentationURL: uploadedFileURL }),
      });

      alert(
        "Registration successful! Your account is now pending admin approval."
      );
      navigate("/userlogin");

      console.log("User created:", user.uid);

      if (selectedFile) {
        setUploading(true);

        const path = `registration_docs/${user.uid}/${selectedFile.name}`;
        const fileRef = storageRef(storage, path);

        await uploadBytes(fileRef, selectedFile);

        uploadedFileURL = await getDownloadURL(fileRef);
        console.log("Uploaded file URL:", uploadedFileURL);

        setUploading(false);
      }

      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        location: location,
        mobile: mobile.trim(),
        status: "Pending",
        createdAt: new Date(),
        ...(uploadedFileURL && { documentationURL: uploadedFileURL }),
      });

      console.log("User data saved to Firestore");
      alert("Registration successful!");
      navigate("/userLogin");
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("This email is already registered. Please log in instead.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMsg("Invalid email format. Please check your email address.");
      } else if (error.code === "auth/weak-password") {
        setErrorMsg("Password is too weak. Please choose a stronger one.");
      } else {
        setErrorMsg("Registration failed: " + error.message);
      }

      setUploading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left-container">
        <div className="register-left-title">
          <h1>Get Started</h1>
          <p>
            Welcome to <strong>FarmTech</strong> Farmer's Dashboard
          </p>
        </div>

        <div className="register-left-inputs">
          <form onSubmit={handleRegister} noValidate>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
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
              <option value="General Emilio Aguinaldo">
                General Emilio Aguinaldo
              </option>
              <option value="General Mariano Alvarez">
                General Mariano Alvarez
              </option>
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
              placeholder="Mobile (e.g. +63 9123456789)"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min. 8 chars)"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <label
              htmlFor="documentation"
              style={{
                alignSelf: "flex-start",
                marginTop: "10px",
                fontWeight: "500",
              }}
            >
              Documentation (Image)
            </label>
            <input
              id="documentation"
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={handleTermsChange}
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="terms" style={{ fontSize: "0.9rem" }}>
                I agree to the{" "}
                <a
                  href="#"
                  style={{ color: "#4c6824", textDecoration: "underline" }}
                >
                  Terms & Conditions
                </a>
                .
              </label>
            </div>

            {errorMsg && (
              <div
                style={{
                  color: "red",
                  marginTop: "8px",
                  fontSize: "0.9rem",
                  textAlign: "left",
                  width: "80%",
                }}
              >
                {errorMsg}
              </div>
            )}

            <button
              className="register-btn"
              type="submit"
              disabled={uploading}
              style={{ marginTop: "12px" }}
            >
              {uploading ? "Registering…" : "Register"}
            </button>
          </form>

          <h5 style={{ marginTop: "12px", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link
              to="/userlogin"
              style={{
                color: "#4c6824",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              Log in
            </Link>
          </h5>
        </div>
      </div>

      <div className="register-right-container">
        <img
          src={logo}
          alt="FarmTech Logo"
          style={{ width: "120px", height: "auto", zIndex: 1 }}
        />
      </div>
    </div>
  );
}
