const express = require('express');
const router  = express.Router(); 
const StationStatus = require("./../models/station-status-model") // new

const stationController = require('../controllers/station_controller'); 

router.get("/station_status", async (req, res) => {
	const status = await StationStatus.find()
	res.send(status)
})
module.exports = router; 