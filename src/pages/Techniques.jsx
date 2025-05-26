import React from "react";
import GuidesNavbar from "../components/Navbar";
import '../css/Techniques.css';
import Tomato from '../images/tomato.jpg';

export default function Techniques() {
    return(
        <>
        <div className="techniques-container">
                <GuidesNavbar/> 

                <div className="techniques-content">
                    <div className="techniques-card">
                        <div className="techniques-card-title">
                            <h4>Effective Soil Preparation for Harvesting the Best Snap Beans</h4>
                        </div>
                        <div className="techniques-card-image">
                            <img src={Tomato} alt="" />
                        </div>

                        <div className="techniques-card-name">
                            <p>Snap Beans</p>
                        </div>

                        <div className="techniques-card-desc">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, ratione harum eum, eligendi dolor aliquam sunt quis minus suscipit veritatis tempore quo ea reprehenderit doloremque obcaecati, laboriosam ut. Repellat, accusantium. Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet cupiditate voluptas quibusdam veritatis quasi velit. Nihil, obcaecati! Quis ipsa, itaque debitis perspiciatis, illum, est placeat molestias voluptas maxime ullam similique.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, suscipit quibusdam veniam libero omnis corporis possimus expedita commodi voluptas dicta dolore fugit consectetur eum, accusantium placeat distinctio culpa amet id?
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. At fuga repudiandae optio id nobis nam vel voluptates fugiat! Dolor modi facere tenetur quam quis iste cupiditate fugiat impedit eum voluptatem.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit voluptatem quod corporis magni quis minima ex earum eaque dolor cupiditate! Consectetur deleniti vero earum blanditiis. Expedita fuga architecto provident blanditiis.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint unde voluptate, incidunt iste beatae iure earum distinctio mollitia asperiores minus fuga nihil quo rem quis autem laborum doloribus nulla laudantium.
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus, earum voluptatibus rerum non facere dignissimos enim inventore molestiae temporibus maiores ut sit nobis veniam repellendus, eius, assumenda officiis fugit excepturi.
                        </div>
                    </div>
                </div>
        </div>
        </>
    );
}