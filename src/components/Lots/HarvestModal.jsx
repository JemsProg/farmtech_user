// src/components/Lots/HarvestModal.jsx
import React from "react";

export default function HarvestModal({
  show,
  selectedLot,
  harvestedKilos,
  setHarvestedKilos,
  calculateDaysOld,
  onSaveHarvest,
  onClose,
}) {
  if (!show || !selectedLot) return null;

  return (
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
          <button onClick={onSaveHarvest}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
