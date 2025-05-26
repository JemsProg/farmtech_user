import React from "react";
import GuidesNavbar from "../components/Navbar.jsx";    
import Tomato from "../images/tomato.jpg";
import Garlic from "../images/garlic.jpg";
import Bitter from "../images/bitter.jpg";
import Cabbage from "../images/cabbage.jpg";
import Pumpkin from "../images/kalabasa.jpg";
import Onion from "../images/sibuyas.jpg";
import '../css/Guides.css';
import GuidesCard from "../components/GuidesCard";

export default function Guides() {
    return(
        <>
            <div className="guides-container">
                <GuidesNavbar/>

                    <div className="guides-content">
                        <h3>Guides and Techniques</h3>

                        <div className="guides-cards-list">
                                <GuidesCard
                                    image={Tomato}
                                    cropName={<span className="crop-name">Tomato</span>}
                                    />    
                                 <GuidesCard
                                    image={Garlic}
                                    cropName={<span className="crop-name">Garlic</span>}
                                    />   
                                 <GuidesCard
                                    image={Bitter}
                                    cropName={<span className="crop-name">Bitter Gourd</span>}
                                    />   
                                 <GuidesCard
                                    image={Cabbage}
                                    cropName={<span className="crop-name">Cabbage</span>}
                                    />   
                                 <GuidesCard
                                    image={Pumpkin}
                                    cropName={<span className="crop-name">Pumpkin</span>}
                                    />   
                                 <GuidesCard
                                    image={Onion}
                                    cropName={<span className="crop-name">Onion</span>}
                                    />   
                                    
                            
                        </div>
                    </div>
            </div>

        </>
    );
}