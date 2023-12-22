const dao = require("../services/dao"); // <-- dao es la capa intermedia que nos facilita el acceso desde el controlador hasta la query a la BD.
const utils = require("../utils/utils");

// Esta variable que sigue es para que funcione el test (entonces hay que anularla en la línea 9):
// CUIDADO: si no se pone, la API casca.
let objectController = {
  dao: dao,
};
// const objectController = {}; // <-- Aquí hemos comentado la variable para que funcione el test.

/**
 * Controlador para buscar objetos por palabra
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos de los objetos extraídos de la BD
 */
// Controlador para buscar objetos por palabra
objectController.getObjectsByWord = async (req, res) => {
  // Obtenemos la palabra del body
  const { queryWord } = req.params;
  // Si no existe este campo recibido por el body, devolvemos un 400 (bad request)
  if (!queryWord) return res.status(400).send("Error al recibir el body");

  try {
    let objects = await dao.getObjectsByWord(queryWord);
    // Como la consulta a la base de datos nos devuelve un array con el objeto del evento,
    // desestructuramos ese objeto "objects" para quedarnos solo con la propiedad que nos interesa.
    // [objects] = objects;
    // Si el evento (queryWord) no existe, devolvemos un 404
    if (!objects || objects.length === 0) return res.status(404).send("Objeto no encontrado");
    // Si todo es correcto, devolvemos los datos de los objetos
    return res.send(objects);
  } catch (e) {
    console.log(e.message);
    //Si el evento no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};


module.exports = objectController;
