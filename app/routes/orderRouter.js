const express = require("express");
const orderController = require("../controllers/orderController");

const orderRouter = express.Router();

// Router de añadir un nuevo pedido realizado por un usuario
orderRouter.post("/", orderController.addOrder);
// Router de buscar los pedidos realizados por un usuario
orderRouter.get("/user/:idClient", orderController.getUserOrders);


module.exports = orderRouter;
