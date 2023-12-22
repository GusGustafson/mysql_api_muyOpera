const utils = require("../../utils/utils");
const db = require("../mysql");

const theatreQueries = {};

// Buscar todos los teatros
theatreQueries.getAllTheatres = async () => {
    // Conectamos con la base de datos y buscamos los teatros:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM theatres", [], "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}

// Buscar un teatro por su id
theatreQueries.getTheatreById = async (id) => {
    // Conectamos con la base de datos y buscamos si existe el teatro por el id:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM theatres WHERE id = ?", id, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}


module.exports = theatreQueries;
