const moment = require("moment-timezone");
const StationStatus = require("../models/station-status-model");
const StationInformation = require("../models/station-information-model");
const StatsByStationByHour = require("../models/stats-by-station-by-hour-model");

exports.getLastStatus = async () => {
  const lastStatus = await StationStatus.findOne().sort({ last_updated: -1 });
  return StationStatus.find({
    last_updated: lastStatus ? lastStatus.last_updated : undefined,
  });
};

exports.getLastInformation = async () => {
  const information = await StationInformation.find().sort({
    last_updated: -1,
  });
  return information;
};

exports.getAvgFillingRateByIdByDay = async (idStation, day) => {
  const dateOfDay = moment().tz("America/New_York").day(day).startOf("day");
  const dateOfToday = moment().tz("America/New_York").startOf("day");
  if (dateOfToday <= dateOfDay) {
    dateOfDay.subtract(7, "days");
  }
  const dataAvgFillingRate = [];
  // Get the data for the last three weeks
  const stats = await StatsByStationByHour.find({
    station_id: idStation,
    $or: [
      { date: { $gte: dateOfDay, $lt: dateOfDay.clone().add(1, "day") } },
      {
        date: {
          $gte: dateOfDay.clone().subtract(7, "days"),
          $lt: dateOfDay.clone().subtract(6, "days"),
        },
      },
      {
        date: {
          $gte: dateOfDay.clone().subtract(14, "days"),
          $lt: dateOfDay.clone().subtract(13, "days"),
        },
      },
    ],
  });
  for (let timeSlot = 0; timeSlot < 24; timeSlot += 1) {
    const sumFillingRateByTimeSlot = stats.reduce(
      (accumulator, currentValue) => {
        if (currentValue.time_slot === timeSlot) {
          return accumulator + currentValue.filling_rate;
        }
        return accumulator;
      },
      0
    );
    dataAvgFillingRate.push({
      timeSlot,
      avgFillingRate: sumFillingRateByTimeSlot / 3, // we divide by the number of weeks
    });
  }
  return dataAvgFillingRate;
};
