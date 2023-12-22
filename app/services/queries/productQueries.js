const { removeUndefinedKeys } = require("../../utils/utils");
const db = require("../mysql");
const moment = require("moment");

const productQueries = {};

// Añadir una imagen a la base de datos
productQueries.addImage = async (imageData) => {
    // Conectamos con la base de datos y añadimos los datos de la imagen.
    let conn = null;
    try {
        conn = await db.createConnection();
        // Creamos un objeto con los datos de la imagen a guardar en la base de datos.
        // Usamos la librería moment.js para registrar la fecha actual.
        let imageObj = {
            name: imageData.name,
            path: imageData.path,
            productId: imageData.productId,
            registerDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        return await db.query("INSERT INTO images SET ?", imageObj, "insert", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
};

// Buscar una imagen por su id
productQueries.getImageById = async (id) => {
    // Conectamos con la base de datos y buscamos si existe la imagen por el id:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM images WHERE id = ?", id, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
};

// Buscar un producto por su referencia
productQueries.getProductByReference = async (reference) => {
    // Conectamos con la base de datos y buscamos si existe el producto por la referencia:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query("SELECT * FROM products WHERE reference = ?", reference, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
};

// Buscar un producto por su id
// productQueries.getProductById = async (id) => {
//     // Conectamos con la base de datos y buscamos si existe el producto por el id:
//     let conn = null;
//     try {
//         conn = await db.createConnection();
//         return await db.query("SELECT * FROM products WHERE id = ?", id, "select", conn);
//     } catch (e) {
//         throw new Error(e);
//     } finally {
//         conn && await conn.end();
//     }
// };

// Buscar un producto por su id y mostrar también la ruta de sus imágenes
productQueries.getProductByIdJoinPath = async (id) => {
    // Conectamos con la base de datos y buscamos si existe el producto por el id:
    let conn = null;
    try {
        conn = await db.createConnection();
        return await db.query(
            // La siguiente query de MySQL te da los resultados divididos por objetos (1 objeto por cada match). La otra query te lo da todo en un solo objeto.
            // "select p.*, i.path, i.name as image_name from products as p join images as i on p.id = i.productId where p.id = ?",
            "select p.*, group_concat (i.`path` separator ',') as images from products as p join images as i on p.id = i.productId where p.id = ? group by i.productId",
            id, "select", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
};

// Añadir un producto a la base de datos
productQueries.addProduct = async (productData) => {
    // Conectamos con la base de datos y añadimos los datos de la imagen.
    let conn = null;
    try {
        conn = await db.createConnection();
        // Creamos un objeto con los datos de la imagen a guardar en la base de datos.
        // Usamos la librería moment.js para registrar la fecha actual.
        let productObj = {
            name: productData.name,
            description: productData.description,
            stock: productData.stock,
            price: productData.price,
            reference: productData.reference,
            registerDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        productObj = await removeUndefinedKeys(productObj);
        return await db.query("INSERT INTO products SET ?", productObj, "insert", conn);
    } catch (e) {
        throw new Error(e);
    } finally {
        conn && await conn.end();
    }
};


module.exports = productQueries;
