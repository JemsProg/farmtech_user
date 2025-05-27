// src/pages/Lots.jsx
import React, { useState, useEffect } from "react";
import "../css/Lots.css";
import LotsNavbar from "../components/Navbar.jsx";
import { auth, db } from "../firebase";
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

export default function Lots() {
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
  });

  const [lots, setLots] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / form state
  const [selectedLot, setSelectedLot] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // form fields
  const [newLot, setNewLot] = useState({
    lotName: "",
    cropType: "",
    lotSize: "",
    cropName: "",
    plantingDate: "",
  });
  const [cropTypes, setCropTypes] = useState([]);
  const [newModification, setNewModification] = useState("");
  const [harvestedKilos, setHarvestedKilos] = useState("");
  const [harvestLogs, setHarvestLogs] = useState([]);

  // 1) load userId
  useEffect(() => {
    const uid = localStorage.getItem("user_uid");
    setUserId(uid);
  }, []);

  // 2) fetch user profile (for logging)
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const userSnap = await getDoc(doc(db, "users", userId));
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
        });
      }
    })();
  }, [userId]);

  // 3) load crop types
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "crop_type_list"));
      setCropTypes(snap.docs.map((d) => d.data().crop_type_name));
    })();
  }, []);

  // 4) realtime load lots
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

  // helper: days old
  function calculateDaysOld(plantingDate) {
    if (!plantingDate) return 0;
    return Math.floor(
      (Date.now() - new Date(plantingDate)) / (1000 * 60 * 60 * 24)
    );
  }

  // Add Lot
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
    const { lotName, cropType, lotSize, cropName, plantingDate } = newLot;
    if (!lotName || !cropType || !lotSize) {
      return alert("Fill all required fields");
    }
    const sizeNum = parseFloat(lotSize);
    if (isNaN(sizeNum) || sizeNum <= 0) {
      return alert("Invalid lot size");
    }

    try {
      // 1. add the lot
      await addDoc(collection(db, "lots"), {
        userId,
        lotName,
        cropType,
        lotSize: sizeNum,
        cropName: cropName || "",
        plantingDate: plantingDate || "",
        modifications: [],
      });

      // 2. log the action
      await addDoc(collection(db, "farmer_log"), {
        userId,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        activity: `Farmer added new lot of ${sizeNum} m²`,
        date: serverTimestamp(),
      });

      closeAddModal();
    } catch (e) {
      console.error("addLot:", e);
      alert("Failed to add lot");
    }
  }

  // View / Edit
  function viewLot(lot) {
    setSelectedLot(lot);
  }
  function closeViewModal() {
    setSelectedLot(null);
  }
  async function saveLotChanges() {
    if (!selectedLot) return;
    try {
      await updateDoc(doc(db, "lots", selectedLot.id), {
        cropName: selectedLot.cropName,
        plantingDate: selectedLot.plantingDate,
        modifications: selectedLot.modifications || [],
      });
      alert("Saved changes");
      closeViewModal();
    } catch (e) {
      console.error("saveLotChanges:", e);
      alert("Failed to save changes");
    }
  }
  async function deleteLot() {
    if (!window.confirm("Delete this lot?")) return;
    try {
      await deleteDoc(doc(db, "lots", selectedLot.id));
      closeViewModal();
    } catch (e) {
      console.error("deleteLot:", e);
      alert("Delete failed");
    }
  }

  // Modifications
  async function addModification() {
    if (!newModification.trim()) return alert("Enter a modification");
    const updated = [...(selectedLot.modifications || []), newModification];
    try {
      await updateDoc(doc(db, "lots", selectedLot.id), {
        modifications: updated,
      });
      setSelectedLot((p) => ({ ...p, modifications: updated }));
      setNewModification("");
    } catch (e) {
      console.error("addModification:", e);
      alert("Failed to add modification");
    }
  }

  // Harvest
  function openHarvestModal() {
    setShowHarvestModal(true);
  }
  function closeHarvestModal() {
    setShowHarvestModal(false);
    setHarvestedKilos("");
  }
  async function handleHarvestSubmit() {
    const kilos = parseFloat(harvestedKilos);
    if (isNaN(kilos) || kilos <= 0) return alert("Invalid kilos");
    const daysOld = selectedLot.plantingDate
      ? calculateDaysOld(selectedLot.plantingDate)
      : 0;

    try {
      // 1. record harvest
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

      // 2. log the action
      await addDoc(collection(db, "farmer_log"), {
        userId,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        activity: `Farmer harvested a crop of ${kilos} kg`,
        date: serverTimestamp(),
      });

      closeHarvestModal();
      closeViewModal();
    } catch (e) {
      console.error("handleHarvestSubmit:", e);
      alert("Failed to record harvest");
    }
  }

  // History
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
      alert("Failed to load history");
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

      {/* ——— Add Lot Modal ——— */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add a New Lot</h3>
            <input
              type="text"
              placeholder="Enter lot name"
              value={newLot.lotName}
              onChange={(e) =>
                setNewLot((n) => ({ ...n, lotName: e.target.value }))
              }
            />
            <select
              value={newLot.cropType}
              onChange={(e) =>
                setNewLot((n) => ({ ...n, cropType: e.target.value }))
              }
            >
              <option value="">Select Crop Type</option>
              {cropTypes.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter lot size (m²)"
              value={newLot.lotSize}
              onChange={(e) =>
                setNewLot((n) => ({ ...n, lotSize: e.target.value }))
              }
            />
            <div className="lots-buttons">
              <button onClick={addLot}>Create</button>
              <button onClick={closeAddModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ——— View/Edit Lot Modal ——— */}
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
              value={selectedLot.cropName || ""}
              onChange={(e) =>
                setSelectedLot((p) => ({ ...p, cropName: e.target.value }))
              }
            />

            <label>
              <strong>Date Planted:</strong>
            </label>
            <input
              type="date"
              value={selectedLot.plantingDate || ""}
              onChange={(e) =>
                setSelectedLot((p) => ({ ...p, plantingDate: e.target.value }))
              }
            />

            <label>
              <strong>Modification History:</strong>
            </label>
            <textarea
              value={(selectedLot.modifications || []).join("\n")}
              onChange={(e) =>
                setSelectedLot((p) => ({
                  ...p,
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
              <button onClick={openHarvestModal}>Crop Harvested</button>
              <button onClick={saveLotChanges}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ——— Harvest Modal ——— */}
      {showHarvestModal && selectedLot && (
        <div className="modal">
          <div className="modal-content">
            <h3>Record Harvest for {selectedLot.lotName}</h3>

            <label>
              <strong>Harvested Kilos:</strong>
            </label>
            <input
              type="number"
              placeholder="Enter kilos harvested"
              value={harvestedKilos}
              onChange={(e) => setHarvestedKilos(e.target.value)}
            />

            <p>
              <strong>Harvest Date:</strong> {new Date().toLocaleString()}
            </p>
            <p>
              <strong>Days Old:</strong>{" "}
              {selectedLot.plantingDate
                ? calculateDaysOld(selectedLot.plantingDate)
                : "N/A"}
            </p>

            <div className="lots-buttons">
              <button onClick={handleHarvestSubmit}>Save</button>
              <button onClick={closeHarvestModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ——— Harvest History Modal ——— */}
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
                    <th>Date</th>
                    <th>Kilos</th>
                    <th>Days Old</th>
                  </tr>
                </thead>
                <tbody>
                  {harvestLogs.map((log, i) => (
                    <tr key={i}>
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
