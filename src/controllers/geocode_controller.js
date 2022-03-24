const GeocodeService = require("../services/geocode_service");

exports.getSuggestions = async (req, res) => {
  const { q: text } = req.body;
  const result = await GeocodeService.getSuggestions(text).catch((error) =>
    res.status(400).send(error.message)
  );
  res.send(result);
};
