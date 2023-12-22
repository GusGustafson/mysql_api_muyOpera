const express = require("express");
const productController = require("../controllers/productController");
const productRouter = express.Router();

// Subir una o varias imágenes al servidor y base de datos
productRouter.post("/upload", productController.uploadImage);
// Obtener una imagen por su id
productRouter.get("/image/:id", productController.getImage);
// Devolver una imagen leyendo el archivo (VERSIÓN ALTERNATIVA A LA DE JUSTO ENCIMA)
productRouter.get("/file/:id", productController.getFile);
// Añadir un producto
productRouter.post("/add", productController.addProduct);
// Buscar un producto por su id y unirlo a sus imágenes
productRouter.get("/:id", productController.getProductByIdJoinPath);
// Buscar un producto por su referencia
productRouter.get("/productRef/:reference", productController.getProductByReference);


module.exports = productRouter;
