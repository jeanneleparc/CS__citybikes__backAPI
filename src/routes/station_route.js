const express = require('express');
const router  = express.Router(); 
const StationStatus = require("./../models/station-status-model") // new
const StationInformation = require("./../models/station-information-model") // new

// const stationController = require('../controllers/station_controller'); 

router.get("/station_status", async (req, res) => {
	const status = await StationStatus.find().sort({ "last_updated": -1 }).limit(1)
	res.send(status)
})

router.get("/station_information", async (req, res) => {
	const information = await StationInformation.find().sort({ "last_updated": -1 }).limit(1)
	res.send(information)
})
module.exports = router; 