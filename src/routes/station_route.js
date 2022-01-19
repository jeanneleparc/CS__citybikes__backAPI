const express = require("express");

const router = express.Router();
const StationStatus = require("../models/station-status-model");
const StationInformation = require("../models/station-information-model");

// const stationController = require('../controllers/station_controller');

router.get("/station_status", async (req, res) => {
  const lastStatus = await StationStatus.findOne().sort({ last_updated: -1 });
  return StationStatus.find({
    last_updated: lastStatus ? lastStatus.last_updated : undefined,
  })
    .then((result) => {
      if (lastStatus) {
        res.send(result);
      } else {
        res.status(202).send({ message: "No status in collection" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/station_information", async (req, res) => {
  const information = await StationInformation.find().sort({
    last_updated: -1,
  });
  res.send(information);
});
module.exports = router;
