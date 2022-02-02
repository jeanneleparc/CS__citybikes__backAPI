const express = require("express");

const router = express.Router();
const StationController = require("../controllers/station_controller");

router.get("/station_status", StationController.getLastStatus);

router.get("/station_information", StationController.getLastInformation);

router.get(
  "/stats_avg_filling_rate/:id/:day",
  StationController.getAvgFillingRateByIdByDay
);

router.get(
  "/stats_avg_filling_rate_by_timeslot/:timeslot/:day",
  StationController.getAvgFillingRateByTimeSlotByDay
);

module.exports = router;
