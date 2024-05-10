import React from "react";

// Import Images
import tooltip from "../../src/img/tooltips.gif";

function Safety() {
    return(
        <section className="infoMain">
            <section className="infoMasthead">
                <div>
                    <h1 className="mb-3">Beach Safety</h1>
                    <h2 className="mb-3 ms-2 me-2">Smart Beach is Your Friend for Beach Safety</h2>
                </div>
            </section>
            <div className="safetySectionOne">
                <h3 className="safetyTitle">Warning System</h3>
                <h4>How Does it Work?</h4>
                <p className="text-dark">The warning system uses colours to quickly identify whether a condition at the beach is safe or should be noted as unsafe. Using the <span className="emphasis">Smart Beach</span> data, we have created a widget that identifies the current condition of that weather or water data point. Each widget will display the actual data information, along with a colour associated with the level of warning:</p>
                <div className="warningExamplesContainer">
                    <ul className="warningExamplesWidgetsUL">
                        <li className="warningExamplesWidget wSafe desc">
                            <h4>Safe</h4>
                        </li>
                        <li className="warningExamplesWidget wCaution desc">
                            <h4>Caution</h4>
                        </li>
                        <li className="warningExamplesWidget wWarning desc">
                            <h4>Warning</h4>
                        </li>
                    </ul>
                </div>
                <h4>Predictions</h4>
                    <p className="text-dark">The warning system also aims to provide future weather and water conditions, which can be easily accessed by clicking the tool-tip icon in the corner of certain widgets.</p>
                    <img src={tooltip} className="tooltip_gif" alt="gif of a computer arrow clicking on the tooltip icon in the corner of a widget. The daily data appears showing the information for the morning, afternoon, and evening." ></img>
                <h4>Accessibility</h4>
                    <p className="text-dark">Additionally, each widget has further details to explain the conditions of that weather or water condition, using text and icons that do not rely on colour. This way the warning system data is accessible to everyone.</p>

            </div>
            <div className="safetySectionTwo">
                <h3 className="safetyTitle">How to Be Safe?</h3>
                <p className="text-dark">The data collected from Smart Beach is to help you prepare for your day at the beach, or to let you know if conditions may be too hazardous for a visit. The daily forecast, including air temperature, is important, but the Marine Forecast will help decide if the ater conditions are ideal for swimming, surfing, boating, and other water-based activities.</p>
                <p className="text-dark">It is important to know what water conditions you will be facing to avoid dangerous situations. Water velocity, water temperature, wind, and wave height can all contribute to wonderful lake experiences, but also deadly ones.</p>
            </div>
        </section>
    );
};

export default Safety;