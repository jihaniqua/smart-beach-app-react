import React from "react";

// Import Images
// Image from https://visitkincardine.ca/profile/station-beach/2129/ (c) Municipality of Kincardine
import station_beach from "../../src/img/station_beach.webp";
// Image from Pexels.com (c) Guy Kawasaki
import surfing from "../../src/img/pexels-guy-kawasaki-1654502.jpg";
// Image from https://visitkincardine.ca/profile/station-beach/2129/ (c) Municipality of Kincardine
import volleyball from "../../src/img/volleyball.webp";
// Image from https://visitkincardine.ca/profile/station-beach/2129/ (c) Municipality of Kincardine
import boardwalk from "../../src/img/boardwalk.webp";

function About() {
    return(
        <section className="infoMain">
            <section className="infoMasthead">
                <div>
                    <h1 className="mb-3">About Smart Beach</h1>
                    <h2 className="mb-3">At Station Beach</h2>
                </div>
            </section>
            <div className="aboutSectionOne">
                <h3 className="aboutTitle">Smart Beach</h3>
                <div className="contentSectionOne">
                    <div className="aboutSmartBeachText">
                        <p className="text-dark">Developed in response to wanting to make Station Beach safer for visitors, <span className="emphasis">Smart Beach</span> is a project designed to warn beach-goers about beach hazards in real-time. One data-collection tool being used at Station Beach is a real-time aquatic ecosystem observation (RAEON) buoy. The buoy is on loan from the Great Lakes Institute for Environmental Research at the University of Windsor and collects the data that you can view on the dashboard.</p>
                        <p className="text-dark">The goal of the project is to develop a warning system that beach-goers, no matter their location, can check the beach conditions of Station Beach to make sure they visit when conditions are safe.</p>
                        <p className="text-dark">We hope our dashboard helps to inform the community, near and far, about the safety conditions of Station Beach.</p>
                    </div>
                    <div className="aboutSmartBeachImage">
                        <img src={station_beach} alt="Image of the beach, grassy dunes, and clear blue water of Station Beach"></img>
                    </div>
                </div>
            </div>
            <div className="aboutSectionTwo">
                <h3 className="aboutTitle">Station Beach</h3>
                <div className="aboutStationBeachText"></div>
                    <p className="text-dark">Located on the shore of Lake Huron, <span className="emphasis">Station Beach</span> is a picturesque destination for locals and tourists to enjoy an idyllic day on the beach. Known for beautiful scenery and clear waters, the beach invites visitors to sun, swim, surf, play sport, and a host of other activities. The beach is well maintained and offers many amenities onsite.</p>
                    <div className="amenitiesSection">
                        <h4>Amenities</h4>
                            <ul className="amenitiesCards">
                                <li>
                                    <h5>Surfboard Rentals</h5>
                                    <img src={surfing} alt="a man surfing"></img>
                                </li>
                                <li>
                                    <h5>Boardwalk</h5>
                                    <img src={boardwalk} alt="the boardwalk, made of wooden planks, edges the border of Station Beach"></img>
                                </li>
                                <li>
                                    <h5>Beach Volleyball Courts</h5>
                                    <img src={volleyball} alt="volleyball nets set up on a sandy beach"></img>
                                </li>
                            </ul>
                    </div>
                <h4>Accessibility</h4>
                <p className="text-dark">The Municipality of Kincardine offers Mobi-Mats, mats that allow people with mobility issues easy access to the beach. As well, a Beach Wheelchair is available to be reserved through the Kincardine Tourism Office.</p>
                <p className="text-dark moreInfo">For more information, <a href="https://visitkincardine.ca/profile/station-beach/2129/">check out the Station Beach website from the Municipality of Kincardine.</a></p>
            </div>
        </section>
    );
};

export default About;