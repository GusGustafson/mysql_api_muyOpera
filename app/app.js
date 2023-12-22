// Importamos el módulo express:
const express = require("express");
// Importamos la librería dotenv:
const dotenv = require("dotenv");
// Importamos la librería Morgan (para ver en la consola el método, la ruta, el estado, el tiempo en ms y los bytes):
const logger = require("morgan");
// Importamos el módulo cookie-parser para poder leer las cookies:
const cookieParser = require("cookie-parser");
// Importamos la librería express-fileupload (para subir archivos a una BD):
const fileUpload = require("express-fileupload");
// Importamos la librería cors para permitir todas las conexiones (CUIDADO - PELIGRO - RIESGO DE SEGURIDAD):
const cors = require("cors");

const userRouter = require("./routes/userRouter"); // <-- Este router es el que llamamos abajo en "api middlewares"
const theatreRouter = require("./routes/theatreRouter"); // <-- Este router es el que llamamos abajo en "api middlewares"
const operaRouter = require("./routes/operaRouter"); // <-- Este router es el que llamamos abajo en "api middlewares"
const singerRouter = require("./routes/singerRouter"); // <-- Este router es el que llamamos abajo en "api middlewares"
const eventRouter = require("./routes/eventRouter"); // <-- Este router es el que llamamos abajo en "api middlewares"
const budgetRequestRouter = require("./routes/budgetRequestRouter"); // <-- Este router es el que llamamos abajo en "api middlewares"
const objectRouter = require("./routes/objectRouter"); // <-- Este router es el que llamamos abajo en "api middlewares"

// Añadimos el método config de dotenv para utilizar las variables de entorno
dotenv.config();

// Instanciamos express
const app = express();

// --- middlewares de express ---
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
    fileUpload({
        createParentPath: true, // Crea la carpeta donde almacenamos los archivos si no ha sido creada.
        limits: { fileSize: 20 * 1024 * 1024 }, // Limitamos el tamaño del archivo a 20mb. Por defecto son 50mb.
        abortOnLimit: true, // Interrumpe la carga del archivo si supera el límite especificado.
        responseOnLimit: "Archivo demasiado grande", // Enviamos un mensaje de respuesta cuando se interrumpe la carga.
        uploadTimeout: 0, // Indicamos el tiempo de respuesta si se interrumpe la carga del archivo. De este modo, ya no se ejecutaría el método post del router.
    })
);
app.use(cors());
// =======================================================================================================================
// ATENCIÓN: Estos middlewares de arriba SIEMPRE VAN ANTES que los middlewares de abajo que importamos de nuestros router.
// =======================================================================================================================
// --- api middlewares ---
app.use("/user", userRouter);
app.use("/theatre", theatreRouter);
app.use("/opera", operaRouter);
app.use("/singer", singerRouter);
app.use("/event", eventRouter);
app.use("/budgetRequest", budgetRequestRouter);
app.use("/object", objectRouter);


module.exports = app;
