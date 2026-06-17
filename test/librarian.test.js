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

describe("GET /librarians/:id", () => {
  test("returns 400 for invalid Id", async () => {
    const res = await request(app).get("/librarians/notValidId");

    expect(res.status).toBe(400);
    expect(res.body).toBe("Must use a valid librarian id to find a librarian.");
  });

  test("returns 200 and the Librarian when found", async () => {
    const fakeLib = { _id: new ObjectId(), title: "Fake Lib" };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: () => Promise.resolve(fakeLib),
      }),
    });

    const res = await request(app).get(`/librarians/${fakeLib._id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      _id: fakeLib._id.toString(),
      title: fakeLib.title,
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
    const res = await request(app).get(`/librarians/${validId}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "DB failure" });
  });

  test("returns 200 and null when a librarian is not found", async () => {
    const validId = new ObjectId().toString();

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: () => Promise.resolve(null),
      }),
    });

    const res = await request(app).get(`/librarians/${validId}`);

    expect(res.status).toBe(404);
    expect(res.body).toBe("Librarian not found.");
  });
});
