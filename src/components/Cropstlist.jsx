import React from "react";
import { Link } from "react-router-dom";

export default function Cropstlist(props) {
    return(
        <>
                 <div className="userdash-crop-type">
                 <img src={props.image} alt="" />
                 <h3>{props.name}</h3>
                 <Link to='/guides'>
                    <button>View</button>
                 </Link>
                 </div>
        </>
    );
}