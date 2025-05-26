import React from "react";
import {Link} from "react-router-dom";

export default function Cropstlist(props) {
    return (
        <>
             <div className="usermarket-crop-card">
                      <div className="usermarket-card-content">
                               <img src={props.image} alt="" />
                               <h4>{props.cropName}</h4>
                               <p>₱ {props.cropPrice}</p>
                               <Link to ='/userfarms'>
                                 <button>View</button>
                               </Link>
                            </div>
                    </div>
        </>
    );

}