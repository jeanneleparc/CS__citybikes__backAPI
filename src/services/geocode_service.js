const axios = require("axios");

exports.getSuggestions = async (text) => {
  const geocodeApiKEY = process.env.GEOCODE_API_KEY;
  const url = `https://app.geocodeapi.io/api/v1/autocomplete?apikey=${geocodeApiKEY}&text=${text}&size=100`;
  return axios.get(url).then((response) =>
    response.data.features
      .filter((e) => e.properties.region_a === "NY")
      .map((e) => ({
        coordinates: {
          long: e.geometry.coordinates[0],
          lat: e.geometry.coordinates[1],
        },
        label: e.properties.label,
      }))
  );
};
