const express = require("express");
const objectController = require("../controllers/objectController");
const objectRouter = express.Router();

// Búsqueda de objetos por palabra
objectRouter.get("/:queryWord", objectController.getObjectsByWord);


module.exports = objectRouter;
