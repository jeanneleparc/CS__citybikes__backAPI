// Appel des modules
const moment = require("moment-timezone");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const statsByStationByHour = require("../src/models/stats-by-station-by-hour-model");

const url = "/stats_avg_filling_rate_by_timeslot";

/* Supprimer toutes les stats */
function deleteAll() {
  // Requête Mongoose - https://mongoosejs.com/docs/api.html#query_Query-deleteMany
  return statsByStationByHour
    .deleteMany({})
    .then((result) => result)
    .catch((err) => {
      console.error(err);
    });
}

beforeAll(() => deleteAll());

afterAll(() => {
  mongoose.connection.close();
});

function createMockStat({ stationId, timeSlot, date, fillingRate }) {
  return {
    station_id: stationId,
    station_name: "station",
    station_long: 0,
    station_lat: 0,
    time_slot: timeSlot,
    filling_rate: fillingRate,
    avg_bikes_nb: 3,
    date,
  };
}

describe("Route Average Filling Rate by Time Slot", () => {
  // 3 mock data with 1 on a Sunday
  const mockData = [
    {
      stationId: 1,
      timeSlot: 1,
      station_long: 10,
      station_lat: 10,
      date: moment().day("monday").tz("America/New_York").startOf("day"),
      fillingRate: 0.75,
      avg_bikes_nb: 30,
    },
    {
      stationId: 1,
      timeSlot: 1,
      station_long: 10,
      station_lat: 10,
      date: moment()
        .day("monday")
        .tz("America/New_York")
        .startOf("day")
        .subtract(1, "days"),
      fillingRate: 1,
      avg_bikes_nb: 40,
    },
    {
      stationId: 1,
      timeSlot: 1,
      station_long: 10,
      station_lat: 10,
      date: moment()
        .day("monday")
        .tz("America/New_York")
        .startOf("day")
        .subtract(14, "days"),
      fillingRate: 0.25,
      avg_bikes_nb: 10,
    },
  ];

  const mockStats = mockData.reduce((stats, mock) => {
    const mockStat = createMockStat(mock);
    stats.push(mockStat);
    return stats;
  }, []);

  const body = { weekDay: "Monday", timeSlot: 1 };

  test("#1 - GET / - Without params timeSlot and weekDay", async () => {
    const response = await request(app).post(url);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "You must give a timeSlot and a weekDay."
    );
  });

  test("#2 - GET / - Uncorrect weekDay", async () => {
    const response = await request(app)
      .post(url)
      .send({ weekDay: "hello", timeSlot: 1 });
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Please choose a weekday: Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
    );
  });

  test("#3 - GET / - Uncorrect time slot", async () => {
    const response = await request(app)
      .post(url)
      .send({ weekDay: "Monday", timeSlot: "hello" });
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Time slot must be a number.");
  });

  test("#4 - GET / - Correct response", async () => {
    // Populate DB
    await mockStats.forEach((mockStat) =>
      statsByStationByHour.create(mockStat)
    );

    const response = await request(app).post(url).send(body);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].stationId).toBe(1);
    expect(response.body[0].fillingRate).toBe(50);
    expect(response.body[0].avgBikesNb).toBe(20);
    expect(response.body[0].longitude).toBe(10);
    expect(response.body[0].latitude).toBe(10);
  });

  test("#4 - GET / - Correct response (test timeslot)", async () => {
    const response = await request(app)
      .post(url)
      .send({ weekDay: "Monday", timeSlot: 25 });

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].stationId).toBe(1);
    expect(response.body[0].fillingRate).toBe(50);
    expect(response.body[0].avgBikesNb).toBe(20);
    expect(response.body[0].longitude).toBe(10);
    expect(response.body[0].latitude).toBe(10);
  });
});
