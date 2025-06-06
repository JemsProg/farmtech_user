// src/pages/Landing.jsx
import React, { useEffect } from "react";
import "../css/Landing.css";
import { Link, useNavigate } from "react-router-dom";
import Team from "../images/Team.png";
import Aboutus1 from "../images/Aboutus1.png";
import Project from "../images/Project.png";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // If a farmer is already logged in (user_uid in localStorage), redirect to dashboard
    const uid = localStorage.getItem("user_uid");
    if (uid) {
      navigate("/userdash", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="landing-container">
      <div className="landing-topbar">
        <div className="landing-logo">
          <p>FarmTech</p>
        </div>
        <div className="landing-header-button">
          <button
            className="landing-button-home"
            onClick={() =>
              document
                .getElementById("home")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Home
          </button>
          <button
            className="landing-button-about"
            onClick={() =>
              document
                .getElementById("about-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            About Us
          </button>
          <button
            className="landing-button-project"
            onClick={() =>
              document
                .getElementById("project")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Project
          </button>
          <button
            className="landing-button-contact"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Contact Us
          </button>
        </div>

        <div className="landing-contact">
          <Link to="/userlogin">
            <button className="landing-button-login">Login</button>
          </Link>
        </div>
      </div>

      <div className="landing-content">
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>AGRICULTURE</h1>
            <p>Helping Farmers, Cultivating the Culture!</p>
          </div>
          <div className="scroll-down"></div>
        </section>

        <section className="goal" id="about-section">
          <div className="goal-icon"></div>
          <h2>Our Goal</h2>
          <p>
            We are committed to empowering farmers by providing innovative
            solutions that enhance productivity, sustainability, and
            profitability. With a deep understanding of agriculture's
            challenges, we offer tailored resources, tools, and support to help
            farmers thrive in today's ever-changing landscape. Together, we
            cultivate growth, innovation, and a brighter future for farming
            communities everywhere.
          </p>
        </section>

        <section className="about" id="about">
          <div className="about-content">
            <div className="about-image">
              <img src={Team} alt="About Us" />
            </div>
          </div>
        </section>

        <section className="about2" id="team">
          <div className="about2-content">
            <div className="about2-image">
              <img src={Aboutus1} alt="About Us" />
            </div>
          </div>
        </section>

        <section className="project" id="project">
          <div className="project-content">
            <div className="project-image">
              <img src={Project} alt="Project" />
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-content">
            <h2>Contact Us</h2>
            <p>Feel free to reach out to us!</p>
            <p>Email: contact@farmassist.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </section>
      </div>
    </div>
  );
}
