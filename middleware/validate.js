const validator = require("../helpers/validate");

const saveBook = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    authorName: "required|string",
    genre: "required|string",
    pageCount: "required|integer",
    fine: "required|numeric",
    publisher: "required|string",
    publicationDate: "required|string",
    checkedOut: "required|boolean",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const saveAudioBook = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    authorName: "required|string",
    narrator: "required|string",
    genre: "required|string",
    minutes: "required|integer",
    fine: "required|numeric",
    publisher: "required|string",
    publicationDate: "required|string",
    checkedOut: "required|boolean",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const saveLibrarian = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    salary: "required|numeric",
    hours: "required|numeric",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const savePatron = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    checkedOut: "required|integer",
    finesDue: "required|numeric",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = { saveBook, saveAudioBook, saveLibrarian, savePatron };
