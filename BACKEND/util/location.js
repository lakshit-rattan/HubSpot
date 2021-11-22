// const API_KEY = 'abcdefghijklmnopqrst';

// function coordinatesForAddress(address) {
//   return {
//     lat:40.7484474,
//     lng:-73.9871516
//   }
// }




const axios = require("axios");
const HttpError = require("../models/http-error");

async function coordinatesForAddress(address) {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422, 
    );
    throw error;
  }
  const coordinates = data[0];

  return coordinates;
}

module.exports = coordinatesForAddress;
