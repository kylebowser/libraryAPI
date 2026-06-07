const routes = require("express").Router();
const bookControl = require("../controllers/bookControl");
const patronControl = require("../controllers/patronControl.js");
const librarianControl = require("../controllers/librarianControl.js");
const audioBookControl = require("../controllers/audioBookControl.js");
const validation = require("../middleware/validate");
const auth = require("../middleware/authenticate.js");
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;

routes.get("/login", passport.authenticate("github"));

//, (req, res) => {}

routes.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

routes.get("/", bookControl.getData);

routes.get("/books", bookControl.getAll);

routes.get("/books/:id", bookControl.getSingle);

routes.post("/books", auth, validation.saveBook, bookControl.createBook);

routes.put("/books/:id", auth, validation.saveBook, bookControl.updateBook);

routes.delete("/books/:id", auth, bookControl.deleteBook);

routes.get("/patrons", patronControl.getAll);

routes.get("/patrons/:id", patronControl.getSingle);

routes.post(
  "/patrons",
  auth,
  validation.savePatron,
  patronControl.createPatron,
);

routes.put(
  "/patrons/:id",
  auth,
  validation.savePatron,
  patronControl.updatePatron,
);

routes.delete("/patrons/:id", auth, patronControl.deletePatron);

routes.get("/audio-books", audioBookControl.getAll);

routes.get("/audio-books/:id", audioBookControl.getSingle);

routes.post(
  "/audio-books",
  auth,
  validation.saveAudioBook,
  audioBookControl.createBook,
);

routes.put(
  "/audio-books/:id",
  auth,
  validation.saveAudioBook,
  audioBookControl.updateBook,
);

routes.delete("/audio-books/:id", auth, audioBookControl.deleteBook);

// Librarian routes

routes.get("/librarians", librarianControl.getAll);

routes.get("/librarians/:id", librarianControl.getSingle);

routes.post(
  "/librarians",
  auth,
  validation.saveLibrarian,
  librarianControl.createLibrarian,
);

routes.put(
  "/librarians/:id",
  auth,
  validation.saveLibrarian,
  librarianControl.updateLibrarian,
);

routes.delete("/librarians/:id", auth, librarianControl.deleteLibrarian);

module.exports = routes;
