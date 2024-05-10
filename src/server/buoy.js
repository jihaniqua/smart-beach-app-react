import axios from 'axios';

// connection to the weather API
let buoyUrl = process.env.REACT_APP_BUOY_API_BASE_URL;

// fetch buoy data from the API
let fetchBuoyData = async () => {
  let response = await axios.get(buoyUrl);
  let data = response.data;
  //console.log(data);
  return data;
};
export default fetchBuoyData;