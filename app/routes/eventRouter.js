const express = require("express");
const eventController = require("../controllers/eventController");
const eventRouter = express.Router();

// Búsqueda de todos los eventos
eventRouter.get("/allEvents", eventController.getAllEvents);
// Búsqueda de un evento por su id
eventRouter.get("/:id", eventController.getEventById);
// Búsqueda de todos los eventos que cumplan condiciones
eventRouter.get("/eventsWithConditions", eventController.getEventsWithConditions);
eventRouter.post("/eventsWithConditions", eventController.getEventsWithConditions);
// He añadido este POST para poder enviar el JSON en el body (el GET no deja enviar contenido del body).


module.exports = eventRouter;
