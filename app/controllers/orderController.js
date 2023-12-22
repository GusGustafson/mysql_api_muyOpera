const { jwtVerify } = require("jose");
const dao = require("../services/dao");
const productQueries = require("../services/queries/productQueries");

const orderController = {};

// Las siguientes 5 líneas hacen que se muestre este texto al poner el ratón sobre "addOrder" en el archivo orderRouter.js.
/**
 * Añadir un nuevo pedido realizado por un usuario
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 */
orderController.addOrder = async (req, res) => {
    // Obtenemos la cabecera para coger el token
    const { authorization } = req.headers;
    // Si no existe el token, enviamos un 401 (unauthorized)
    if (!authorization) return res.sendStatus(401);
    // Obtenemos el token (eliminamos "bearer")
    const token = authorization.split(" ")[1];
    
    // Si no existe el body, enviamos un 400 (bad request)
    if (Object.entries(req.body).length === 0) return res.sendStatus(400);
    // Extraemos el body de la petición
    const { product, quantity } = req.body;

    try {
        // Codificamos la clave secreta
        const encoder = new TextEncoder();
        // Verificamos el token con la función jwtVerify. Le pasamos el token y la clave secreta codificada.
        const { payload } = await jwtVerify(
            token,
            encoder.encode(process.env.JWT_SECRET)
        );
        const idClient = payload.id; // id del usuario que hace el pedido

        // Obtenemos el id del producto por la referencia (product)
        const getProduct = await dao.getProductByReference(product);

        if (getProduct.length === 0) return res.sendStatus(404);
        const idProduct = getProduct[0].id;

        // Añadimos el pedido
        const idOrder = await dao.addOrder({ product, quantity, idClient });
        if (!idOrder) return res.sendStatus(500);
        // Añadimos la relación entre producto y pedido
        const addRpo = await dao.addRProductOrder({ idProduct, idOrder });
        if (!addRpo) return res.sendStatus(500);

        return res.sendStatus(200);

    } catch (e) {
        console.log(e.message);
        return res.status(500).send(e.message);
    }
}

// Obtener los pedidos de un usuario
orderController.getUserOrders = async (req, res) => {
    // Obtenemos el id del cliente a partir de la petición
    const { idClient } = req.params;
    if (!idClient) { return res.status(400).send("El usuario no existe  ")};

    try {
        // Obtenemos los pedidos del cliente por el idClient
        const clientOrders = await dao.getUserOrders(idClient);
        // Si el cliente no tiene pedidos, devolvemos un 404 (not found)
        if (!clientOrders) return res.status(404).send("El cliente no tiene pedidos");

        let result = [];

        // Creamos el bucle para recorrer todos los pedidos del cliente
        for (const order of clientOrders) {
            let [getProduct] = await dao.getProductByReference(order.product);
            // result.push(getProduct[0].name); <-- ASÍ NO ES. ES COMO ESTÁ ABAJO:
            result.push({ ...order, getProduct });
        }

        // Si todo es correcto, devolvemos los pedidos del cliente
        return res.status(200).send(result);


    } catch (e) {
        console.log(e.message);
        return res.status(500).send(e.messsage);
    }
}


module.exports = orderController;
