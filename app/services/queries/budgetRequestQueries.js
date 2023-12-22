const utils = require("../../utils/utils");
const db = require("../mysql");
const moment = require("moment");

const budgetRequestQueries = {};

// Buscar todos los presupuestos
budgetRequestQueries.getAllBudgetRequests = async () => {
    // Conectamos con la base de datos y buscamos los presupuestos:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM budgetrequests", [], "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}

// Buscar un presupuesto por su id
budgetRequestQueries.getBudgetRequestById = async (id) => {
    // Conectamos con la base de datos y buscamos si existe el presupuesto por el id:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM budgetrequests WHERE id = ?", id, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
}

// Añadir un presupuesto
budgetRequestQueries.addBudgetRequest = async (budgetRequestData) => {
    // Conectamos con la base de datos y añadimos el presupuesto:
    let conn = null;
    try {
        conn = await db.createConnection();
        // Creamos un objeto con los datos del presupuesto que se guardará en la base de datos:
        // Nota: Usamos la librería moment.js para registrar la fecha actual.
        let budgetRequestObj = {
            idUser: budgetRequestData.idUser,
            dateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            idEvent: budgetRequestData.idEvent,
            tickets: budgetRequestData.tickets,
            theatreZone: budgetRequestData.theatreZone,
            travel: budgetRequestData.travel,
            travelLevel: budgetRequestData.travelLevel,
            hotel: budgetRequestData.hotel,
            hotelStars: budgetRequestData.hotelStars,
            hotelNights: budgetRequestData.hotelNights,
            notes: budgetRequestData.notes,
        }
        return await db.query("INSERT INTO budgetrequests SET ?", budgetRequestObj, "insert", conn)
    } catch (e) {
        throw new Error(e)
    } finally {
        conn && await conn.end();
    }
}


module.exports = budgetRequestQueries;
