import React from "react";
import UserNavbar from "../../components/UserNavbar";
import "../../css/Userfarms.css";
import Farm1 from "../../images/20.png";
import Farm2 from "../../images/21.png";
import Farm3 from "../../images/22.png";
import Farm4 from "../../images/23.png";
import Farm5 from "../../images/24.png";
import Farm6 from "../../images/25.png";
import FarmsCard from "../../components/FarmsCard";

export default function UserFarms() {
    return(
        <>
            <div className="userfarms-container">
                <UserNavbar />
                <div className="userfarms-content">
                    <div className="userfarms-header">
                        <h2>Crops Marketplace</h2>
                        <p>Farms that are selling <span>Tomatoes</span> Crops:</p>
                    </div>

                    <div className="userfarms-farms-list">

                        <FarmsCard 
                            image={Farm1}
                            farmName="Jerome's Farm"
                            farmLocation="Dasmariñas, Cavite"
                        />

                        <FarmsCard 
                            image={Farm2}
                            farmName="AlDave's Farm"
                            farmLocation="Molino, Cavite"
                        />
                        <FarmsCard 
                            image={Farm3}
                            farmName="Henna Lei's Farm"
                            farmLocation="Imus, Cavite"
                        />
                       <FarmsCard 
                            image={Farm4}
                            farmName="Chyyan's Farm"
                            farmLocation="General Trias, Cavite"
                        />
                       <FarmsCard 
                            image={Farm5}
                            farmName="Noli's Farm"
                            farmLocation="Bacoor, Cavite"
                        />
                       <FarmsCard 
                            image={Farm6}
                            farmName="Don's Farm"
                            farmLocation="Trece Martires, Cavite"
                        />
                        


                    </div>
                </div>

            </div>
        </>
    );
}