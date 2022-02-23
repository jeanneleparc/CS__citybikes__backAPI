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
  const mockData = [
    {
      stationId: 1,
      timeSlot: 1,
      date: moment().day("monday"),
      fillingRate: 0.75,
    },
    {
      stationId: 1,
      timeSlot: 1,
      date: moment().day("monday").subtract(0.5, "days"),
      fillingRate: 1,
    },
    {
      stationId: 1,
      timeSlot: 1,
      date: moment().day("monday").subtract(14, "days"),
      fillingRate: 0.25,
    },
  ];

  const mockStats = mockData.reduce((stats, mock) => {
    const mockStat = createMockStat(mock);
    stats.push(mockStat);
    return stats;
  }, []);

  const body = { weekDay: "monday", timeSlot: 1 };

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
    expect(response.body[0].fillingRate).toBe(0.5);
  });

  test("#4 - GET / - Correct response (test timeslot)", async () => {
    // Populate DB
    await mockStats.forEach((mockStat) =>
      statsByStationByHour.create(mockStat)
    );

    const response = await request(app)
      .post(url)
      .send({ weekDay: "Monday", timeSlot: 25 });

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].stationId).toBe(1);
    expect(response.body[0].fillingRate).toBe(0.5);
  });
});
