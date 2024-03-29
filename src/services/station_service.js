const moment = require("moment-timezone");
const StationStatus = require("../models/station-status-model");
const StationInformation = require("../models/station-information-model");
const StatsByStationByHour = require("../models/stats-by-station-by-hour-model");
const { WEEK_DAYS } = require("../constants");

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

const getWeekDayMarker = (weekDay) => {
  // get last date of weekDay (monday, tuesday...)
  const startOfLastWeekDay = moment()
    .tz("America/New_York")
    .day(weekDay)
    .startOf("day");
  const weekDayOfToday = moment().tz("America/New_York").startOf("day");
  if (weekDayOfToday <= startOfLastWeekDay) {
    startOfLastWeekDay.subtract(7, "days");
  }
  return startOfLastWeekDay;
};

const getStatsForLast3Weeks = async (dateOfLastWeekDay, otherParams) =>
  StatsByStationByHour.find({
    ...otherParams,
    $or: [
      {
        date: {
          $gte: dateOfLastWeekDay,
          $lt: dateOfLastWeekDay.clone().add(1, "day"),
        },
      },
      {
        date: {
          $gte: dateOfLastWeekDay.clone().subtract(7, "days"),
          $lt: dateOfLastWeekDay.clone().subtract(6, "days"),
        },
      },
      {
        date: {
          $gte: dateOfLastWeekDay.clone().subtract(14, "days"),
          $lt: dateOfLastWeekDay.clone().subtract(13, "days"),
        },
      },
    ],
  });

exports.getAvgFillingRateByIdByDay = async (idStation, day) => {
  const dateOfLastWeekDay = getWeekDayMarker(day);
  const dataAvgFillingRate = [];
  // Get the data for the last three weeks
  const stats = await getStatsForLast3Weeks(dateOfLastWeekDay, {
    station_id: idStation,
  });

  for (let timeSlot = 0; timeSlot < 24; timeSlot += 1) {
    const { sumFillingRate, count } = stats.reduce(
      (accumulator, currentValue) => {
        if (currentValue.time_slot === timeSlot) {
          return {
            sumFillingRate:
              accumulator.sumFillingRate + currentValue.filling_rate,
            count: accumulator.count + 1,
          };
        }
        return accumulator;
      },
      { sumFillingRate: 0, count: 0 }
    );
    dataAvgFillingRate.push({
      timeSlot,
      avgFillingRate: sumFillingRate / count, // we divide by the number of weeks found
    });
  }
  return dataAvgFillingRate;
};

exports.getStatsById = async (idStation) => {
  const stats = {};
  await Promise.all(
    WEEK_DAYS.map(async (weekday) => {
      const statsByWeekday = await this.getAvgFillingRateByIdByDay(
        idStation,
        weekday
      );
      stats[weekday] = statsByWeekday;
    })
  );
  return stats;
};

exports.getStatsByTimeSlot = async (timeSlot, day) => {
  // check if dayOfWeek <= todayDayOfWeek, otherwise substract 7 days
  const dateOfDay = getWeekDayMarker(day);

  // Get the data for the last three weeks of each station for the timeslot
  const stats = await getStatsForLast3Weeks(dateOfDay, { time_slot: timeSlot });

  const result = [];
  const tmpStations = {};

  // for each station, sum the filling_rate of each stat and count the number of stats
  stats.forEach((stat) => {
    const stationId = stat.station_id;
    if (tmpStations[stationId]) {
      tmpStations[stationId].fillingRateAccumulator += stat.filling_rate;
      tmpStations[stationId].bikesNbAccumulator += stat.avg_bikes_nb;
      tmpStations[stationId].counter += 1;
    } else {
      tmpStations[stationId] = {
        name: stat.station_name,
        fillingRateAccumulator: stat.filling_rate,
        bikesNbAccumulator: stat.avg_bikes_nb,
        counter: 1,
        longitude: stat.station_long,
        latitude: stat.station_lat,
      };
    }
  });

  // compute the average filling rate for each station
  Object.keys(tmpStations).forEach((stationId) => {
    const station = tmpStations[stationId];
    result.push({
      id: parseInt(stationId, 10),
      name: station.name,
      fillingRate: Math.round(
        (station.fillingRateAccumulator / station.counter) * 100
      ),
      avgBikesNb: Math.round(station.bikesNbAccumulator / station.counter),
      longitude: station.longitude,
      latitude: station.latitude,
    });
  });
  return result;
};

exports.getStationsRanking = async (timeSlot, day) => {
  // get the stations stats
  const stationsStats = await this.getStatsByTimeSlot(timeSlot, day);

  // sort the stations by filling rate desc, return the first 10 stations
  return stationsStats
    .sort((a, b) => b.fillingRate - a.fillingRate)
    .slice(0, 10);
};
