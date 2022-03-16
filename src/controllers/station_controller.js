const StationService = require("../services/station_service");

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
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
  const { id, weekDay } = req.body;

  if (id === undefined || weekDay === undefined) {
    return res.status(400).json({
      status: 400,
      message: "You must give a station id and a weekDay.",
    });
  }
  if (typeof id !== "number") {
    return res
      .status(400)
      .json({ status: 400, message: "Station id must be a number." });
  }
  if (!WEEK_DAYS.includes(weekDay)) {
    return res
      .status(400)
      .json({ status: 400, message: `Please choose a weekday: ${WEEK_DAYS}` });
  }
  try {
    const stats = await StationService.getAvgFillingRateByIdByDay(id, weekDay);
    return res.json(stats);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

const checkTimeSlotAndWeekday = (weekDay, timeSlot) => {
  if (timeSlot === undefined || weekDay === undefined) {
    return "You must give a timeSlot and a weekDay.";
  }
  if (typeof timeSlot !== "number") {
    return "Time slot must be a number.";
  }
  if (!WEEK_DAYS.includes(weekDay)) {
    return `Please choose a weekday: ${WEEK_DAYS}`;
  }
  return "";
};

exports.getAvgFillingRateByTimeSlotByDay = async (req, res) => {
  const { weekDay, timeSlot } = req.body;

  const errorMsg = checkTimeSlotAndWeekday(weekDay, timeSlot);
  if (errorMsg !== "") {
    return res.status(400).json({ status: 400, message: errorMsg });
  }

  try {
    const stats = await StationService.getStatsByTimeSlot(
      timeSlot % 24,
      weekDay
    );
    return res.json(stats);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getStationsRanking = async (req, res) => {
  const { weekDay, timeSlot } = req.body;

  const errorMsg = checkTimeSlotAndWeekday(weekDay, timeSlot);
  if (errorMsg !== "") {
    return res.status(400).json({ status: 400, message: errorMsg });
  }

  try {
    const stats = await StationService.getStationsRanking(
      timeSlot % 24,
      weekDay
    );
    return res.json(stats);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
