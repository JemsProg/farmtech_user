import React from "react";
import { Link } from "react-router-dom";

export default function UserGuidesCard(props) {
    return(
        <>
            <div className="userguides-guides-card">
                            <div className="userguides-card-content">
                                <div className="userguides-card-image">
                                    <img src={props.image} alt="" />
                                </div>
                                <div className="userguides-card-description">
                                    <p>{props.description}</p>
                                </div>
                                <div className="userguides-card-footer">
                                    <Link to='/usertechniques'>
                                         <span>Learn More</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
        </>
    );

}