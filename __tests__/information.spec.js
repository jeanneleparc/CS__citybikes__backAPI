// Appel des modules
const request = require("supertest");
const server = require("../app");
const Information = require("../src/models/station-information-model");

const url = "/station_information";

/* Supprimer tous les status */
function deleteAll() {
  // Requête Mongoose - https://mongoosejs.com/docs/api.html#query_Query-deleteMany
  return Information.deleteMany({})
    .then((result) => result)
    .catch((err) => {
      console.error(err);
    });
}

beforeAll(() => deleteAll());

describe("Route Information", () => {
  const mockInformation = {
    id: 1,
    name: "station",
    longitude: 0,
    latitude: 0,
    capacity: 2,
    last_updated: new Date(),
    has_kiosk: true,
  };

  test("#1 - GET / - Good", async () => {
    // Populate DB
    await Information.create(mockInformation);

    const response = await request(server).get(`${url}`);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(mockInformation.id);
    expect(response.body[0].name).toBe(mockInformation.name);
    expect(response.body[0].longitude).toBe(mockInformation.longitude);
    expect(response.body[0].latitude).toBe(mockInformation.latitude);
    expect(response.body[0].capacity).toBe(mockInformation.capacity);
    expect(response.body[0].last_updated).toBe(
      mockInformation.last_updated.toISOString()
    );
    expect(response.body[0].has_kiosk).toBe(mockInformation.has_kiosk);
  });
});
