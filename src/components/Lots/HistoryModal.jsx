// src/components/Lots/HistoryModal.jsx
import React from "react";

export default function HistoryModal({ show, harvestLogs, onClose }) {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Harvest History</h3>
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
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
