const dao = require("../services/dao"); // <-- dao es la capa intermedia que nos facilita el acceso desde el controlador hasta la query a la BD.
const utils = require("../utils/utils");

// Esta variable que sigue es para que funcione el test (entonces hay que anularla en la línea 9):
// CUIDADO: si no se pone, la API casca.
let singerController = {
  dao: dao,
};
// const singerController = {}; // <-- Aquí hemos comentado la variable para que funcione el test.

/**
 * Controlador para buscar todos los cantantes
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos de los cantantes extraídos de la BD
 */
// Controlador para buscar todos los cantantes
singerController.getAllSingers = async (req, res) => {
  try {
    let singers = await dao.getAllSingers();
    // Si los cantantes no existen, devolvemos un 404
    if (!singers || singers.length === 0)
      return res.status(404).send("Cantantes no encontrados");
    // Si todo es correcto, devolvemos los datos de los cantantes
    return res.send(singers);
  } catch (e) {
    console.log(e.message);
    //Si hay algún error del servidor, enviamos un 500
    return res.status(500).send("Error interno del servidor");
  }
};

/**
 * Controlador para buscar un cantante por su id
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos del cantante extraídos de la BD
 */
// Controlador para buscar un cantante por su id
singerController.getSingerById = async (req, res) => {
  // Obtenemos el id del body
  const { id } = req.params;
  // Si no existe este campo recibido por el body, devolvemos un 400 (bad request)
  if (!id) return res.status(400).send("Error al recibir el body");

  try {
    let singer = await dao.getSingerById(id);
    // Como la consulta a la base de datos nos devuelve un array con el objeto del cantante,
    // desestructuramos ese objeto "singer" para quedarnos solo con la propiedad que nos interesa.
    [singer] = singer;
    // Si el cantante (id) no existe, devolvemos un 404
    if (!singer) return res.status(404).send("Cantante no encontrado");
    // Si todo es correcto, devolvemos los datos del cantante
    return res.send({
      id: singer.id,
      name: singer.name,
      surname: singer.surname,
      voice: singer.voice,
      birthYear: singer.birthYear,
      nationality: singer.nationality,
      website: singer.website,
      image: singer.image,
      image2: singer.image2,
      image3: singer.image3,
    });
  } catch (e) {
    console.log(e.message);
    //Si el cantante no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

module.exports = singerController;
