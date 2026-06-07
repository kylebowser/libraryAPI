const { response } = require("express");
const mongodb = require("../dataBase/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const lists = await db.collection("audio_books").find().toArray();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(lists);
  } catch (err) {
    return res.status(500).json({ message: err.message || err });
  }
};

const getData = getAll;

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json("Must use a valid book id to find a book.");
    }
    const id = new ObjectId(req.params.id);
    const db = mongodb.getDb();
    const lists = await db
      .collection("audio_books")
      .find({ _id: id })
      .toArray();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(lists[0]);
  } catch (err) {
    return res.status(500).json({ message: err.message || err });
  }
};

const createBook = async (req, res) => {
  const book = {
    name: req.body.name,
    authorName: req.body.authorName,
    narrator: req.body.narrator,
    genre: req.body.genre,
    minutes: req.body.minutes,
    fine: req.body.fine,
    publisher: req.body.publisher,
    publicationDate: req.body.publicationDate,
    checkedOut: req.body.checkedOut,
  };
  const result = await mongodb
    .getDb()
    .collection("audio_books")
    .insertOne(book);
  if (result.acknowledged) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while creating the book.");
  }
};

const updateBook = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid book id to update a book.");
  }
  const id = new ObjectId(req.params.id);
  const book = {
    name: req.body.name,
    authorName: req.body.authorName,
    narrator: req.body.narrator,
    genre: req.body.genre,
    minutes: req.body.minutes,
    fine: req.body.fine,
    publisher: req.body.publisher,
    publicationDate: req.body.publicationDate,
    checkedOut: req.body.checkedOut,
  };
  const result = await mongodb
    .getDb()
    .collection("audio_books")
    .updateOne({ _id: id }, { $set: book });
  if (result.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while updating the book.");
  }
};

const deleteBook = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid book id to delete a book.");
  }
  const id = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection("audio_books")
    .deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while deleting the book.");
  }
};

module.exports = {
  getData,
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook,
};
