const express = require("express");
const budgetRequestController = require("../controllers/budgetRequestController");
const budgetRequestRouter = express.Router();

// Búsqueda de todos los presupuestos
budgetRequestRouter.get("/allBudgetRequests", budgetRequestController.getAllBudgetRequests);
// Registro de un presupuesto
budgetRequestRouter.post("/", budgetRequestController.addBudgetRequest);


module.exports = budgetRequestRouter;
