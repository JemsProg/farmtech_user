import React from "react";
import UserGuidesNavbar from "../../components/UserGuidesNavbar";
import '../../css/UserTechniques.css';
import Labanos from "../../images/labanos.jpg";

export default function UserTechniques(props) {
    return (
        <>
            <div className="usertechniques-container">
                <UserGuidesNavbar />
                <div className="usertechniques-content">
                    <div className="usertechniques-card">
                            <h4>Effective Soil Preparation for Harvesting the Best Labanos
                            </h4>
                            <div className="usertechniques-card-image">
                                <img src={Labanos} alt="" />
                            </div>
                            <div className="usertechniques-card-description">
                                
                            <p>Snap beans (Phaseolus vulgaris), also known as Baguio beans, are rich in beta-carotene, fiber, potassium, calcium, and phosphorus.</p> 

<p><strong>PLANTING LOCATION</strong></p> 
<p>Snap beans grow well in slightly clayey soil with plenty of organic matter. The ideal soil pH is 5.5 - 7.5. It is best to plant them in cool areas with a temperature of 18°C-29°C. Snap beans are usually planted in October and November.</p> 

<p><strong>SEED SELECTION</strong></p> 
<p>There are two types of snap beans:</p> 
<p>1. Bush Type - Variety Blue Lake 274 - ("sitting" beans), La ador, Matador</p> 
<p>2. Pole Type - Baguio Beans, Kentucky Wonder, Romano Italian, etc.</p> 

<p><strong>SOIL PREPARATION</strong></p> 
<p>Till the planting soil. Add one kilogram of dried chicken manure and 300 grams of carbonized rice hull per square meter. Create planting beds with a width of one meter and a depth of 15 cm to prevent waterlogging.</p> 

<p><strong>SEED PLANTING</strong></p> 
<p>Plant one to two seeds per row. Maintain a 20 cm gap between each row and 35 cm between each line. After planting, water the rows.</p> 

<p><strong>INSTALLING TRELLISES</strong></p> 
<p>Three to four weeks after planting, the beans begin to climb. It is best to set up trellises for the beans to climb on. You can use bamboo stakes that are two to three meters long and positioned at a 60° angle to the adjacent row.</p> 

<p><strong>CARE AND MAINTENANCE</strong></p> 
<p>After 14 days, apply compost to the mounds. Apply Fermented Plant Juice (FPJ) once or twice a week. You can also use manure tea to help the plants grow strong and increase their resistance to diseases and pests. Water the plants twice a week or as needed. Regularly remove weeds to prevent competition for nutrients.</p> 

<p><strong>PEST AND DISEASE MANAGEMENT</strong></p> 
<p>The main pests of snap beans are aphids, bean flies, and bean pod borers. Bean flies attack when the plants are still small. They can be controlled by spraying a solution made of 100 g of crushed chili mixed in 16L of water with one tablespoon of powdered detergent.</p> 
<p>Diseases caused by fungi, such as rust, anthracnose, and root rot, can be prevented by using resistant seed varieties, practicing crop rotation, and applying fungicides.</p> 

<p><strong>HARVESTING</strong></p> 
<p>Snap beans can be harvested 45-60 days after planting or 10-15 days after flowering. Harvesting is done every three to four days.</p> 


                            </div>
                    </div>
                </div>
            </div>
        </>
    );
}