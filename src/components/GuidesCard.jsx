import React from "react";
import { Link } from "react-router-dom";

export default function GuidesCard(props) {
  return (
    <div className="guides-card">
      <div className="guides-card-content">
        <div className="guides-card-image">
          <img src={props.image} alt="" />
          <p>{props.cropName}</p>
        </div>

        <div className="guides-card-button">
          <button>Learn More</button>
        </div>
      </div>
    </div>
  );
}
