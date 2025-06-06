// src/pages/Lots.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../css/Lots.css";
import LotsNavbar from "../components/Navbar.jsx";
import { db } from "../firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import HarvestModal from "../components/Lots/HarvestModal.jsx";

export default function Lots() {
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

  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
  });

  const [lots, setLots] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLot, setSelectedLot] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [newLot, setNewLot] = useState({
    lotName: "",
    cropType: "",
    lotSize: "",
    cropName: "",
    plantingDate: "",
  });

  const [cropTypes, setCropTypes] = useState([]);
  const [cropSuggestions, setCropSuggestions] = useState([]);

  const [newModification, setNewModification] = useState("");
  const [harvestedKilos, setHarvestedKilos] = useState("");
  const [harvestLogs, setHarvestLogs] = useState([]);

  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", userId));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    })();
  }, [userId]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "crop_type_list"));
        const types = snap.docs.map((d) => d.data().crop_type_name);
        setCropTypes(types);
      } catch (err) {
        console.error("Failed to load crop types:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "lots"), where("userId", "==", userId));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLots(arr);
      setFilteredLots(arr);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  useEffect(() => {
    async function fetchSuggestions() {
      if (!selectedLot || !selectedLot.cropType) {
        setCropSuggestions([]);
        return;
      }
      try {
        const q = query(
          collection(db, "crop_name"),
          where("crop_type_name", "==", selectedLot.cropType)
        );
        const snap = await getDocs(q);
        const suggestions = snap.docs.map((d) => d.data().crop_name);
        setCropSuggestions(suggestions);
      } catch (err) {
        console.error("Failed to fetch crop suggestions:", err);
      }
    }
    fetchSuggestions();
  }, [selectedLot]);

  function calculateDaysOld(plantingDateRaw) {
    if (!plantingDateRaw) return 0;
    return Math.floor(
      (Date.now() - new Date(plantingDateRaw)) / (1000 * 60 * 60 * 24)
    );
  }

  function openAddModal() {
    setShowAddModal(true);
  }
  function closeAddModal() {
    setShowAddModal(false);
    setNewLot({
      lotName: "",
      cropType: "",
      lotSize: "",
      cropName: "",
      plantingDate: "",
    });
  }

  async function addLot() {
    const { lotName, cropType, lotSize } = newLot;
    if (!lotName || !cropType || !lotSize) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Required Fields",
        text: "Please fill out Lot Name, Crop Type, and Lot Size.",
      });
    }
    const sizeNum = parseFloat(lotSize);
    if (isNaN(sizeNum) || sizeNum <= 0) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Lot Size",
        text: "Lot Size must be a positive number.",
      });
    }

    try {
      const lotRef = await addDoc(collection(db, "lots"), {
        userId,
        lotName,
        cropType,
        lotSize: sizeNum,
        cropName: "",
        plantingDate: "",
        modifications: [],
      });

      await addDoc(collection(db, "farmer_log"), {
        userId,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        activity: `Farmer added new lot of ${sizeNum} m² (ID: ${lotRef.id})`,
        date: serverTimestamp(),
      });

      closeAddModal();
      Swal.fire({
        icon: "success",
        title: "Lot Added",
        text: `You have successfully added a new lot (“${lotName}”).`,
      });
    } catch (e) {
      console.error("addLot:", e);
      Swal.fire({
        icon: "error",
        title: "Failed to Add Lot",
        text: "There was an error adding your lot. Please try again.",
      });
    }
  }

  function viewLot(lot) {
    setSelectedLot({ ...lot });
  }
  function closeViewModal() {
    setSelectedLot(null);
    setCropSuggestions([]);
  }

  async function saveLotChanges() {
    if (!selectedLot) return;

    let typedName = (selectedLot.cropName || "").trim();

    if (!cropSuggestions.includes(typedName)) {
      const lowerTyped = typedName.toLowerCase();
      const matches = cropSuggestions.filter((s) =>
        s.toLowerCase().startsWith(lowerTyped)
      );
      if (matches.length === 1) {
        typedName = matches[0];
        setSelectedLot((prev) => ({
          ...prev,
          cropName: matches[0],
        }));
      } else {
        return Swal.fire({
          icon: "warning",
          title: "Invalid Crop Name",
          text: `Please choose a valid crop from the suggestions (or type enough letters so only one suggestion remains).`,
        });
      }
    }

    try {
      await updateDoc(doc(db, "lots", selectedLot.id), {
        cropName: typedName,
        plantingDate: selectedLot.plantingDate,
        modifications: selectedLot.modifications || [],
      });
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: `Lot updated: Crop Name set to “${typedName}”.`,
      });
      closeViewModal();
    } catch (e) {
      console.error("saveLotChanges:", e);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Unable to save your changes. Please try again.",
      });
    }
  }

  async function deleteLot() {
    if (
      !(
        await Swal.fire({
          title: "Delete Lot?",
          text: `Are you sure you want to delete “${selectedLot.lotName}”?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete",
        })
      ).isConfirmed
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "lots", selectedLot.id));
      closeViewModal();
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "The lot has been deleted.",
      });
    } catch (e) {
      console.error("deleteLot:", e);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Unable to delete the lot. Please try again.",
      });
    }
  }

  async function addModification() {
    if (!newModification.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "No Modification Entered",
        text: "Please type a modification before clicking Add.",
      });
    }
    const updated = [...(selectedLot.modifications || []), newModification];
    try {
      await updateDoc(doc(db, "lots", selectedLot.id), {
        modifications: updated,
      });
      setSelectedLot((p) => ({ ...p, modifications: updated }));
      setNewModification("");
      Swal.fire({
        icon: "success",
        title: "Modification Added",
        text: "Your modification has been saved.",
      });
    } catch (e) {
      console.error("addModification:", e);
      Swal.fire({
        icon: "error",
        title: "Failed to Add Modification",
        text: "Unable to add your modification. Please try again.",
      });
    }
  }

  async function handleHarvestSubmit() {
    const kilos = parseFloat(harvestedKilos);
    if (isNaN(kilos) || kilos <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Kilos",
        text: "Please enter a positive number for harvested kilos.",
      });
    }
    const daysOld = selectedLot.plantingDate
      ? calculateDaysOld(selectedLot.plantingDate)
      : 0;

    try {
      await addDoc(collection(db, "harvested_crops"), {
        userId,
        lotId: selectedLot.id,
        lotName: selectedLot.lotName,
        cropName: selectedLot.cropName,
        cropType: selectedLot.cropType,
        lotSize: selectedLot.lotSize,
        harvestedKilos: kilos,
        harvestedDate: new Date().toISOString(),
        plantingDate: selectedLot.plantingDate,
        daysOld,
        modifications: selectedLot.modifications || [],
      });

      await addDoc(collection(db, "farmer_log"), {
        userId,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        activity: `Farmer harvested a crop of ${kilos} kg (Lot ID: ${selectedLot.id})`,
        date: serverTimestamp(),
      });

      await updateDoc(doc(db, "lots", selectedLot.id), {
        cropName: "",
        plantingDate: "",
        modifications: [],
      });

      setHarvestedKilos("");
      setShowHarvestModal(false);
      setSelectedLot(null);

      Swal.fire({
        icon: "success",
        title: "Harvest Recorded",
        text: `You recorded a harvest of ${kilos} kg.`,
      });
    } catch (e) {
      console.error("handleHarvestSubmit:", e);
      Swal.fire({
        icon: "error",
        title: "Failed to Record Harvest",
        text: "Please try again.",
      });
    }
  }

  async function viewHistory() {
    try {
      const q = query(
        collection(db, "harvested_crops"),
        where("lotId", "==", selectedLot.id)
      );
      const snap = await getDocs(q);
      setHarvestLogs(snap.docs.map((d) => d.data()));
      setShowHistoryModal(true);
    } catch (e) {
      console.error("viewHistory:", e);
      Swal.fire({
        icon: "error",
        title: "Failed to Load History",
        text: "Please try again.",
      });
    }
  }

  if (loading) return <div>Loading…</div>;

  return (
    <>
      <div className="lots-container">
        <LotsNavbar />

        <div className="lots-content">
          <h2>Crop Monitoring</h2>

          <input
            className="search-bar"
            placeholder="Enter Lot Name"
            onChange={(e) => {
              const v = e.target.value.toLowerCase();
              setFilteredLots(
                lots.filter((l) => l.lotName.toLowerCase().includes(v))
              );
            }}
          />

          <div className="lots-monitoring-content">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Lot Size</th>
                  <th>Days Old</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLots.map((lot) => (
                  <tr key={lot.id}>
                    <td>{lot.lotName}</td>
                    <td>{lot.cropType}</td>
                    <td>{lot.lotSize} m²</td>
                    <td>{calculateDaysOld(lot.plantingDate)}</td>
                    <td>
                      <button onClick={() => viewLot(lot)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lots-add-lot">
            <button onClick={openAddModal}>Add Lot</button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add a New Lot</h3>

            <input
              type="text"
              placeholder="Enter lot name"
              value={newLot.lotName}
              onChange={(e) =>
                setNewLot((prev) => ({ ...prev, lotName: e.target.value }))
              }
            />

            <select
              value={newLot.cropType}
              onChange={(e) =>
                setNewLot((prev) => ({ ...prev, cropType: e.target.value }))
              }
            >
              <option value="">Select Crop Type</option>
              {cropTypes.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter lot size (m²)"
              value={newLot.lotSize}
              onChange={(e) =>
                setNewLot((prev) => ({ ...prev, lotSize: e.target.value }))
              }
            />

            <div className="lots-buttons">
              <button onClick={addLot}>Create</button>
              <button onClick={closeAddModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedLot && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedLot.lotName}</h3>

            <div className="modal-icons">
              <button className="history-btn" onClick={viewHistory}>
                History
              </button>
              <button className="delete-btn" onClick={deleteLot}>
                Delete
              </button>
              <button className="close-btn" onClick={closeViewModal}>
                Close
              </button>
            </div>

            <label>
              <strong>Name of Crop:</strong>
            </label>
            <input
              type="text"
              list="crop-suggestions"
              value={selectedLot.cropName || ""}
              onChange={(e) =>
                setSelectedLot((prev) => ({
                  ...prev,
                  cropName: e.target.value,
                }))
              }
            />
            <datalist id="crop-suggestions">
              {cropSuggestions.map((name, idx) => (
                <option key={idx} value={name} />
              ))}
            </datalist>

            <label>
              <strong>Date Planted:</strong>
            </label>
            <input
              type="date"
              value={selectedLot.plantingDate || ""}
              onChange={(e) =>
                setSelectedLot((prev) => ({
                  ...prev,
                  plantingDate: e.target.value,
                }))
              }
            />

            <label>
              <strong>Modification History:</strong>
            </label>
            <textarea
              value={(selectedLot.modifications || []).join("\n")}
              onChange={(e) =>
                setSelectedLot((prev) => ({
                  ...prev,
                  modifications: e.target.value.split("\n"),
                }))
              }
            />

            <label>
              <strong>Add a New Modification:</strong>
            </label>
            <input
              type="text"
              value={newModification}
              onChange={(e) => setNewModification(e.target.value)}
            />

            <div className="lots-buttons">
              <button onClick={addModification}>Add Modification</button>
              <button onClick={() => setShowHarvestModal(true)}>
                Crop Harvested
              </button>
              <button onClick={saveLotChanges}>Done</button>
            </div>
          </div>
        </div>
      )}

      <HarvestModal
        show={showHarvestModal}
        selectedLot={selectedLot}
        harvestedKilos={harvestedKilos}
        setHarvestedKilos={setHarvestedKilos}
        calculateDaysOld={calculateDaysOld}
        onSaveHarvest={handleHarvestSubmit}
        onClose={() => setShowHarvestModal(false)}
      />

      {showHistoryModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Harvest History for {selectedLot?.lotName}</h3>
            {harvestLogs.length === 0 ? (
              <p>No records found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Crop Name</th>
                    <th>Date</th>
                    <th>Kilos</th>
                    <th>Days Old</th>
                  </tr>
                </thead>
                <tbody>
                  {harvestLogs.map((log, i) => (
                    <tr key={i}>
                      <td>{log.cropName}</td>
                      <td>{new Date(log.harvestedDate).toLocaleString()}</td>
                      <td>{log.harvestedKilos} kg</td>
                      <td>{log.daysOld} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={() => setShowHistoryModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
