import React from "react";

import SmartBeachLogo from "../../img/smart_beach_logo_rbg2.png";

function Footer({ location }) {
    // const footerAlignment = location.pathname === "/" ? { alignItems: "flex-start" } : {};
    // const footerStyle = location.pathname === "/" 
    // ? {
    //     flexDirection: window.innerWidth < 949 ? "column" : "",
    //     alginItems: window.innerWidth < 949 ? "flex-start" : "",
    //     backgroundColor: window.innerWidth < 949 ? "red" : "",
    //   }
    // : {};
    
    return (

        <footer className="text-center">
            <div className="footer_logo">
                <a href="/"><img src={SmartBeachLogo} alt="Smart Beach Logo"/></a>
            </div>
            <div className="footer_links" >
                <div className="nav_links" >
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/Safety">Beach Safety</a></li>
                        <li><a href="/About">About</a></li>
                    </ul>
                </div>
                <span className="vertical_line"></span>
                <div className="help_links">
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Tech Support</a></li>
                    </ul>
                </div>
            </div>
        </footer>

    );
};

export default Footer;