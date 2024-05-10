import React, { useState, useEffect, useContext } from 'react';
import { ColorContext } from '../App';

import fetchWeatherData from "../server/weather";

// gets the current date and time
const getDateInfo = () => {
    const date = new Date();
    return {
        currentTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        currentDay: date.getDate(),
        currentMonth: date.toLocaleString("default", { month: "long" }),
        currentYear: date.getFullYear(),
        currentDayOfWeek: date.toLocaleString("default", { weekday: "long" }),
    };
};

let Sidebar = () => {

    // sidebar colour context
    const { mostFrequentColor } = useContext(ColorContext);

    const sidebarStyle = {
        backgroundColor: mostFrequentColor,
    };

    // Set the current date and day of the week
    const {
        currentTime,
        currentDay,
        currentMonth,
        currentYear,
        currentDayOfWeek
    } = getDateInfo();

    // Set the state for the temperature
    const [temperature, setTemperature] = useState(null);
    // Set the state for the cloud cover
    const [cloudCover, setCloudCover] = useState(null);

    // Set state variables for warning message
    const [warningIconClass, setWarningIconClass] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [iconStyle, setIconStyle] = useState({});



    useEffect(() => {
        const warningMessages = {
            'var(--warning-coral)': {
                message: 'High Alert: Severe Weather Conditions',
                iconClass: 'bi-exclamation-triangle-fill',
                iconStyle: { color: 'var(--warning-coral)', fontSize: '2em', lineHeight: '0' }
            },
            'var(--warning-goldenrod)': {
                message: 'Moderate Alert: Mild Weather Conditions',
                iconClass: 'bi-exclamation-diamond-fill',
                iconStyle: { color: 'var(--warning-goldenrod)', fontSize: '2em', lineHeight: '0' }
            },
            'var(--warning-aqua-green)': {
                message: 'Low Alert: Pleasant Weather Conditions',
                iconClass: 'bi-check-square-fill',
                iconStyle: { color: 'var(--warning-aqua-green)', fontSize: '2em', lineHeight: '0' }
            }
        };


        const warningInfo = warningMessages[mostFrequentColor] || {
            message: 'Unknown Alert Level',
            iconClass: 'bi-question-circle-fill',
            iconStyle: {}
        };
        // Update state with the current warning info
        setWarningMessage(warningInfo.message);
        setWarningIconClass(warningInfo.iconClass);
        setIconStyle(warningInfo.iconStyle);
    }, [mostFrequentColor]);

    // fetch data from the weather api and set the state
    useEffect(() => {
        fetchWeatherData()
            .then((data) => {
                const cloudCover = data.current.weather_code;
                const temp = data.current.temperature_2m;
                setTemperature(Math.round(temp));
                setCloudCover(cloudCover);
                //console.log(data); // Debugging
            })
            .catch((error) => console.log(error));
    }, []);

    // If statement to set the weather icon based on the cloud cover
    let weatherIcon;
    if (cloudCover === 0) {
        weatherIcon = <i className="bi bi-sun"></i>;
    } else if ([1, 2, 3].includes(cloudCover)) {
        weatherIcon = <i className="bi bi-clouds"></i>;
    } else if ([45, 48].includes(cloudCover)) {
        weatherIcon = <i className="bi bi-cloud-fog2"></i>;
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(cloudCover)) {
        weatherIcon = <i className="bi bi-cloud-rain"></i>;
    } else if ([95, 96, 99].includes(cloudCover)) {
        weatherIcon = <i className="bi bi-cloud-lightning-rain"></i>;
    } else if ([56, 57, 66, 67, 71, 73, 75].includes(cloudCover)) {
        weatherIcon = <i className="bi bi-cloud-snow"></i>;
    } else if ([77, 85, 86].includes(cloudCover)) {
        weatherIcon = <i className="bi bi-snow"></i>;
    }

    return (
        <aside className="sidebar" style={sidebarStyle}>
            <section>
                <div className="d-flex flex-column justify-content-center align-items-center current_grid pt-5">
                    <div className="current_day">
                        {weatherIcon}
                    </div>
                    <h1 className="current_temp">{temperature}°C</h1>
                    <h3 className="current_time">{currentTime}</h3>
                    <h3 className="current_date">{currentMonth} {currentDay}, {currentYear}</h3>
                    <h3 className="current_day_of_the_week">{currentDayOfWeek}</h3>
                    <div className="current_day_warning">
                        <div>
                            <i className={`bi ${warningIconClass}`} style={iconStyle}></i>
                            <p>{warningMessage}</p>
                        </div>
                    </div>
                    <h4 className="current_location">
                        Station Beach Kincardine, Ontario
                    </h4>
                </div>
            </section>
        </aside>
    );
};

export default Sidebar;