const express = require('express');
const router  = express.Router(); 
const StationStatus = require('./../models/station-status-model') // new
const StationInformation = require('./../models/station-information-model'); // new
const { status } = require('express/lib/response');

// const stationController = require('../controllers/station_controller');

router.get('/station_status', async (req, res) => {
	const lastStatus = await StationStatus.findOne().sort({ 'last_updated': -1 }); // récupérer la dernière date d'update
	const status = await StationStatus.find({ 'last_updated': lastStatus.last_updated }) // récupérer les status à cette date
	res.send(status)
})

router.get('/station_information', async (req, res) => {
	const information = await StationInformation.find().sort({ 'last_updated': -1 })
	res.send(information)
})
module.exports = router; 