import React, { useState, useEffect, useContext } from 'react';
import fetchBuoyData from "../server/buoy";
import fetchWeatherData from "../server/weather";

// Importing Wave Height graph
import WaveHeightGraph from "../img/wave-height-graph.png";
import { data } from 'jquery';

// import ColorConext
import { ColorContext } from '../App';

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

// convert degrees to water and wave direction
function degreesToDirection(degrees) {
    const directions = [
        "North", "NNE", "NE", "ENE",
        "East", "ESE", "SE", "SSE",
        "South", "SSW", "SW", "WSW",
        "West", "WNW", "NW", "NNW"
    ];

    const index = Math.round((degrees % 360) / 22.5);
    return directions[(index + 16) % 16];
}

// convert degrees to wind direction only
function degreesToWindDirection(degrees) {
    const directions = [
        "North", "North-Northeast", "Northeast", "East-Northeast",
        "East", "East-Southeast", "Southeast", "South-Southeast",
        "South", "South-Southwest", "Southwest", "West-Southwest",
        "West", "West-Northwest", "Northwest", "North-Northwest"
    ];

    const index = Math.round((degrees % 360) / 22.5);
    return directions[(index + 16) % 16];
}

function Dashboard() {

    // use context for sidebar background
    const { updateMostFrequentColor } = useContext(ColorContext);

    // Set the current date and day of the week - delete if not needed
    const {
        currentTime,
        currentDay,
        currentMonth,
        currentYear,
        currentDayOfWeek
    } = getDateInfo();


    // on click events of dashboard widgets
    const [isHumidityBlurred, setIsHumidityBlurred] = useState(false);
    const [isForecastClicked, setIsForecastClicked] = useState(false);
    const [clickedForecastIcon, setClickedForecastIcon] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Set the state for the temperature and cloud cover
    const [waterTemp, setWaterTemp] = useState(null);

    // set state for air temp 
    const [airTemp, setAirTemp] = useState(null);

    // set state for humidity
    const [humidity, setHumidity] = useState(null);

    // set state for wind speed
    const [windSpeed, setWindSpeed] = useState(null);

    // set state for wind direction
    const [windDirect, setWindDirect] = useState(null);

    // set state for wave height
    const [waveHeight, setWaveHeight] = useState(null);

    // set state for raw wave direction
    const [waveDirectionData, setWaveDirectionData] = useState(null);

    // set state for wave direction
    const [waveDirection, setWaveDirection] = useState(null);

    // Set the state for the cloud cover
    const [cloudCover, setCloudCover] = useState(null);

    // Set the state for the temperature
    const [currentTemp, setTemperature] = useState(null);

    // Set the state for water velocity
    const [waterVelocity, setWaterVelocity] = useState(null);

    // set state for raw water direction
    const [waterDirectionData, setWaterDirectionData] = useState(null);

    // Set the state for water direction
    const [waterDirection, setWaterDirection] = useState(null);

    // 7-day forecast
    const [weeklyForecast, setWeeklyForecast] = useState(null);

    // weekly weather icon
    const [weeklyWeatherIcon, setWeeklyWeatherIcon] = useState(null);

    // set the state for the warning color for the widgets (border bottom)
    // widgets are off by default. will load as black until api data is loaded
    // set warning color for airTemp
    const [warningColorAir, setWarningColorAir] = useState('var(--neutral-light-silver)');

    // set the warning message for airTemp
    const [warningMsgAir, setWarningMsgAir] = useState('');

    // set the tooltip message for airTemp
    const [tooltipMsgAir, setTooltipMsgAir] = useState('--');

    // set warning color for waveHeight
    const [warningColorWave, setWarningColorWave] = useState('var(--neutral-light-silver)');

    // set the warning message for waveHeight
    const [warningMsgWave, setWarningMsgWave] = useState('');

    // set the tooltip message for waveHeight
    const [tooltipMsgWave, setTooltipMsgWave] = useState('--');

    // set warning color for waterTemp
    const [warningColorWaterTemp, setWarningColorWaterTemp] = useState('var(--neutral-light-silver)');

    // set the warning message for waterTemp
    const [warningMsgWaterTemp, setWarningMsgWaterTemp] = useState('');

    // set the tooltip message for waterTemp
    const [tooltipMsgWaterTemp, setTooltipMsgWaterTemp] = useState('--');

    // set the warning color for waterVelocity
    const [warningColorWaterVelocity, setWarningColorWaterVelocity] = useState('var(--neutral-light-silver)');

    // set warning message for waterVelocity
    const [warningMsgWaterVelocity, setWarningMsgWaterVelocity] = useState('');

    // set the tooltip message for waterVelocity
    const [tooltipMsgWaterVelocity, setTooltipMsgWaterVelocity] = useState('--');

    // set the warning color for wind
    const [warningColorWind, setWarningColorWind] = useState('var(--neutral-light-silver)');

    // set the warning message for wind
    const [warningMsgWind, setWarningMsgWind] = useState('');

    // set the tooltip message for wind
    const [tooltipMsgWind, setTooltipMsgWind] = useState('--');

    // set the warning color for cloud cover (rain, thunderstorm, snow)
    const [warningColorCloud, setWarningColorCloud] = useState('var(--neutral-light-silver)');

    // set the warning message for cloud cover (rain, thunderstorm, snow)
    const [warningMsgCloud, setWarningMsgCloud] = useState('');

    // set the tooltip message for cloud
    const [tooltipMsgCloud, setTooltipMsgCloud] = useState('--');

    // set the alert message for humidity
    const [humidityMsg, setHumidityMsg] = useState('');

    // fetch data from the buoy api and set the state
    useEffect(() => {
        fetchBuoyData()
            .then((data) => {

                const waterTemp = data.slice(0, 7).map(item => Math.round(item['sea_water_temperature_6 (K)'] - 273.15));
                setWaterTemp(waterTemp);
                //console.log(waterTemp);

                // set the air temp
                const airTemp = data.slice(0, 7).map(item => Math.round(item['air_temperature (K)'] - 273.15));
                setAirTemp(airTemp);
                //console.log(airTemp);

                // set wind speed
                //const windSpeed = data[0]["wind_speed (m s-1)"];  // remove after testing
                const windSpeed = data.slice(0, 7).map(item => Math.round(item["wind_speed (m s-1)"]));
                setWindSpeed(windSpeed);
                //console.log("wind speed", windSpeed);

                // set wind direction
                //const windDirect = data[0]["wind_from_direction (degree)"]; // remove after testing
                const windDirect = data.slice(0, 7).map(item => degreesToWindDirection(item["wind_from_direction (degree)"]));
                setWindDirect(windDirect);
                //console.log("wind direction", windDirect);

                // set wave height
                //const waveHeight = data[0]["sea_surface_wave_significant_height (m)"];
                const waveHeight = data.slice(0, 7).map(item => Math.round(item["sea_surface_wave_significant_height (m)"]));
                setWaveHeight(waveHeight);
                //console.log("wave height", waveHeight);

                // set wave direction and raw data
                const waveDirectionData = Math.round(data[0]["sea_surface_wave_from_direction (degree)"]);
                setWaveDirectionData(waveDirectionData);

                const waveDirection = data.slice(0, 7).map(item => degreesToDirection(item["sea_surface_wave_from_direction (degree)"]));
                setWaveDirection(waveDirection);
                //console.log("wave direction", waveDirection);

                // set the water velocity
                const waterVelocity = data.slice(0, 7).map(item => Math.round(item["total_water_velocity_1"]));
                setWaterVelocity(waterVelocity);
                //console.log(waterVelocity);

                // set the water direction and raw data
                const waterDirectionData = Math.round(data[0]["total_water_direction_1"]);
                setWaterDirectionData(waterDirectionData);
                
                const waterDirection = data.slice(0, 7).map(item => degreesToDirection(item["total_water_direction_1"]));
                setWaterDirection(waterDirection);
                //console.log("water direction", waterDirection);

                /* log out buoy api data to console
                console.log("Temperature is", data[0]["air_temperature (K)"] - 273.15);
                console.log("Wave height is", data[0]["sea_surface_wave_significant_height (m)"]);
                console.log("Wave direction is", data[0]["sea_surface_wave_from_direction (degree)"]);
                console.log("Wind direction is", data[0]["wind_from_direction (degree)"]);
                console.log("Wind speed is", data[0]["wind_speed (m s-1)"]);
                console.log("Water temperature is", data[0]["sea_water_temperature_6 (K)"] - 273.15);
                console.log("Water is moving at", data[0]["total_water_velocity_1"]);
                console.log("Water Direction is", data[0]["total_water_direction_1"]);
                console.log("Wave direction is", data[0]["sea_surface_wave_from_direction (degree)"]); 
                */

                // if else statement for warning system color, message and tooltip for airTemp
                if (airTemp[selectedIndex] <= 6 || airTemp[selectedIndex] >= 35) {
                    setWarningColorAir('var(--warning-coral)');
                    setWarningMsgAir('Temperature conditions are unfavorable, exercise caution.');
                    setTooltipMsgAir('Unsafe');
                } else if (airTemp[selectedIndex] > 6 && airTemp[selectedIndex] <= 12 || airTemp[selectedIndex] >= 27 && airTemp[selectedIndex] <= 34) {
                    setWarningColorAir('var(--warning-goldenrod)');
                    setWarningMsgAir('Temperature conditions are unsafe.');
                    setTooltipMsgAir('Moderate');
                } else {
                    setWarningColorAir('var(--warning-aqua-green');
                    setWarningMsgAir('Temperature is pleasant, safe for outdoors.');
                    setTooltipMsgAir('Ideal');
                }

                // if else statement for warning system color and message for waveHeight
                if (waveHeight[selectedIndex] >= 2) {
                    setWarningColorWave('var(--warning-coral)');
                    setWarningMsgWave('Wave height is dangerously high, swimming is not advised.');
                    setTooltipMsgWave('Unsafe');
                } else if (waveHeight[selectedIndex] < 2 && waveHeight[selectedIndex] >= 1) {
                    setWarningColorWave('var(--warning-goldenrod)');
                    setWarningMsgWave('Wave height is considered high, exercise caution while in the water.');
                    setTooltipMsgWave('High');
                } else {
                    setWarningColorWave('var(--warning-aqua-green');
                    setWarningMsgWave('Wave conditions are safe.');
                    setTooltipMsgWave('Ideal');
                }

                // if else statement for warning system color and message for waterTemp
                if (waterTemp[selectedIndex] <= 10 || waterTemp[selectedIndex] >= 40) {
                    setWarningColorWaterTemp('var(--warning-coral)');
                    setWarningMsgWaterTemp('Water temperature is at a dangerous level, keep out.');
                    setTooltipMsgWaterTemp('Unsafe');
                } else if (waterTemp[selectedIndex] >= 30 && waterTemp[selectedIndex] <= 39) {
                    setWarningColorWaterTemp('var(--warning-goldenrod)');
                    setWarningMsgWaterTemp('Water temperature is hot, exercise caution while in the water.');
                    setTooltipMsgWaterTemp('Moderate');
                } else {
                    setWarningColorWaterTemp('var(--warning-aqua-green');
                    setWarningMsgWaterTemp('Water temperature conditions are safe.');
                    setTooltipMsgWaterTemp('Ideal');
                }

                // if else statement for warning system color and message for waterVelocity
                if (waterVelocity[selectedIndex] >= 2) {
                    setWarningColorWaterVelocity('var(--warning-coral)');
                    setWarningMsgWaterVelocity('Currents are dangerous, keep out of the water.');
                    setTooltipMsgWaterVelocity('Unsafe');
                } else if (waterVelocity[selectedIndex] >= 1 && waterVelocity[selectedIndex] <= 2) {
                    setWarningColorWaterVelocity('var(--warning-goldenrod)');
                    setWarningMsgWaterVelocity('Currents are moving quickly, exercise caution.');
                    setTooltipMsgWaterVelocity('Moderate');
                } else {
                    setWarningColorWaterVelocity('var(--warning-aqua-green');
                    setWarningMsgWaterVelocity('Currents are considered safe.');
                    setTooltipMsgWaterVelocity('Ideal');
                }

                // if else statement for warning system color and message for Wind
                if (windSpeed[selectedIndex] >= 50) {
                    setWarningColorWind('var(--warning-coral)');
                    setWarningMsgWind('Wind is exceptionally strong, conditions are unfavorable.');
                    setTooltipMsgWind('Unsafe');
                } else if (windSpeed[selectedIndex] < 50 && windSpeed[selectedIndex] >= 30) {
                    setWarningColorWind('var(--warning-goldenrod)');
                    setWarningMsgWind('Strong winds expected, exercise caution.');
                    setTooltipMsgWind('Moderate');
                } else {
                    setWarningColorWind('var(--warning-aqua-green');
                    setWarningMsgWind('Wind conditions are favorable.');
                    setTooltipMsgWind('Ideal');
                }
            })
            .catch((error) => console.log(error));
    }, []);

    // fetch data from the weather api and set the state
    useEffect(() => {
        fetchWeatherData()
            .then((data) => {
                // set current temperature
                const currentTemp = data.current.temperature_2m;
                setTemperature(Math.round(currentTemp));

                // set current cloud cover
                const cloudCover = data.current.weather_code;
                setCloudCover(cloudCover);

                // set the humidity
                const humidity = data.current.relative_humidity_2m;
                setHumidity(humidity);

                // set daily forecast
                const weeklyForecast = data.daily.temperature_2m_max.slice(0, 7);
                setWeeklyForecast(weeklyForecast.map(Math.round));

                // set weekly weather icon
                const weeklyWeatherIcon = data.daily.weather_code.slice(0, 7);
                setWeeklyWeatherIcon(weeklyWeatherIcon);

                // if else statement for alert message for humidity
                if (humidity >= 71) {
                    setHumidityMsg('Humidty is high, expect precipitation.');
                } else if (humidity >= 30 || humidity <= 70) {
                    setHumidityMsg('Humidity levels are comfortable.');
                } else {
                    setHumidityMsg('Air is dry, consider applying moisturizer to skin.')
                }

                // If statement to set the weather icon based on the cloud cover. add warning message and border color
                // commented out weatherIcon here and moved it on the if-else statement inside the getWeatherIcon function
                // This uses the current day data - data.current.weather_code
                let warningColor;
                let warningMsg;
                let currentIcon;
                let tooltipMsg;

                if (cloudCover === 0) {
                    currentIcon = <i className="bi bi-sun"></i>;
                    warningColor = 'var(--warning-aqua-green)';
                    warningMsg = 'Sunny';
                    tooltipMsg = 'Ideal';
                } else if ([1, 2, 3].includes(cloudCover)) {
                    currentIcon = <i className="bi bi-clouds"></i>;
                    warningColor = 'var(--warning-aqua-green)';
                    warningMsg = 'Cloudy';
                    tooltipMsg = 'Ideal';
                } else if ([45, 48].includes(cloudCover)) {
                    currentIcon = <i className="bi bi-cloud-fog2"></i>;
                    warningColor = 'var(--warning-goldenrod)';
                    warningMsg = 'Fog';
                    tooltipMsg = 'Moderate';
                } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(cloudCover)) {
                    currentIcon = <i className="bi bi-cloud-rain"></i>;
                    warningColor = 'var(--warning-goldenrod)';
                    warningMsg = 'Rain';
                    tooltipMsg = 'Moderate';
                } else if ([95, 96, 99].includes(cloudCover)) {
                    currentIcon = <i className="bi bi-cloud-lightning-rain"></i>;
                    warningColor = 'var(--warning-coral)';
                    warningMsg = 'Thunderstorms';
                    tooltipMsg = 'Unsafe';
                } else if ([56, 57, 66, 67, 71, 73, 75].includes(cloudCover)) {
                    currentIcon = <i className="bi bi-cloud-snow"></i>;
                    warningColor = 'var(--warning-goldenrod)';
                    warningMsg = 'Scattered flurries';
                    tooltipMsg = 'Moderate';
                } else if ([77, 85, 86].includes(cloudCover)) {
                    currentIcon = <i className="bi bi-snow"></i>;
                    warningColor = 'var(--warning-coral)';
                    warningMsg = 'Snow';
                    tooltipMsg = 'Unsafe';
                }

                // Set the icon, warning color and message for cloud cover
                setWarningColorCloud(warningColor);
                setWarningMsgCloud(warningMsg);
                setCloudCover(currentIcon);
                setTooltipMsgCloud(tooltipMsg);
            })
            .catch((error) => console.log(error));
    }, []);

    // Get the name of the next day
    const getNextDayName = (offset) => {
        const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
        const today = new Date().getDay();
        return days[(today + offset) % 7];
    };

    // Puts all warning colors into an array
    const allWarningColors = [warningColorAir, warningColorWave, warningColorWaterTemp, warningColorWaterVelocity, warningColorWind, warningColorCloud];

    // Count the number of times each color appears
    const counts = allWarningColors.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    // Find the color that appears most frequently
    let mostFrequentColor = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    let frequentColorSecondary;

    // set gradient paring
    if (mostFrequentColor == 'var(--warning-coral)') {
        frequentColorSecondary = 'var(--warning-pink-blush)';
    } else if (mostFrequentColor == 'var(--warning-aqua-green)') {
        frequentColorSecondary = 'var(--warning-robins-egg)';
    } else if (mostFrequentColor == 'var(--warning-goldenrod)') {
        frequentColorSecondary = 'var(--warning-light-gold)';
    } else {
        mostFrequentColor = 'var(--neutral-white)';
        frequentColorSecondary = 'var(--neutral-white)';
    }

    // background style for daily forecast
    const gradientMostFrequentColor = `linear-gradient(0deg, ${mostFrequentColor}, ${frequentColorSecondary}`;

    // warning messages and icons based on
    const warningMessages = {
        'var(--warning-coral)': { message: 'High Alert: Severe Weather Conditions', iconClass: 'bi-exclamation-triangle-fill' },
        'var(--warning-goldenrod)': { message: 'Moderate Alert: Mild Weather Conditions', iconClass: 'bi-exclamation-diamond-fill' },
        'var(--warning-aqua-green)': { message: 'Low Alert: Pleasant Weather Conditions', iconClass: 'bi-check-square-fill' }
    };

    useEffect(() => {
        // Puts all warning colors into an array
        const allWarningColors = [warningColorAir, warningColorWave, warningColorWaterTemp, warningColorWaterVelocity, warningColorWind, warningColorCloud];

        // Count the number of times each color appears
        const counts = allWarningColors.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});

        // Find the color that appears most frequently
        let mostFrequentColor = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        let frequentColorSecondary;

        // set gradient paring
        if (mostFrequentColor == 'var(--warning-coral)') {
            frequentColorSecondary = 'var(--warning-pink-blush)';
        } else if (mostFrequentColor == 'var(--warning-aqua-green)') {
            frequentColorSecondary = 'var(--warning-robins-egg)';
        } else if (mostFrequentColor == 'var(--warning-goldenrod)') {
            frequentColorSecondary = 'var(--warning-light-gold)';
        } else {
            mostFrequentColor = 'var(--neutral-white)';
            frequentColorSecondary = 'var(--neutral-white)';
        }

        // background style for daily forecast
        const gradientMostFrequentColor = `linear-gradient(0deg, ${mostFrequentColor}, ${frequentColorSecondary}`;

        updateMostFrequentColor(mostFrequentColor); // Update the context's state

    }, [mostFrequentColor]);

    // on hover on the warning indicatiors for each widget, show tooltip and add outline on each indicator
    const mouseEnterTooltipAirTemp = async () => {
        // all widgets - show tooltip
        const tooltip = document.querySelector('.tooltip_warning_air_temp');
        tooltip.style.display = 'block';

        // air temp
        const airTempLegend = document.querySelectorAll('.warning_air_temp span');
        const colors = [warningColorAir, 'var(--warning-aqua-green)', 'var(--warning-goldenrod)'];
        airTempLegend.forEach((span, index) => {
            span.style.outline = `1px solid ${colors[index]}`;
            span.style.outlineOffset = '1px';
        });
    };

    // ..otherwise, hide tooltip
    const mouseLeaveTooltipAirTemp = async () => {
        // all widgets - hide tooltip
        const tooltip = document.querySelector('.tooltip_warning_air_temp');
        tooltip.style.display = 'none';

        // air temp
        const airTempLegend = document.querySelectorAll('.warning_air_temp span');
        airTempLegend.forEach(span => {
            span.style.outline = 'none';
        });
    };

    const mouseEnterTooltipCloud = async () => {
        // all widgets - show tooltip
        const tooltip = document.querySelector('.tooltip_warning_cloud_cover');
        tooltip.style.display = 'block';

        // cloud
        const cloudLegend = document.querySelectorAll('.warning_cloud_cover span');
        const colors = [warningColorCloud, 'var(--warning-aqua-green)', 'var(--warning-goldenrod)'];
        cloudLegend.forEach((span, index) => {
            span.style.outline = `1px solid ${colors[index]}`;
            span.style.outlineOffset = '1px';
        });
    };

    const mouseLeaveTooltipCloud = async () => {
        // all widgets - hide tooltip
        const tooltip = document.querySelector('.tooltip_warning_cloud_cover');
        tooltip.style.display = 'none';

        // cloud
        const cloudLegend = document.querySelectorAll('.warning_cloud_cover span');
        cloudLegend.forEach(span => {
            span.style.outline = 'none';
        });
    };

    const mouseEnterTooltipWaterTemp = async () => {
        const tooltip = document.querySelector('.tooltip_warning_water_temp');
        tooltip.style.display = 'block';

        // water temp
        const waterTempLegend = document.querySelectorAll('.warning_water_temp span');
        const colors = [warningColorWaterTemp, 'var(--warning-aqua-green)', 'var(--warning-goldenrod)'];
        waterTempLegend.forEach((span, index) => {
            span.style.outline = `1px solid ${colors[index]}`;
            span.style.outlineOffset = '1px';
        });
    };

    const mouseLeaveTooltipWaterTemp = async () => {
        // all widgets - hide tooltip
        const tooltip = document.querySelector('.tooltip_warning_water_temp');
        tooltip.style.display = 'none';

        // water temp
        const waterTempLegend = document.querySelectorAll('.warning_water_temp span');
        waterTempLegend.forEach(span => {
            span.style.outline = 'none';
        });
    };

    const mouseEnterTooltipWaterVelocity = async () => {
        const tooltip = document.querySelector('.tooltip_warning_water_velocity');
        tooltip.style.display = 'block';

        // water velocity
        const waterVelocityLegend = document.querySelectorAll('.warning_water_velocity span');
        const colors = [warningColorWaterVelocity, 'var(--warning-aqua-green)', 'var(--warning-goldenrod)'];
        waterVelocityLegend.forEach((span, index) => {
            span.style.outline = `1px solid ${colors[index]}`;
            span.style.outlineOffset = '1px';
        });
    };

    const mouseLeaveTooltipWaterVelocity = async () => {
        // all widgets - hide tooltip
        const tooltip = document.querySelector('.tooltip_warning_water_velocity');
        tooltip.style.display = 'none';

        // water velocity
        const waterVelocityLegend = document.querySelectorAll('.warning_water_velocity span');
        waterVelocityLegend.forEach(span => {
            span.style.outline = 'none';
        });
    };

    const mouseEnterTooltipWind = async () => {
        const tooltip = document.querySelector('.tooltip_warning_wind');
        tooltip.style.display = 'block';

        // wind speed
        const windLegend = document.querySelectorAll('.warning_wind span');
        const colors = [warningColorWind, 'var(--warning-aqua-green)', 'var(--warning-goldenrod)'];
        windLegend.forEach((span, index) => {
            span.style.outline = `1px solid ${colors[index]}`;
            span.style.outlineOffset = '1px';
        });
    };

    const mouseLeaveTooltipWind = async () => {
        // all widgets - hide tooltip
        const tooltip = document.querySelector('.tooltip_warning_wind');
        tooltip.style.display = 'none';

        // wind speed
        const windLegend = document.querySelectorAll('.warning_wind span');
        windLegend.forEach(span => {
            span.style.outline = 'none';
        });
    };

    const mouseEnterTooltipWaveHeight = async () => {
        const tooltip = document.querySelector('.tooltip_warning_wave');
        tooltip.style.display = 'block';

        // wave height
        const waveLegend = document.querySelectorAll('.warning_wave span');
        const colors = [warningColorWave, 'var(--warning-aqua-green)', 'var(--warning-goldenrod)'];
        waveLegend.forEach((span, index) => {
            span.style.outline = `1px solid ${colors[index]}`;
            span.style.outlineOffset = '1px';
        });
    };

    const mouseLeaveTooltipWaveHeight = async () => {
        // all widgets - hide tooltip
        const tooltip = document.querySelector('.tooltip_warning_wave');
        tooltip.style.display = 'none';

        // wave height
        const waveLegend = document.querySelectorAll('.warning_wave span');
        waveLegend.forEach(span => {
            span.style.outline = 'none';
        });
    };

    // converts daily.weather_code to bootstrap icons
    function getIcon(weeklyWeatherIcon) {
        let weeklyIcon;
        if (weeklyWeatherIcon === 0) {
            weeklyIcon = <i className="bi bi-sun"></i>;
        } else if ([1, 2, 3].includes(weeklyWeatherIcon)) {
            weeklyIcon = <i className="bi bi-clouds"></i>;
        } else if ([45, 48].includes(weeklyWeatherIcon)) {
            weeklyIcon = <i className="bi bi-cloud-fog2"></i>;
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weeklyWeatherIcon)) {
            weeklyIcon = <i className="bi bi-cloud-rain"></i>;
        } else if ([95, 96, 99].includes(weeklyWeatherIcon)) {
            weeklyIcon = <i className="bi bi-cloud-lightning-rain"></i>;
        } else if ([56, 57, 66, 67, 71, 73, 75].includes(weeklyWeatherIcon)) {
            weeklyIcon = <i className="bi bi-cloud-snow"></i>;
        } else if ([77, 85, 86].includes(weeklyWeatherIcon)) {
            weeklyIcon = <i className="bi bi-snow"></i>;
        }
        return weeklyIcon;
    }

    // on click of the forecast, blur the humidity widget
    const handleForecastClick = (dayIndex, index) => {
        setIsHumidityBlurred(true);
        setIsForecastClicked(true);

        setAirTemp(airTemp[index]);
        setWaterTemp(waterTemp[index]);
        setWaveDirection(waveDirection[index]);
        setWaterDirection(waterDirection[index]);
        setWaterVelocity(waterVelocity[index]);
        setWaveHeight(waveHeight[index]);

        setWindSpeed(windSpeed[index]);
        setWindDirect(windDirect[index]);

        setSelectedIndex(index);
        setClickedForecastIcon(getIcon(weeklyWeatherIcon[dayIndex]));

        // Update warningMsgAir based on the clicked forecast icon
        if (weeklyWeatherIcon[dayIndex] === 0) {
            setWarningMsgCloud('Sunny');
            setWarningColorCloud('var(--warning-aqua-green)');
            setTooltipMsgCloud('Ideal');
        } else if ([1, 2, 3].includes(weeklyWeatherIcon[dayIndex])) {
            setWarningMsgCloud('Cloudy');
            setWarningColorCloud('var(--warning-aqua-green)');
            setTooltipMsgCloud('Ideal');
        } else if ([45, 48].includes(weeklyWeatherIcon[dayIndex])) {
            setWarningMsgCloud('Fog');
            setWarningColorCloud('var(--warning-goldenrod)');
            setTooltipMsgCloud('Moderate');
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weeklyWeatherIcon[dayIndex])) {
            setWarningMsgCloud('Rain');
            setWarningColorCloud('var(--warning-goldenrod)');
            setTooltipMsgCloud('Moderate');
        } else if ([95, 96, 99].includes(weeklyWeatherIcon[dayIndex])) {
            setWarningMsgCloud('Thunderstorms');
            setWarningColorCloud('var(--warning-coral)');
            setTooltipMsgCloud('Unsafe');
        } else if ([56, 57, 66, 67, 71, 73, 75].includes(weeklyWeatherIcon[dayIndex])) {
            setWarningMsgCloud('Scattered flurries');
            setWarningColorCloud('var(--warning-goldenrod)');
            setTooltipMsgCloud('Moderate');
        } else if ([77, 85, 86].includes(weeklyWeatherIcon[dayIndex])) {
            setWarningMsgCloud('Snow');
            setWarningColorCloud('var(--warning-coral)');
            setTooltipMsgCloud('Unsafe');
        }
    }

    // return the dashboard
    const handleCurrentDayForecast = () => {
        setIsHumidityBlurred(false);
        setIsForecastClicked(false);
        setSelectedIndex(0);
    }

    return (
        <main>
            {/* 7-Day Forecast */}
            <section className="forecast_seven_section">
                <h2>7-Day Forecast</h2>
                <div className="forecast_seven_container">
                    <ul className="forecast_seven_ul">
                        {/* current getting warning air color */}
                        <li
                            className="forecast_seven_days d-flex flex-column justify-content-center align-content-center"
                            onClick={() => handleCurrentDayForecast()}
                            style={{ background: gradientMostFrequentColor }}
                        >
                            <h5 className="mb-0">Today</h5>
                            <i className="fs-1">{cloudCover}</i>
                            <div className="d-flex flex-column">
                                <span className="celsius mt-2">{currentTemp}°C</span>
                            </div>
                        </li>

                        <li
                            className="forecast_seven_days d-flex flex-column justify-content-center align-content-center"
                            onClick={() => handleForecastClick(0, 1)}
                        >
                            <h5 className="mb-0">{getNextDayName(1)}</h5>
                            <i className="fs-1">{getIcon(weeklyWeatherIcon ? weeklyWeatherIcon[0] : '')}</i>
                            <div className="d-flex flex-column">
                                <span className="celsius mt-2">{weeklyForecast ? weeklyForecast[0] : ''}°C</span>
                            </div>
                        </li>

                        <li
                            className="forecast_seven_days d-flex flex-column justify-content-center align-content-center"
                            onClick={() => handleForecastClick(1, 2)}
                        >
                            <h5 className="mb-0">{getNextDayName(2)}</h5>
                            <i className="fs-1">{getIcon(weeklyWeatherIcon ? weeklyWeatherIcon[1] : '')}</i>
                            <div className="d-flex flex-column">
                                <span className="celsius mt-2">{weeklyForecast ? weeklyForecast[1] : ''}°C</span>
                            </div>
                        </li>

                        <li
                            className="forecast_seven_days d-flex flex-column justify-content-center align-content-center"
                            onClick={() => handleForecastClick(2, 3)}
                        >
                            <h5 className="mb-0">{getNextDayName(3)}</h5>
                            <i className="fs-1">{getIcon(weeklyWeatherIcon ? weeklyWeatherIcon[2] : '')}</i>
                            <div className="d-flex flex-column">
                                <span className="celsius mt-2">{weeklyForecast ? weeklyForecast[2] : ''}°C</span>
                            </div>
                        </li>

                        <li
                            className="forecast_seven_days d-flex flex-column justify-content-center align-content-center"
                            onClick={() => handleForecastClick(3, 4)}
                        >
                            <h5 className="mb-0">{getNextDayName(4)}</h5>
                            <i className="fs-1">{getIcon(weeklyWeatherIcon ? weeklyWeatherIcon[3] : '')}</i>
                            <div className="d-flex flex-column">
                                <span className="celsius mt-2">{weeklyForecast ? weeklyForecast[3] : ''}°C</span>
                            </div>
                        </li>

                        <li
                            className="forecast_seven_days d-flex flex-column justify-content-center align-content-center"
                            onClick={() => handleForecastClick(4, 5)}
                        >
                            <h5 className="mb-0">{getNextDayName(5)}</h5>
                            <i className="fs-1">{getIcon(weeklyWeatherIcon ? weeklyWeatherIcon[4] : '')}</i>
                            <div className="d-flex flex-column">
                                <span className="celsius mt-2">{weeklyForecast ? weeklyForecast[4] : ''}°C</span>
                            </div>
                        </li>

                        <li
                            className="forecast_seven_days d-flex flex-column justify-content-center align-content-center"
                            onClick={() => handleForecastClick(5, 6)}
                        >
                            <h5 className="mb-0">{getNextDayName(6)}</h5>
                            <i className="fs-1">{getIcon(weeklyWeatherIcon ? weeklyWeatherIcon[5] : '')}</i>
                            <div className="d-flex flex-column">
                                <span className="celsius mt-2">{weeklyForecast ? weeklyForecast[5] : ''}°C</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Daily Forecast */}
            <section className="daily_forecast">
                <h2>Daily Forecast</h2>
                <div className="df_grid_container">

                    {/* Air Temp */}
                    <div className="air_temp" style={{ borderBottom: `24px solid ${warningColorAir}` }}>
                        <div className="icon">
                            <i className="bi bi-thermometer-half"></i>
                        </div>
                        <div className="desc">
                            <h4>Air Temp</h4>
                            <p className="subtitle">over water</p>
                            <h2>{airTemp ? airTemp[selectedIndex] : ''}°C</h2>
                            <div className="warning_air_temp" onMouseEnter={mouseEnterTooltipAirTemp} onMouseLeave={mouseLeaveTooltipAirTemp}>
                                <span className="warning_day" style={{ backgroundColor: warningColorAir }}></span>
                                <span className="warning_noon"></span>
                                <span className="warning_night"></span>
                            </div>
                            <div className="forecast_desc">
                                <p>{warningMsgAir}</p>
                            </div>
                            <div className="tooltip_warning_air_temp show">
                                <div className="tooltip_circle">
                                    <span className="circle-day" style={{ backgroundColor: warningColorAir }}></span>
                                    <p><span>Morning:</span> {tooltipMsgAir}</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-noon"></span>
                                    <p><span>Afternoon:</span> Moderate</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-night"></span>
                                    <p><span>Night:</span> Ideal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cloud Cover */}
                    <div className="cloud_cover" style={{ borderBottom: `24px solid ${isForecastClicked ? warningColorCloud : warningColorCloud}` }}>
                        <div className="icon">
                            <i>{isForecastClicked ? clickedForecastIcon : cloudCover}</i>
                        </div>
                        <div className="desc">
                            <h4>Cloud Cover</h4>
                            <div className="forecast_icon" >
                                <i>{isForecastClicked ? clickedForecastIcon : cloudCover}</i>
                            </div>
                            {/* forecast_desc needs to be here */}
                            <div className="forecast_desc">
                            <p>{isForecastClicked ? warningMsgCloud : warningMsgCloud}</p>
                        </div>
                        </div>
                        <div className="warning_cloud_cover" onMouseEnter={mouseEnterTooltipCloud} onMouseLeave={mouseLeaveTooltipCloud}>
                            <span className="warning_day" style={{ backgroundColor: warningColorCloud }}></span>
                            <span className="warning_noon"></span>
                            <span className="warning_night"></span>
                        </div>
                        {/* removed forecast_desc from here */}
                        <div className="tooltip_warning_cloud_cover show">
                            <div className="tooltip_circle">
                                <span className="circle-day" style={{ backgroundColor: warningColorCloud }}></span>
                                <p><span>Morning:</span> {tooltipMsgCloud}</p>
                            </div>
                            <div className="tooltip_circle">
                                <span className="circle-noon"></span>
                                <p><span>Afternoon:</span> Moderate</p>
                            </div>
                            <div className="tooltip_circle">
                                <span className="circle-night"></span>
                                <p><span>Night:</span> Ideal</p>
                            </div>
                        </div>
                    </div>

                    {/* Humidity */}
                    <div className={`humidity ${isHumidityBlurred ? 'blur' : ''}`}>
                        <div className="icon">
                            <i className="bi bi-moisture"></i>
                        </div>
                        <div className="desc">
                            <h4>Humidity</h4>
                            <h2>{humidity}%</h2>
                            <div className="forecast_desc">
                                <p>{humidityMsg}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marine Forecast */}
            <section className="marine_forecast">
                <h2>Marine Forecast</h2>
                <div className="mf_grid_container">

                    {/* Water Temp */}
                    <div className="water_temp" style={{ borderBottom: `24px solid ${warningColorWaterTemp}` }}>
                        <div className="icon">
                            <i className="bi bi-droplet"></i>
                        </div>
                        <div className="desc">
                            <h4>Water Temp</h4>
                            <h2>{waterTemp ? waterTemp[selectedIndex] : ''}°C</h2>
                            <div className="warning_water_temp" onMouseEnter={mouseEnterTooltipWaterTemp} onMouseLeave={mouseLeaveTooltipWaterTemp}>
                                <span className="warning_day" style={{ backgroundColor: warningColorWaterTemp }}></span>
                                <span className="warning_noon"></span>
                                <span className="warning_night"></span>
                            </div>
                            <div className="forecast_desc">
                                <p>{warningMsgWaterTemp}</p>
                            </div>
                            <div className="tooltip_warning_water_temp show">
                                <div className="tooltip_circle">
                                    <span className="circle-day" style={{ backgroundColor: warningColorWaterTemp }}></span>
                                    <p><span>Morning:</span> {tooltipMsgWaterTemp}</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-noon"></span>
                                    <p><span>Afternoon:</span> Moderate</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-night"></span>
                                    <p><span>Night:</span> Ideal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Water Velocity */}
                    <div className="water_velocity" style={{ borderBottom: `24px solid ${warningColorWaterVelocity}` }} >
                        <div className="icon">
                            <i className="bi bi-speedometer2"></i>
                        </div>
                        <div className="desc">
                            <h4>Water Velocity</h4>
                            <h2>{waterVelocity ? waterVelocity[selectedIndex] : ''}<span>m/s</span></h2>
                            <div className="warning_water_velocity" onMouseEnter={mouseEnterTooltipWaterVelocity} onMouseLeave={mouseLeaveTooltipWaterVelocity}>
                                <span className="warning_day" style={{ backgroundColor: warningColorWaterVelocity }}></span>
                                <span className="warning_noon"></span>
                                <span className="warning_night"></span>
                            </div>
                            <div className="forecast_desc">
                                <p>{warningMsgWaterVelocity}</p>
                            </div>
                            <div className="tooltip_warning_water_velocity show">
                                <div className="tooltip_circle">
                                    <span className="circle-day" style={{ backgroundColor: warningColorWaterVelocity }}></span>
                                    <p><span>Morning:</span> {tooltipMsgWaterVelocity}</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-noon"></span>
                                    <p><span>Afternoon:</span> Moderate</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-night"></span>
                                    <p><span>Night:</span> Ideal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Water Direction */}
                    <div className="water_direct">
                        <div className="icon">
                            <i className="bi bi-water"></i>
                        </div>
                        <div className="desc">
                            <h4>Water Direction</h4>
                            <h2>{waterDirection ? waterDirection[selectedIndex] : ''}</h2>
                            <div className="forecast_desc">
                                <p>{waterDirectionData}° {waterDirection ? waterDirection[selectedIndex] : ''} water</p>
                            </div>
                        </div>
                    </div>

                    {/* Wind Speed */}
                    <div className="wind" style={{ borderBottom: `24px solid ${warningColorWind}` }}>
                        <div className="icon">
                            <i className="bi bi-wind"></i>
                        </div>
                        <div className="desc">
                            <h4>Wind</h4>
                            <h2>{windSpeed ? windSpeed[selectedIndex] : ''}<span>km/h</span></h2>
                            <p className="wind_direction">{windDirect ? windDirect[selectedIndex] : ''}</p>
                            <div className="warning_wind" onMouseEnter={mouseEnterTooltipWind} onMouseLeave={mouseLeaveTooltipWind}>
                                <span className="warning_day" style={{ backgroundColor: warningColorWind }}></span>
                                <span className="warning_noon"></span>
                                <span className="warning_night"></span>
                            </div>
                            <div className="forecast_desc">
                                <p>{warningMsgWind}</p>
                            </div>
                            <div className="tooltip_warning_wind show">
                                <div className="tooltip_circle">
                                    <span className="circle-day" style={{ backgroundColor: warningColorWind }}></span>
                                    <p><span>Morning:</span> {tooltipMsgWind}</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-noon"></span>
                                    <p><span>Afternoon:</span> Moderate</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-night"></span>
                                    <p><span>Night:</span> Ideal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave Direction */}
                    <div className="wave_direct">
                        <div className="icon">
                            <i className="bi bi-compass"></i>
                        </div>
                        <div className="desc">
                            <h4>Wave Direction</h4>
                            <h2>{waveDirection ? waveDirection[selectedIndex] : ''}</h2>
                            <div className="forecast_desc">
                                <p>{waveDirectionData}° {waveDirection ? waveDirection[selectedIndex] : ''} waves</p>
                            </div>
                        </div>
                    </div>

                    {/* Wave Height */}
                    <div className="wave_height" style={{ borderBottom: `24px solid ${warningColorWave}` }}>
                        <div className="icon">
                            <i className="bi bi-tsunami"></i>
                        </div>
                        <div className="desc">
                            <h4>Wave Height</h4>
                            <h2>{waveHeight ? waveHeight[selectedIndex] : ''}<span>m</span></h2>
                            <div className="warning_wave_height" onMouseEnter={mouseEnterTooltipWaveHeight} onMouseLeave={mouseLeaveTooltipWaveHeight}>
                                <span className="warning_day" style={{ backgroundColor: warningColorWave }}></span>
                                <span className="warning_noon"></span>
                                <span className="warning_night"></span>
                            </div>
                            <div className="forecast_desc">
                                <p>{warningMsgWave}</p>
                            </div>
                            <div className="tooltip_warning_wave show">
                                <div className="tooltip_circle">
                                    <span className="circle-day" style={{ backgroundColor: warningColorWave }}></span>
                                    <p><span>Morning:</span> {tooltipMsgWave}</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-noon"></span>
                                    <p><span>Afternoon:</span> Moderate</p>
                                </div>
                                <div className="tooltip_circle">
                                    <span className="circle-night"></span>
                                    <p><span>Night:</span> Ideal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>{/* .end of mf_grid_container */}
            </section>
        </main>
    );
};

export default Dashboard;