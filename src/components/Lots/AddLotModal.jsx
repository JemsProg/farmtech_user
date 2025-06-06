// src/components/Lots/AddLotModal.jsx
import React from "react";

export default function AddLotModal({
  show,
  onClose,
  cropTypes,
  newLot,
  setNewLot,
  onAddLot,
}) {
  if (!show) return null;

  return (
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
          <button onClick={onAddLot}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
