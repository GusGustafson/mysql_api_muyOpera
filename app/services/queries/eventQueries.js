const utils = require("../../utils/utils");
const db = require("../mysql");

const eventQueries = {};

// Buscar todos los eventos
eventQueries.getAllEvents = async () => {
  // Conectamos con la base de datos y buscamos los eventos:
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM events", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

// Buscar un evento por su id
eventQueries.getEventById = async (id) => {
  // Conectamos con la base de datos y buscamos si existe el evento por el id:
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM events WHERE id = ?",
      id,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

// Buscar todos los eventos con condiciones
eventQueries.getEventsWithConditions = async (
  idTheatre,
  theatreName,
  idOpera,
  operaName,
  idSinger1,
  singer1Fullname,
  idSinger2,
  singer2Fullname,
  singerAnyFullname
) => {
  // Conectamos con la base de datos y buscamos si existen los eventos con esas condiciones:
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM events WHERE idTheatre = ? OR theatreName = ? OR idOpera = ? OR operaName = ? OR idSinger1 = ? OR singer1Fullname = ? OR idSinger2 = ? OR singer2Fullname = ? OR singer1Fullname = ? OR singer2Fullname = ?",
      [
        idTheatre,
        theatreName,
        idOpera,
        operaName,
        idSinger1,
        singer1Fullname,
        idSinger2,
        singer2Fullname,
        singerAnyFullname,
        singerAnyFullname,
      ],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = eventQueries;
