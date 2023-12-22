const express = require("express");
const theatreController = require("../controllers/theatreController");
const theatreRouter = express.Router();

// Búsqueda de todos los teatros
theatreRouter.get("/allTheatres", theatreController.getAllTheatres);
// Búsqueda de un teatro por su id
theatreRouter.get("/:id", theatreController.getTheatreById);


module.exports = theatreRouter;
