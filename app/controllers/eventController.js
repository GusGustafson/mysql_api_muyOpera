const dao = require("../services/dao"); // <-- dao es la capa intermedia que nos facilita el acceso desde el controlador hasta la query a la BD.
const utils = require("../utils/utils");

// Esta variable que sigue es para que funcione el test (entonces hay que anularla en la línea 9):
// CUIDADO: si no se pone, la API casca.
let eventController = {
  dao: dao,
};
// const eventController = {}; // <-- Aquí hemos comentado la variable para que funcione el test.

/**
 * Controlador para buscar todos los eventos
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos de los eventos extraídos de la BD
 */
// Controlador para buscar todos los eventos
eventController.getAllEvents = async (req, res) => {
  try {
    let events = await dao.getAllEvents();
    // Si los eventos no existen, devolvemos un 404
    if (!events || events.length === 0)
      return res.status(404).send("Eventos no encontrados");
    // Si todo es correcto, devolvemos los datos de los eventos
    return res.send(events);
  } catch (e) {
    console.log(e.message);
    //Si hay algún error del servidor, enviamos un 500
    return res.status(500).send("Error interno del servidor");
  }
};

/**
 * Controlador para buscar un evento por su id
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos del evento extraídos de la BD
 */
// Controlador para buscar un evento por su id
eventController.getEventById = async (req, res) => {
  // Obtenemos el id del body
  const { id } = req.params;
  // Si no existe este campo recibido por el body, devolvemos un 400 (bad request)
  if (!id) return res.status(400).send("Error al recibir el body");

  try {
    let event = await dao.getEventById(id);
    // Como la consulta a la base de datos nos devuelve un array con el objeto del evento,
    // desestructuramos ese objeto "event" para quedarnos solo con la propiedad que nos interesa.
    [event] = event;
    // Si el evento (id) no existe, devolvemos un 404
    if (!event) return res.status(404).send("Evento no encontrado");
    // Si todo es correcto, devolvemos los datos del evento
    return res.send({
      id: event.id,
      idTheatre: event.idTheatre,
      theatreName: event.theatreName,
      idOpera: event.idOpera,
      operaName: event.operaName,
      idSinger1: event.idSinger1,
      singer1Fullname: event.singer1Fullname,
      idSinger2: event.idSinger2,
      singer2Fullname: event.singer2Fullname,
      dateTime: event.dateTime,
    });
  } catch (e) {
    console.log(e.message);
    //Si el evento no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

/**
 * Controlador para buscar los eventos que cumplan condiciones
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos de los eventos extraídos de la BD
 */
// Controlador para buscar los eventos que cumplan condiciones
eventController.getEventsWithConditions = async (req, res) => {
  // Obtenemos los datos del formulario del body
  let { idTheatre, theatreName, idOpera, operaName, idSinger1, singer1Fullname, idSinger2, singer2Fullname, singerAnyFullname } = req.body;
  // Si no existe ninguno de estos campos recibidos por el body, devolvemos un 400 (bad request)
  if (!idTheatre && !theatreName && !idOpera && !operaName && !idSinger1 && !singer1Fullname && !idSinger2 && !singer2Fullname && !singerAnyFullname)
    return res.status(400).send("Error al recibir el body");

  try {
    let foundEvents = await dao.getEventsWithConditions(
      idTheatre,
      theatreName,
      idOpera,
      operaName,
      idSinger1,
      singer1Fullname,
      idSinger2,
      singer2Fullname,
      singerAnyFullname,
    );
    // Como la consulta a la base de datos nos devuelve un array con el objeto del evento,
    // desestructuramos ese objeto "event" para quedarnos solo con las propiedades que nos interesan.
    // [id, idTheatre, idOpera, idSinger1, idSinger2, dateTime] = event;
    // Si el evento no existe, devolvemos un 404
    if (!foundEvents || foundEvents.length === 0) return res.status(404).send("Evento no encontrado");
    // Si todo es correcto, devolvemos los datos del evento
    return res.send(
      // {id: event.id, theatre: event.idTheatre, opera: event.idOpera, singer1: event.singer1, singer2: event.singer2, dateTime: event.dateTime}
      foundEvents
    );
  } catch (e) {
    console.log(e.message);
    //Si el evento no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

module.exports = eventController;
