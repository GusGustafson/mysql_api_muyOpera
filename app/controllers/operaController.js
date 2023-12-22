const dao = require("../services/dao"); // <-- dao es la capa intermedia que nos facilita el acceso desde el controlador hasta la query a la BD.
const utils = require("../utils/utils");

// Esta variable que sigue es para que funcione el test (entonces hay que anularla en la línea 9):
// CUIDADO: si no se pone, la API casca.
let operaController = {
  dao: dao,
};
// const operaController = {}; // <-- Aquí hemos comentado la variable para que funcione el test.

/**
 * Controlador para buscar todas las óperas
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos de los teatros extraídos de la BD
 */
// Controlador para buscar todas las óperas
operaController.getAllOperas = async (req, res) => {
  try {
    let operas = await dao.getAllOperas();
    // Si las óperas no existen, devolvemos un 404
    if (!operas || operas.length === 0)
      return res.status(404).send("Óperas no encontradas");
    // Si todo es correcto, devolvemos los datos de las óperas
    return res.send(operas);
  } catch (e) {
    console.log(e.message);
    //Si hay algún error del servidor, enviamos un 500
    return res.status(500).send("Error interno del servidor");
  }
};

/**
 * Controlador para buscar una ópera por su id
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos del teatro extraídos de la BD
 */
// Controlador para buscar una ópera por su id
operaController.getOperaById = async (req, res) => {
  // Obtenemos el id del body
  const { id } = req.params;
  // Si no existe este campo recibido por el body, devolvemos un 400 (bad request)
  if (!id) return res.status(400).send("Error al recibir el body");

  try {
    let opera = await dao.getOperaById(id);
    // Como la consulta a la base de datos nos devuelve un array con el objeto de la ópera,
    // desestructuramos ese objeto "opera" para quedarnos solo con la propiedad que nos interesa.
    [opera] = opera;
    // Si la ópera (id) no existe, devolvemos un 404
    if (!opera) return res.status(404).send("Ópera no encontrada");
    // Si todo es correcto, devolvemos los datos de la ópera
    return res.send({
      id: opera.id,
      name: opera.name,
      composer: opera.composer,
      language: opera.language,
      date: opera.date,
      duration: opera.duration,
      website: opera.website,
      image: opera.image,
      image2: opera.image2,
      image3: opera.image3,
    });
  } catch (e) {
    console.log(e.message);
    //Si la ópera no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

module.exports = operaController;
