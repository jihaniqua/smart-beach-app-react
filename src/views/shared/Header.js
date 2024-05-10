import React from "react";

// Icons
import HomeIcon from "../../img/icons/home-icon.svg";
import BeachSafetyIcon from "../../img/icons/beach safety icon.svg";
import AboutIcon from "../../img/icons/about-icon.svg";
import SmartBeachLogo from "../../img/smart_beach_logo_rbg1.png";

// Apply styles to Smart Beach Logo
import "../../index.css";

function Header({ location }) {
    {/* if location is /Safety, make smart beach logo position absolute */}
    const imgStyle = location.pathname === "/Safety" || location.pathname === "/About" ? { position: "absolute" } : {};
    const navStyle = location.pathname === "/Safety" || location.pathname === "/About" ? { width: "100%", background: "#fff" } : {};

    return (
        <nav className="navbar navbar-expand-xl p-0">
            <a className="navbar-brand" href="/">
                    <img src={SmartBeachLogo} style={imgStyle} width="577" height="433" className="d-inline-block align-top" alt="Smart Beach Logo" />
                </a>
            <div className="container-fluid">
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" ></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-lg-0" style={navStyle}>
                    <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/"><img src={HomeIcon} alt="Home Icon"/> Home</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="/Safety"><img src={BeachSafetyIcon} alt="Beach Safety Icon"/> Beach Safety</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="/About"><img src={AboutIcon} alt="Beach Safety Icon"/> About</a>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;