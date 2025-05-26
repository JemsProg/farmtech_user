import React from "react"; 
import '../../css/Usermarket.css';
import UserNavbar from "../../components/UserNavbar";
import UserCrop from "../../components/UserCrop";
import Tomato from "../../images/tomato.jpg";
import Cabbage from "../../images/cabbage.jpg";
import Bitter from "../../images/bitter.jpg";
import Garlic from "../../images/garlic.jpg";
import Onion from "../../images/sibuyas.jpg";
import Okra from "../../images/okra.jpg";
export default function Usermarket() {
    return(
        <>
            <div className="usermarket-container">
                <UserNavbar/>
                <div className="usermarket-content">
                    <div className="usermarket-header">
                        <h2>Crops Marketplace</h2>
                        <input type="text" placeholder="Search for crops"/>
                    </div>

                    <div className="usermarket-crops-list">
                           <UserCrop 
                              image={Tomato} 
                              cropName="Tomato" 
                              cropPrice="50"
                           />
                            <UserCrop 
                              image={Cabbage} 
                              cropName="Cabbage" 
                              cropPrice="50"
                           />
                            <UserCrop 
                              image={Bitter} 
                              cropName="Bitter" 
                              cropPrice="50"
                           />
                            <UserCrop 
                              image={Garlic} 
                              cropName="Garlic" 
                              cropPrice="50"
                           />
                              <UserCrop 
                              image={Onion} 
                              cropName="Onion" 
                              cropPrice="50"
                           />
                              <UserCrop 
                              image={Okra} 
                              cropName="Okra" 
                              cropPrice="50"
                           />
                              
                           
                        </div>
                </div>
            </div>
        </>
    )
}