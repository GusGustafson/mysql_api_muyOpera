const dao = require("../services/dao"); // <-- dao es la capa intermedia que nos facilita el acceso desde el controlador hasta la query a la BD.
const utils = require("../utils/utils");

// Esta variable que sigue es para que funcione el test (entonces hay que anularla en la línea 9):
// CUIDADO: si no se pone, la API casca.
let budgetRequestController = {
  dao: dao,
};
// const budgetRequestController = {}; // <-- Aquí hemos comentado la variable para que funcione el test.

/**
 * Controlador para buscar todos los presupuestos
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos de los presupuestos extraídos de la BD
 */
// Controlador para buscar todos los presupuestos
budgetRequestController.getAllBudgetRequests = async (req, res) => {
  try {
    let budgetRequests = await dao.getAllBudgetRequests();
    // Si los presupestos no existen, devolvemos un 404
    if (!budgetRequests || budgetRequests.length === 0)
      return res.status(404).send("Presupuestos no encontrados");
    // Si todo es correcto, devolvemos los datos de los presupuestos
    return res.send(budgetRequests);
  } catch (e) {
    console.log(e.message);
    //Si hay algún error del servidor, enviamos un 500
    return res.status(500).send("Error interno del servidor");
  }
};

/**
 * Controlador para añadir (registrar) un nuevo presupuesto
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns la confirmación de adición del presupuesto (con su id)
*/
// Controlador para el registro de un presupuesto
budgetRequestController.addBudgetRequest = async (req, res) => {
    // const { idUser, idEvent, tickets, theatreZone, travel, travelLevel, hotel, hotelStars, hotelNights, notes } = req.body;
    const { idUser, idEvent, tickets, travel, hotel } = req.body;
    // Si no hay alguno de estos campos recibidos por el body, devolvemos un 400 (bad request)
    // if (!idUser || !idEvent || !tickets || !theatreZone || !travel || !travelLevel || !hotel || !hotelStars || !hotelNights || !notes) return res.status(400).send("Error en el body");
    if (!idUser || !idEvent || !tickets || !travel || !hotel ) return res.status(400).send("Error en el body");

    // Buscamos el presupuesto en la base de datos
    try {
        // const budgetRequest = await budgetRequestController.dao.getBudgetRequestById(id); // <-- Hemos añadido "budgetRequestController" para que funcione el test.
        // console.log("buscamos el presupuesto", budgetRequest); // <-- console.log para ver que realiza la búsqueda del presupuesto.
        // Si existe el presupuesto, respondemos con un 409 (conflict)
        // if (budgetRequest.length > 0) return res.status(409).send("Presupuesto ya registrado");
        // Si no existe, lo registramos
        const addBudgetRequest = await budgetRequestController.dao.addBudgetRequest(req.body); // <-- Hemos añadido "budgetRequestController" para que funcione el test.
        console.log("Añadimos el presupuesto y devuelve el id: ", addBudgetRequest); // <-- console.log para ver que añade el usuario y se crea el id.
        if (addBudgetRequest) {
            return res.send(`Presupuesto con id: ${addBudgetRequest} registrado`);
        } else {
            return res.sendStatus(500); // <-- Incluimos este "else" por si se produce algún error al añadir el presupuesto.
        }
    } catch (e) {
        console.log(e.message);
        throw new Error(e);
    }
}


module.exports = budgetRequestController;
