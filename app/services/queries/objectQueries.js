const db = require("../mysql");

const objectQueries = {};

// Buscar objetos por palabra
objectQueries.getObjectsByWord = async (queryWord) => {
  // Conectamos con la base de datos y buscamos si existen objetos por esa palabra:
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      `SELECT * FROM theatres t
      WHERE t.name LIKE '%${queryWord}%' OR t.city LIKE '%${queryWord}%' OR t.address LIKE '%${queryWord}%' OR t.website LIKE '%${queryWord}%'
      union
      SELECT * FROM operas o
      WHERE o.name LIKE '%${queryWord}%' OR o.composer LIKE '%${queryWord}%' OR o.duration LIKE '%${queryWord}%' OR o.website LIKE '%${queryWord}%'
      union
      SELECT * FROM singers s
      WHERE s.name LIKE '%${queryWord}%' OR s.surname LIKE '%${queryWord}%' OR s.voice LIKE '%${queryWord}%' OR s.website LIKE '%${queryWord}%'`,
      queryWord,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};


module.exports = objectQueries;
