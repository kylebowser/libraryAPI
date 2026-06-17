const request = require("supertest");
const express = require("express");
const routes = require("../routes");
const ObjectId = require("mongodb").ObjectId;

// const { getSingle } = require("../controllers/bookControl.js");
const mongodb = require("../dataBase/connect");

// jest.mock("passport", () => ({
//   authenticate: () => (req, res, next) => next(),
// }));

jest.mock("../dataBase/connect", () => ({
  getDb: jest.fn(),
}));

const app = express();

app.use("/", routes);

describe("GET /patrons/:id", () => {
  test("returns 400 for invalid Id", async () => {
    const res = await request(app).get("/patrons/notValidId");

    expect(res.status).toBe(400);
    expect(res.body).toBe("Must use a valid patron id to find a patron.");
  });

  test("returns 200 and the patron when found", async () => {
    const fakePatron = { _id: new ObjectId(), title: "Fake patron" };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: () => Promise.resolve(fakePatron),
      }),
    });

    const res = await request(app).get(`/patrons/${fakePatron._id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      _id: fakePatron._id.toString(),
      title: fakePatron.title,
    });
  });

  test("returns 500 when Db throws an error", async () => {
    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: () => {
          throw new Error("DB failure");
        },
      }),
    });

    const validId = new ObjectId().toString();
    const res = await request(app).get(`/patrons/${validId}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "DB failure" });
  });

  test("returns 200 and null when a patron is not found", async () => {
    const validId = new ObjectId().toString();

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: () => Promise.resolve(null),
      }),
    });

    const res = await request(app).get(`/patrons/${validId}`);

    expect(res.status).toBe(404);
    expect(res.body).toBe("Patron not found.");
  });
});
