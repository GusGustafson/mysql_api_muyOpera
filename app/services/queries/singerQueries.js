const utils = require("../../utils/utils");
const db = require("../mysql");

const singerQueries = {};

// Buscar todos los cantantes
singerQueries.getAllSingers = async () => {
    // Conectamos con la base de datos y buscamos los cantantes:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM singers", [], "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}

// Buscar un cantante por su id
singerQueries.getSingerById = async (id) => {
    // Conectamos con la base de datos y buscamos si existe el cantante por el id:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM singers WHERE id = ?", id, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}


module.exports = singerQueries;
