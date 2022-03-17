const request = require("request");

exports.getSuggestions = async (req, res) => {
  const { q: text } = req.body;
  const geocodeApiKEY = process.env.GEOCODE_API_KEY;
  const url = `https://app.geocodeapi.io/api/v1/autocomplete?apikey=${geocodeApiKEY}&text=${text}&size=100`;
  request({ url }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const result = JSON.parse(body);
      return res.status(200).send(
        result.features
          .filter((e) => e.properties.region_a === "NY")
          .map((e) => ({
            coordinates: e.geometry.coordinates,
            label: e.properties.label,
          }))
      );
    }
    return res.status(response.statusCode);
  });
};
