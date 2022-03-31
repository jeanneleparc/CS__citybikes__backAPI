const express = require("express");

const router = express.Router();
const StationController = require("../controllers/station_controller");
const GeocodeController = require("../controllers/geocode_controller");

router.get("/station_status", StationController.getLastStatus);

router.get("/station_information", StationController.getLastInformation);

router.post(
  "/stats_avg_filling_rate_by_station",
  StationController.getAvgFillingRateByIdByDay
);

router.post("/stats_by_station", StationController.getStatsById);

router.post(
  "/stats_by_timeslot",
  StationController.getAvgFillingRateByTimeSlotByDay
);

router.post("/stats_ranking", StationController.getStationsRanking);

router.post("/geocode", GeocodeController.getSuggestions);

module.exports = router;
