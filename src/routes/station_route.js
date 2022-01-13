const express = require("express");

const router = express.Router();
const StationStatus = require("../models/station-status-model");
const StationInformation = require("../models/station-information-model");

// const stationController = require('../controllers/station_controller');

router.get("/station_status", async (req, res) => {
  const lastStatus = await StationStatus.findOne().sort({ last_updated: -1 }); // get the last update date
  const status = await StationStatus.find({
    last_updated: lastStatus.last_updated,
  }); // get all status for this date
  res.send(status);
});

router.get("/station_information", async (req, res) => {
  const information = await StationInformation.find().sort({
    last_updated: -1,
  });
  res.send(information);
});
module.exports = router;
