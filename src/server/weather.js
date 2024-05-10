import axios from 'axios';

// connection to the weather API
let weatherUrl = process.env.REACT_APP_WEATHER_API_BASE_URL;

// fetch weather data from the API
let fetchWeatherData = async () => {
  let response = await axios.get(weatherUrl);
  let data = response.data;
  //console.log(data);
  return data;
};
export default fetchWeatherData;