const { response } = require("express");
const mongodb = require("../dataBase/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const lists = await db.collection("patrons").find().toArray();
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
        .json("Must use a valid patron id to find a patron.");
    }
    const db = mongodb.getDb();
    const user = await db
      .collection("patrons")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      return res.status(404).json("Patron not found.");
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message || err });
  }
};

const createPatron = async (req, res) => {
  const user = {
    name: req.body.name,
    checkedOut: req.body.checkedOut,
    finesDue: req.body.finesDue,
  };
  const result = await mongodb.getDb().collection("patrons").insertOne(user);
  if (result.acknowledged) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while creating the patron.");
  }
};

const updatePatron = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid patron id to update a patron.");
  }
  const id = new ObjectId(req.params.id);
  const user = {
    name: req.body.name,
    checkedOut: req.body.checkedOut,
    finesDue: req.body.finesDue,
  };
  const result = await mongodb
    .getDb()
    .collection("patrons")
    .updateOne({ _id: id }, { $set: user });
  if (result.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while updating the patron.");
  }
};

const deletePatron = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid patron id to delete a patron.");
  }
  const id = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection("patrons")
    .deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while deleting the patron.");
  }
};

module.exports = {
  getAll,
  getSingle,
  createPatron,
  updatePatron,
  deletePatron,
};
