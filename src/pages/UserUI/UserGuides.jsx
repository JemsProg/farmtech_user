import React from "react";
import '../../css/UserGuides.css';
import UserGuidesNavbar from "../../components/UserGuidesNavbar";
import Labanos from "../../images/labanos.jpg";
import Cabbage from "../../images/cabbage.jpg";
import Okra from "../../images/okra.jpg";
import Onion from "../../images/sibuyas.jpg";
import Garlic from "../../images/garlic.jpg";
import UserGuidesCard from "../../components/UserGuidesCard";
export default function UserGuides() { 
    return (
        <>
            <div className="userguides-container">
                <UserGuidesNavbar />
                <div className="userguides-content">
                    <div className="userguides-header">
                        <h3>Guides and Techniques</h3>
                    </div>

                    <div className="userguides-guides-list">
                        <UserGuidesCard 
                            image = {Labanos}
                            description = "Effective Soil Preparation for Harvesting the best Labanos"
                        />
                         <UserGuidesCard 
                            image = {Cabbage}
                            description = "Effective Ways to Harvest Cabbages"
                        />
                         <UserGuidesCard 
                            image = {Okra}
                            description = "The best time to put fertilizers on Okra"
                        />
                         <UserGuidesCard 
                            image = {Onion}
                            description = "Discover The Best Way to Harvest The Best Onion In Town"
                        />
                         <UserGuidesCard 
                            image = {Garlic}
                            description = "Techniques on How To Grow a Garlic Larger Than Usual"
                        />
                        

                    </div>
                </div>
            </div>
        </>
    );
}