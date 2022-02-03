const StationService = require("../services/station_service");

const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "saturday",
  "sunday",
];

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
  const { id, day } = req.params;
  try {
    const stats = await StationService.getAvgFillingRateByIdByDay(id, day);
    return res.json(stats);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getAvgFillingRateByTimeSlotByDay = async (req, res) => {
  const { weekDay, timeSlot } = req.body;

  if (timeSlot === undefined || weekDay === undefined) {
    return res.status(400).json({
      status: 400,
      message: "You must give a timeSlot and a weekDay.",
    });
  }
  if (typeof timeSlot !== "number") {
    return res
      .status(400)
      .json({ status: 400, message: "Time slot must be a number." });
  }
  if (!WEEK_DAYS.includes(weekDay)) {
    return res
      .status(400)
      .json({ status: 400, message: `Please choose a weekday: ${WEEK_DAYS}` });
  }
  try {
    const stats = await StationService.getAvgFillingRatesByTimeSlot(
      timeSlot % 24,
      weekDay
    );
    return res.json(stats);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
