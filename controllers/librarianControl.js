const { response } = require("express");
const mongodb = require("../dataBase/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const lists = await db.collection("librarian").find().toArray();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(lists);
  } catch (err) {
    return res.status(500).json({ message: err.message || err });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json("Must use a valid librarian id to find a librarian.");
    }
    const db = mongodb.getDb();
    const user = await db
      .collection("librarian")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      return res.status(404).json("Librarian not found.");
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message || err });
  }
};

const createLibrarian = async (req, res) => {
  const user = {
    name: req.body.name,
    salary: req.body.salary,
    hours: req.body.hours,
  };
  const result = await mongodb.getDb().collection("librarian").insertOne(user);
  if (result.acknowledged) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        result.error || "Some error occurred while creating the librarian.",
      );
  }
};

const updateLibrarian = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res
      .status(400)
      .json("Must use a valid librarian id to update a librarian.");
  }
  const id = new ObjectId(req.params.id);
  const user = {
    name: req.body.name,
    salary: req.body.salary,
    hours: req.body.hours,
  };
  const result = await mongodb
    .getDb()
    .collection("librarian")
    .updateOne({ _id: id }, { $set: user });
  if (result.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        result.error || "Some error occurred while updating the librarian.",
      );
  }
};

const deleteLibrarian = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res
      .status(400)
      .json("Must use a valid librarian id to delete a librarian.");
  }
  const id = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection("librarian")
    .deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        result.error || "Some error occurred while deleting the librarian.",
      );
  }
};

module.exports = {
  getAll,
  getSingle,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian,
};
