const express = require("express");
const operaController = require("../controllers/operaController");
const operaRouter = express.Router();

// Búsqueda de todas las óperas
operaRouter.get("/allOperas", operaController.getAllOperas);
// Búsqueda de una ópera por su id
operaRouter.get("/:id", operaController.getOperaById);


module.exports = operaRouter;
