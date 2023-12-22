const utils = require("../../utils/utils");
const db = require("../mysql");

const operaQueries = {};

// Buscar todas las óperas
operaQueries.getAllOperas = async () => {
    // Conectamos con la base de datos y buscamos las óperas:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM operas", [], "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}

// Buscar una ópera por su id
operaQueries.getOperaById = async (id) => {
    // Conectamos con la base de datos y buscamos si existe la ópera por el id:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM operas WHERE id = ?", id, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}


module.exports = operaQueries;
