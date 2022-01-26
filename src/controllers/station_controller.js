var StationService = require('../services/station_service')    

exports.getLastStatus = async function (req, res) {
    try {
        var status = await StationService.getLastStatus()
        return res.send(status);
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getLastInformation = async function (req, res) {
    try {
        var information = await StationService.getLastInformation();
        return res.send(information);
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getAvgFillingRateByIdByDay = async function (req, res) {
    try {
        const id = req.params.id;
        const day = req.params.day;
        const stats = await StationService.getAvgFillingRateByIdByDay(id, day)
        return res.json(stats)
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}