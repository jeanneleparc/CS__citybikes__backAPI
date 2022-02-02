const StationService = require("../services/station_service");

exports.getLastStatus = async (req, res) => {
  try {
    const status = await StationService.getLastStatus();
    if (status.length !== 0) {
      return res.send(status);
    }
    return res.status(202).send({ message: "No status in collection" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getLastInformation = async (req, res) => {
  try {
    const information = await StationService.getLastInformation();
    return res.send(information);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getAvgFillingRateByIdByDay = async (req, res) => {
  try {
    const { id, day } = req.params;
    const stats = await StationService.getAvgFillingRateByIdByDay(id, day);
    return res.json(stats);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getAvgFillingRateByTimeSlotByDay = async (req, res) => {
  try {
    const { timeslot, day } = req.params;
    const stats = await StationService.getAvgFillingRatesByTimeSlot(
      timeslot,
      day
    );
    return res.json(stats);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
