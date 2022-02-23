// Appel des modules
const moment = require("moment-timezone");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const StatsByStationByHour = require("../src/models/stats-by-station-by-hour-model");

const url = "/stats_avg_filling_rate/";

/* Supprimer tous les status */
function deleteAll() {
  // Requête Mongoose - https://mongoosejs.com/docs/api.html#query_Query-deleteMany
  return StatsByStationByHour.deleteMany({})
    .then((result) => result)
    .catch((err) => {
      console.error(err);
    });
}

beforeAll(() => deleteAll());

afterAll(() => {
  mongoose.connection.close();
});

describe("Route Stats By Id By Day", () => {
  const dateOfToday = moment()
    .tz("America/New_York")
    .startOf("day")
    .subtract(1, "day");
  const dayOfTheWeek = dateOfToday.clone().format("dddd");
  const mockStatsByIdByDay = [];
  const capacityStation1 = 40;
  const sumFillingRateArray = new Array(24).fill(0);
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 24; j += 1) {
      const tmpFillRate = Math.random();
      const tmpObj = {
        station_id: 1,
        station_name: "Central Park",
        station_long: 10,
        station_lat: 10,
        time_slot: j,
        filling_rate: tmpFillRate,
        avg_bikes_nb: tmpFillRate * capacityStation1,
        date: dateOfToday.clone().subtract(i * 7, "days"),
      };
      sumFillingRateArray[j] += tmpFillRate;
      mockStatsByIdByDay.push(tmpObj);
    }
  }
  const avgFillingRate = sumFillingRateArray.map((elt) => elt / 3);

  test("#1 - GET / - Without data return 200", async () => {
    const response = await request(app)
      .post(url)
      .send({ id: 1, weekDay: dayOfTheWeek });
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
  });

  test("#2 - GET / - Without params idStation and weekDay", async () => {
    const response = await request(app).post(url);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "You must give a station id and a weekDay."
    );
  });

  test("#2 - GET / - Uncorrect weekDay", async () => {
    const response = await request(app)
      .post(url)
      .send({ weekDay: "hello", id: 1 });
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Please choose a weekday: Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
    );
  });

  test("#3 - GET / - Uncorrect station id", async () => {
    const response = await request(app)
      .post(url)
      .send({ weekDay: dayOfTheWeek, timeSlot: "Hello" });
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Station id must be a number.");
  });

  test("#2 - GET / - Good", async () => {
    // Populate DB
    await StatsByStationByHour.insertMany(mockStatsByIdByDay);

    const response = await request(app)
      .post(url)
      .send({ id: 1, weekDay: dayOfTheWeek });
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(24);
    for (let i = 0; i < 24; i += 1) {
      expect(response.body[i].timeSlot).toBeDefined();
      expect(response.body[i].avgFillingRate).toBeDefined();
      expect(response.body[i].timeSlot).toEqual(i);
      expect(response.body[i].avgFillingRate).toEqual(avgFillingRate[i]);
    }
  });
});
