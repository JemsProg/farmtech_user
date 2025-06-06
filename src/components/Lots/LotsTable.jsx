// src/components/Lots/LotsTable.jsx
import React from "react";

export default function LotsTable({ lots, onViewLot, calculateDaysOld }) {
  return (
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
          {lots.map((lot) => (
            <tr key={lot.id}>
              <td>{lot.lotName}</td>
              <td>{lot.cropType}</td>
              <td>{lot.lotSize} m²</td>
              <td>{calculateDaysOld(lot.plantingDate)}</td>
              <td>
                <button onClick={() => onViewLot(lot)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
