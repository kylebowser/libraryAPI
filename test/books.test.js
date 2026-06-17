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

describe("GET /books/:id", () => {
  test("returns 400 for invalid Id", async () => {
    const res = await request(app).get("/books/notValidId");

    expect(res.status).toBe(400);
    expect(res.body).toBe("Must use a valid book id to find a book.");
  });

  test("returns 200 and the book when found", async () => {
    const fakeBook = { _id: new ObjectId(), title: "Fake Book" };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve([fakeBook]),
        }),
      }),
    });

    const res = await request(app).get(`/books/${fakeBook._id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      _id: fakeBook._id.toString(),
      title: fakeBook.title,
    });
  });

  test("returns 500 when Db throws an error", async () => {
    mongodb.getDb.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => {
            throw new Error("DB failure");
          },
        }),
      }),
    });

    const validId = new ObjectId().toString();
    const res = await request(app).get(`/books/${validId}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "DB failure" });
  });

  test("returns 200 and null when a book is not found", async () => {
    const validId = new ObjectId().toString();

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
    });

    const res = await request(app).get(`/books/${validId}`);

    expect(res.status).toBe(200);
    expect(res.body).toBe("");
  });
});
