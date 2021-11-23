const axios = require("axios");
const HttpError = require("../models/http-error");
require("dotenv").config({ path: "../BACKEND/auth.env" });

async function coordinatesForAddress(address) {
  const response = await axios.get(
    `http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.MAP_QUEST}&location=${encodeURIComponent(address)}&maxResults=1`
  );

  const data = response.data;

  if (!data || data.results[0].locations[0].latLng.lat==39.78373) {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422, 
    );
    throw error;
  }
  const coordinates = data.results[0].locations[0].latLng;

  return coordinates;
}

module.exports = coordinatesForAddress;
