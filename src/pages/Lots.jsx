import React, { useState, useEffect } from "react";
import "../css/Lots.css";
import LotsNavbar from "../components/Navbar.jsx";
import { auth, db } from "../firebase"; // Ensure Firebase is initialized
import {
  collection,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

export default function Lots() {
  const [userId, setUserId] = useState("");
  const [lots, setLots] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState(null); // For the View modal
  const [showAddModal, setShowAddModal] = useState(false); // For Add Lot modal
  const [showHarvestModal, setShowHarvestModal] = useState(false); // For Crop Harvested modal
  const [harvestedKilos, setHarvestedKilos] = useState(""); // For harvested kilos input
  const [newModification, setNewModification] = useState(""); // For new modification input
  const [newLot, setNewLot] = useState({
    lotName: "",
    cropType: "",
    lotSize: "",
    cropName: "",
    plantingDate: "",
  });
  const [cropTypes, setCropTypes] = useState([]);
  const [harvestedDate, setHarvestedDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [harvestLogs, setHarvestLogs] = useState([]);

  // Fetch user data
  useEffect(() => {
    const storedUid = localStorage.getItem("user_uid");
    if (storedUid) {
      setUserId(storedUid);
    } else {
      setUserId(null); // Trigger loading complete even if not logged in
    }
  }, []);

  useEffect(() => {
    const fetchCropTypes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "crop_type_list"));
        const types = snapshot.docs.map((doc) => doc.data().crop_type_name);

        setCropTypes(types);
      } catch (error) {
        console.error("Failed to fetch crop types:", error);
      }
    };

    fetchCropTypes();
  }, []);

  // Fetch lots data
  useEffect(() => {
    if (userId) {
      const q = query(collection(db, "lots"), where("userId", "==", userId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const lotsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLots(lotsData);
        setFilteredLots(lotsData); // Initialize filtered lots
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  // Calculate days old
  const calculateDaysOld = (plantingDateRaw) => {
    if (!plantingDateRaw) return 0;

    const plantingDate = new Date(plantingDateRaw);
    const now = new Date();
    const daysDifference = Math.abs(
      Math.floor((now - plantingDate) / (1000 * 60 * 60 * 24))
    );

    return daysDifference;
  };

  // Open the View modal
  const viewLot = (lot) => {
    setSelectedLot(lot);
  };

  // Close the View modal
  const closeViewModal = () => {
    setSelectedLot(null);
  };

  // Open the Add Lot modal
  const openAddModal = () => {
    setShowAddModal(true);
  };

  // Close the Add Lot modal
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewLot({
      lotName: "",
      cropType: "",
      lotSize: "",
      cropName: "",
      plantingDate: "",
    });
  };

  // Add a new lot
  const addLot = async () => {
    const { lotName, cropType, lotSize, cropName, plantingDate } = newLot;

    if (!lotName || !cropType || !lotSize) {
      alert("Please fill in all fields");
      return;
    }

    const parsedLotSize = parseFloat(lotSize);
    if (isNaN(parsedLotSize) || parsedLotSize <= 0) {
      alert("Enter a valid lot size");
      return;
    }

    try {
      await addDoc(collection(db, "lots"), {
        userId: userId, // ✅ ensure this comes from localStorage
        lotName: lotName,
        cropType: cropType,
        lotSize: parsedLotSize,
        cropName: cropName || "", // optional field fallback
        plantingDate: plantingDate || "", // optional field fallback
        modifications: [], // ✅ initialize as empty array
      });

      alert("Lot added successfully");
      closeAddModal();
    } catch (error) {
      console.error("Error adding lot:", error);
      alert("Error adding lot");
    }
  };

  const addModification = async () => {
    if (!newModification.trim()) {
      alert("Please enter a modification.");
      return;
    }

    try {
      const updatedModifications = [
        ...(selectedLot.modifications || []),
        newModification,
      ];

      await updateDoc(doc(db, "lots", selectedLot.id), {
        modifications: updatedModifications,
      });

      setSelectedLot((prev) => ({
        ...prev,
        modifications: updatedModifications,
      }));

      setNewModification(""); // Clear the input field
      alert("Modification added successfully!");
    } catch (error) {
      console.error("Error adding modification:", error);
      alert("Error adding modification.");
    }
  };

  // Open the Harvest Modal
  const openHarvestModal = () => {
    setShowHarvestModal(true);
  };

  // Close the Harvest Modal
  const closeHarvestModal = () => {
    setShowHarvestModal(false);
    setHarvestedKilos(""); // Reset the input field
  };

  // Handle the harvested kilos submission
  const handleHarvestSubmit = async () => {
    const kilos = parseFloat(harvestedKilos);
    if (isNaN(kilos) || kilos <= 0) return alert("Invalid kilos");

    const daysOld = selectedLot.plantingDate
      ? Math.floor(
          (new Date() - new Date(selectedLot.plantingDate)) /
            (1000 * 60 * 60 * 24)
        )
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

      alert("Harvest recorded successfully!");
      closeHarvestModal();
      closeViewModal();
    } catch (error) {
      console.error("Error saving harvested crop data:", error);
      alert("Failed to record harvest.");
    }
  };

  // Delete a lot
  const deleteLot = async () => {
    if (window.confirm("Are you sure you want to delete this lot?")) {
      try {
        await deleteDoc(doc(db, "lots", selectedLot.id));
        alert("Lot deleted successfully!");
        closeViewModal();
      } catch (error) {
        console.error("Error deleting lot:", error);
        alert("Error deleting lot.");
      }
    }
  };

  const saveLotChanges = async () => {
    if (!selectedLot) return;

    try {
      await updateDoc(doc(db, "lots", selectedLot.id), {
        cropName: selectedLot.cropName,
        plantingDate: selectedLot.plantingDate,
        modifications: selectedLot.modifications || [],
      });

      alert("Lot changes saved successfully.");
      closeViewModal();
    } catch (error) {
      console.error("Error saving lot changes:", error);
      alert("Failed to save changes.");
    }
  };

  // View history (placeholder functionality)
  const viewHistory = async () => {
    try {
      const q = query(
        collection(db, "harvested_crops"),
        where("lotId", "==", selectedLot.id)
      );
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map((doc) => doc.data());
      setHarvestLogs(logs);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Error fetching history:", error);
      alert("Failed to load history.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="lots-container">
        <LotsNavbar />
        <div className="lots-content">
          <h2>Crop Monitoring</h2>
          <input
            type="text"
            placeholder="Enter Lot Name"
            onChange={(e) => {
              const searchValue = e.target.value.toLowerCase();
              const filtered = lots.filter((lot) =>
                lot.lotName.toLowerCase().includes(searchValue)
              );
              setFilteredLots(filtered);
            }}
            className="search-bar"
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

      {/* View Lot Modal */}
      {selectedLot && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedLot.lotName}</h3>
            <div className="modal-icons">
              <button onClick={viewHistory} title="View History">
                History
              </button>
              <button onClick={deleteLot} title="Delete Lot">
                Delete
              </button>

              <button onClick={closeViewModal}>Close</button>
            </div>
            <label>
              <strong>Name of Crop:</strong>
            </label>
            <input
              type="text"
              placeholder="e.g., 'Tomatoes'"
              value={selectedLot.cropName || ""}
              onChange={(e) =>
                setSelectedLot((prev) => ({
                  ...prev,
                  cropName: e.target.value,
                }))
              }
            />
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
              placeholder="Enter modification history"
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
              placeholder="Enter a new modification"
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

      {/* Crop Harvested Modal */}
      {showHarvestModal && selectedLot && (
        <div className="modal">
          <div className="modal-content">
            <h3>Record Harvest for {selectedLot.lotName}</h3>

            <label>
              <strong>Harvested Kilos:</strong>
            </label>
            <input
              type="number"
              value={harvestedKilos}
              onChange={(e) => setHarvestedKilos(e.target.value)}
              placeholder="Enter kilos harvested"
            />

            <p>
              <strong>Harvest Date:</strong> {new Date().toLocaleString()}
            </p>

            <p>
              <strong>Days Old:</strong>{" "}
              {selectedLot.plantingDate
                ? Math.floor(
                    (new Date(harvestedDate) -
                      new Date(selectedLot.plantingDate)) /
                      (1000 * 60 * 60 * 24)
                  )
                : "N/A"}
            </p>

            <div className="lots-buttons">
              <button onClick={handleHarvestSubmit}>Save</button>
              <button onClick={closeHarvestModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lot Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add a New Lot</h3>
            <input
              type="text"
              placeholder="Enter lot name"
              value={newLot.lotName}
              onChange={(e) =>
                setNewLot({ ...newLot, lotName: e.target.value })
              }
            />
            <select
              value={newLot.cropType}
              onChange={(e) =>
                setNewLot({ ...newLot, cropType: e.target.value })
              }
            >
              <option value="">Select Crop Type</option>
              {cropTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter lot size (per sqm)"
              value={newLot.lotSize}
              onChange={(e) =>
                setNewLot({ ...newLot, lotSize: e.target.value })
              }
            />
            <div className="lots-buttons">
              <button onClick={addLot}>Create</button>
              <button onClick={closeAddModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Harvest History for {selectedLot?.lotName}</h3>
            {harvestLogs.length === 0 ? (
              <p>No harvest records found.</p>
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
                  {harvestLogs.map((log, index) => (
                    <tr key={index}>
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
