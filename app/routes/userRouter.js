const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const validateLoginDto = require("../utils/validateLoginDto");

// Registro de un usuario
userRouter.post("/", userController.addUser);
// Login de un usuario
userRouter.post("/login", validateLoginDto, userController.loginUser);
// Búsqueda de un usuario por su email
userRouter.get("/:email", userController.getUserByEmail);
// Búsqueda de un usuario por su id
userRouter.get("/userId/:id", userController.getUserById);
// Eliminación de un usuario por su id
userRouter.delete("/:id", userController.deleteUser);
// Actualización de un usuario por su id
userRouter.patch("/:id", userController.updateUser);


module.exports = userRouter;
