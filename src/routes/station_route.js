const express = require("express");

const router = express.Router();
const StationController = require("../controllers/station_controller");

router.get("/station_status", StationController.getLastStatus);

router.get("/station_information", StationController.getLastInformation);

router.post(
  "/stats_avg_filling_rate_by_station",
  StationController.getAvgFillingRateByIdByDay
);

router.post(
  "/stats_by_timeslot",
  StationController.getAvgFillingRateByTimeSlotByDay
);

router.post("/stats_ranking", StationController.getStationsRanking);

module.exports = router;
