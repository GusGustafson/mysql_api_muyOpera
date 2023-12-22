const db = require("../mysql");
const moment = require ("moment");

const orderQueries = {};

// Las siguientes 5 líneas hacen que se muestre este texto al poner el ratón sobre "addOrder" en el archivo dao.js.
/**
 * Query para añadir un pedido
 * @param {Obj} orderData 
 * @returns id del pedido
 */
orderQueries.addOrder = async (orderData) => {
    let conn = null;
    try {
        conn = await db.createConnection()
        // Creamos un objeto con los datos del pedido que se guardarán en la base de datos
        let orderObj = {
            product: orderData.product,
            quantity: orderData.quantity,
            idClient: orderData.idClient,
            orderDate: moment().format("YYYY-MM-DD HH:mm:ss")
        }
        return await db.query("INSERT INTO orders SET ?", orderObj, "insert", conn);

    } catch (e) {
        throw new Error(e)
    } finally {
        conn && await conn.end()
    };
}

// Las siguientes 5 líneas hacen que se muestre este texto al poner el ratón sobre "addRProductOrder" en el archivo dao.js.
/**
 * Query para añadir una relación entre producto y pedido
 * @param {Obj} rProductOrderData 
 * @returns id de la relación producto-pedido
 */
orderQueries.addRProductOrder = async (rProductOrderData) => {
    let conn = null;
    try {
        conn = await db.createConnection()
        // Creamos un objeto con los datos del producto-pedido que se guardarán en la base de datos
        let rProductOrderObj = {
            idProduct: rProductOrderData.idProduct,
            idOrder: rProductOrderData.idOrder
        }
        return await db.query("INSERT INTO r_products_orders SET ?", rProductOrderObj, "insert", conn);

    } catch (e) {
        throw new Error(e)
    } finally {
        conn && await conn.end()
    };
}

orderQueries.getUserOrders = async (idClient) => {
    let conn = null;
    try {
        conn = await db.createConnection();
        const result = await db.query(
            "SELECT * FROM orders WHERE idClient=?", idClient, "select", conn);
            console.log(result);
        return result;

    } catch (e) {
        throw new Error(e)
    } finally {
        conn && await conn.end()
    };
}


module.exports = orderQueries;
