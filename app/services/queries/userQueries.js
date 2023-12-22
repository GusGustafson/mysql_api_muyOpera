const utils = require("../../utils/utils");
const db = require("../mysql");
const moment = require("moment");
const md5 = require("md5");

const userQueries = {};

// Buscar un usuario por su email
userQueries.getUserByEmail = async (email) => {
    // Conectamos con la base de datos y buscamos si existe el usuario por el email:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM users WHERE email = ?", email, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}
// Todo esto de arriba (lín 9-20) es la QUERY TÍPICA, es la que usaremos siempre cambiando solo alguna cosilla.

// Buscar un usuario por su id
userQueries.getUserById = async (id) => {
    // Conectamos con la base de datos y buscamos si existe el usuario por el id:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM users WHERE id = ?", id, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}

// Añadir un usuario
userQueries.addUser = async (userData) => {
    // Conectamos con la base de datos y añadimos el usuario:
    let conn = null;
    try {
        conn = await db.createConnection();
        // Creamos un objeto con los datos del usuario que se guardará en la base de datos:
        // Nota: Encriptamos la password con md5 y usamos la librería moment.js para registrar la fecha actual.
        let userObj = {
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            password: md5(userData.password),
            registerDate: moment().format("YYYY-MM-DD HH:mm:ss")
        }
        return await db.query("INSERT INTO users SET ?", userObj, "insert", conn)
    } catch (e) {
        throw new Error(e)
    } finally {
        conn && await conn.end();
    }
}

// Borrar un usuario por su id
userQueries.deleteUser = async (id) => {
    // Conectamos con la base de datos y eliminamos el usuario por su id:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("DELETE FROM users WHERE id = ?", id, "delete", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}

// Modificar un usuario por su id
userQueries.updateUser = async (id, userData) => {
    // Conectamos con la base de datos y actualizamos el usuario por su id:
    let conn = null;
    try {
        conn = await db.createConnection();
        // Creamos un objeto con los datos que nos pueden llegar del usuario a modificar en la base de datos.
        // Encriptamos la password con md5 si nos llega por el body; si no, la declaramos como undefined
        // y usamos la librería moment.js para actualizar la fecha.
        let userObj = {
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            password: userData.password ? md5(userData.password) : undefined,
            updateDate: moment().format("YYYY-MM-DD HH:mm:ss")
        }
        // Eliminamos los campos que no se van a modificar (no llegan por el body) usando la función "utils/utils.js":
        userObj = await utils.removeUndefinedKeys(userObj);
        return await db.query("UPDATE users SET ? WHERE id = ?", [userObj, id], "update", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}


module.exports = userQueries;
