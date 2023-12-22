const express = require("express");
const singerController = require("../controllers/singerController");
const singerRouter = express.Router();

// Búsqueda de todos los cantantes
singerRouter.get("/allSingers", singerController.getAllSingers);
// Búsqueda de un cantante por su id
singerRouter.get("/:id", singerController.getSingerById);


module.exports = singerRouter;
