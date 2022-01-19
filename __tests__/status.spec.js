// Appel des modules
const request = require("supertest");
const server = require("../app");
const Status = require("../src/models/station-status-model");

const url = "/station_status";

/* Supprimer tous les status */
function deleteAll() {
  // Requête Mongoose - https://mongoosejs.com/docs/api.html#query_Query-deleteMany
  return Status.deleteMany({})
    .then((result) => result)
    .catch((err) => {
      console.error(err);
    });
}

beforeAll(() => deleteAll());

describe("Route Status", () => {
  const mockStatus = {
    id: 1,
    name: "station",
    longitude: 0,
    latitude: 0,
    capacity: 2,
    num_docks_available: 1,
    num_bikes_available: 1,
    num_docks_disabled: 1,
    num_bikes_disabled: 1,
    num_ebikes: 1,
    station_status: "active",
    is_installed: true,
    last_updated: new Date(),
    has_kiosk: true,
  };
  test("#1 - GET / - Without data return 202", async () => {
    const response = await request(server).get(url);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(202);
    expect(response.body.message).toBe("No status in collection");
  });

  test("#2 - GET / - Good", async () => {
    // Populate DB
    await Status.create(mockStatus);

    const response = await request(server).get(`${url}`);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(mockStatus.id);
    expect(response.body[0].name).toBe(mockStatus.name);
    expect(response.body[0].longitude).toBe(mockStatus.longitude);
    expect(response.body[0].latitude).toBe(mockStatus.latitude);
    expect(response.body[0].capacity).toBe(mockStatus.capacity);
    expect(response.body[0].num_docks_available).toBe(
      mockStatus.num_docks_available
    );
    expect(response.body[0].num_bikes_available).toBe(
      mockStatus.num_bikes_available
    );
    expect(response.body[0].num_docks_disabled).toBe(
      mockStatus.num_docks_disabled
    );
    expect(response.body[0].num_bikes_disabled).toBe(
      mockStatus.num_bikes_disabled
    );
    expect(response.body[0].num_ebikes).toBe(mockStatus.num_ebikes);
    expect(response.body[0].station_status).toBe(mockStatus.station_status);
    expect(response.body[0].is_installed).toBe(mockStatus.is_installed);
    expect(response.body[0].last_updated).toBe(
      mockStatus.last_updated.toISOString()
    );
    expect(response.body[0].has_kiosk).toBe(mockStatus.has_kiosk);
  });
});
