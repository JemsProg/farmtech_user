import React from "react";

export default function FarmsCard(props) {
    return (
        <>
             <div className="userfarms-farms-card">
                                <div className="userfarms-farms-content">
                                <img src={props.image} alt="" />
                                <h4>{props.farmName}</h4>
                                <p>{props.farmLocation}</p>
                                <button>Get Location</button>
                            </div>
                        </div>
        </>
    )
}