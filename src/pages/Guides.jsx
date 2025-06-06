import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GuidesNavbar from "../components/Navbar.jsx";
import GuidesCard from "../components/GuidesCard";
import "../css/Guides.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

export default function Guides() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    if (!uid) {
      navigate("/", { replace: true });
      return;
    }

    setUserId(uid);
  }, [navigate]);

  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    async function loadGuides() {
      const snap = await getDocs(collection(db, "guide_data"));
      const data = snap.docs.map((d) => {
        const payload = d.data();
        console.log("Loaded guide PDF URL:", d.id, payload.pdfURL);
        return { id: d.id, ...payload };
      });
      setGuides(data);
    }
    loadGuides();
  }, []);

  return (
    <>
      <div className="guides-container">
        <GuidesNavbar />

        <div className="guides-content">
          <h3>Guides and Techniques</h3>
          <div className="guides-cards-list">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="guides-card-wrapper"
                onClick={() => {
                  console.log("Opening guide:", guide.id, guide.pdfURL);
                  setSelectedGuide(guide);
                }}
              >
                <GuidesCard
                  image={guide.imgURL}
                  cropName={<span className="crop-name">{guide.title}</span>}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedGuide && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setSelectedGuide(null)}
            >
              ×
            </button>

            <h3>{selectedGuide.title}</h3>
            <p>
              <strong>Crop Type:</strong> {selectedGuide.crop_type}
            </p>
            <p>
              <strong>Description:</strong> {selectedGuide.description}
            </p>
            <p>
              <strong>Date Created:</strong>{" "}
              {selectedGuide.createdAt?.toDate
                ? selectedGuide.createdAt.toDate().toLocaleDateString()
                : new Date(selectedGuide.createdAt).toLocaleDateString()}
            </p>

            {/* force remount on each open by giving object a new key */}
            <object
              key={selectedGuide.id}
              data={selectedGuide.pdfURL}
              type="application/pdf"
              width="100%"
              height="600"
            >
              <p>
                PDF can’t be displayed.{" "}
                <a
                  href={selectedGuide.pdfURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </p>
            </object>
          </div>
        </div>
      )}
    </>
  );
}
