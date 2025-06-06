// src/components/Lots/EditLotModal.jsx
import React from "react";

export default function EditLotModal({
  show,
  selectedLot,
  cropSuggestions,
  onClose,
  onDeleteLot,
  onSaveChanges,
  onAddModification,
  newModification,
  setNewModification,
  openHarvestModal,
  onViewHistory,
}) {
  if (!show || !selectedLot) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        {/* Header */}
        <h3>{selectedLot.lotName}</h3>
        <div className="modal-icons">
          <button className="history-btn" onClick={onViewHistory}>
            History
          </button>
          <button className="delete-btn" onClick={onDeleteLot}>
            Delete
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Name of Crop with datalist suggestions */}
        <label>
          <strong>Name of Crop:</strong>
        </label>
        <input
          type="text"
          list="crop-suggestions"
          value={selectedLot.cropName || ""}
          onChange={(e) =>
            onSaveChanges.handleSetSelectedLotField("cropName", e.target.value)
          }
        />
        <datalist id="crop-suggestions">
          {cropSuggestions.map((name, idx) => (
            <option key={idx} value={name} />
          ))}
        </datalist>

        {/* Date Planted */}
        <label>
          <strong>Date Planted:</strong>
        </label>
        <input
          type="date"
          value={selectedLot.plantingDate || ""}
          onChange={(e) =>
            onSaveChanges.handleSetSelectedLotField(
              "plantingDate",
              e.target.value
            )
          }
        />

        {/* Modification History */}
        <label>
          <strong>Modification History:</strong>
        </label>
        <textarea
          value={(selectedLot.modifications || []).join("\n")}
          onChange={(e) =>
            onSaveChanges.handleSetSelectedLotField(
              "modifications",
              e.target.value.split("\n")
            )
          }
        />

        {/* Add a New Modification */}
        <label>
          <strong>Add a New Modification:</strong>
        </label>
        <input
          type="text"
          value={newModification}
          onChange={(e) => setNewModification(e.target.value)}
        />

        <div className="lots-buttons">
          <button onClick={onAddModification}>Add Modification</button>
          <button onClick={openHarvestModal}>Crop Harvested</button>
          <button onClick={onSaveChanges.saveLotChanges}>Done</button>
        </div>
      </div>
    </div>
  );
}
