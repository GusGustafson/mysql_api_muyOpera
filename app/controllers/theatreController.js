const dao = require("../services/dao"); // <-- dao es la capa intermedia que nos facilita el acceso desde el controlador hasta la query a la BD.
const utils = require("../utils/utils");

// Esta variable que sigue es para que funcione el test (entonces hay que anularla en la línea 9):
// CUIDADO: si no se pone, la API casca.
let theatreController = {
  dao: dao,
};
// const theatreController = {}; // <-- Aquí hemos comentado la variable para que funcione el test.

/**
 * Controlador para buscar todos los teatros
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos de los teatros extraídos de la BD
 */
// Controlador para buscar todos los teatros
theatreController.getAllTheatres = async (req, res) => {
  try {
    let theatres = await dao.getAllTheatres();
    // Si los teatros no existen, devolvemos un 404
    if (!theatres || theatres.length === 0)
      return res.status(404).send("Teatros no encontrados");
    // Si todo es correcto, devolvemos los datos de los teatros
    return res.send(theatres);
  } catch (e) {
    console.log(e.message);
    //Si hay algún error del servidor, enviamos un 500
    return res.status(500).send("Error interno del servidor");
  }
};

/**
 * Controlador para buscar un teatro por su id
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos del teatro extraídos de la BD
 */
// Controlador para buscar un teatro por su id
theatreController.getTheatreById = async (req, res) => {
  // Obtenemos el id del body
  const { id } = req.params;
  // Si no existe este campo recibido por el body, devolvemos un 400 (bad request)
  if (!id) return res.status(400).send("Error al recibir el body");

  try {
    let theatre = await dao.getTheatreById(id);
    // Como la consulta a la base de datos nos devuelve un array con el objeto del teatro,
    // desestructuramos ese objeto "theatre" para quedarnos solo con la propiedad que nos interesa.
    [theatre] = theatre;
    // Si el teatro (id) no existe, devolvemos un 404
    if (!theatre) return res.status(404).send("Teatro no encontrado");
    // Si todo es correcto, devolvemos los datos del teatro
    return res.send({
      id: theatre.id,
      name: theatre.name,
      city: theatre.city,
      address: theatre.address,
      aphoras: theatre.aphoras,
      telephone: theatre.telephone,
      website: theatre.website,
      image: theatre.image,
      image2: theatre.image2,
      image3: theatre.image3,
    });
  } catch (e) {
    console.log(e.message);
    //Si el teatro no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

module.exports = theatreController;
