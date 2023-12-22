const dao = require("../services/dao"); // <-- dao es la capa intermedia que nos facilita el acceso desde el controlador hasta la query a la BD.
const path = require("path"); // <-- Este módulo de node nos permite trabajar con rutas de archivos y directorios.
const mime = require("mime"); // <-- Librería que nos permite ver el tipo del contenido del archivo.
const fs = require("fs");

const productController = {};

// Controlador para subir una o varias imágenes a nuestro servidor y base de datos
productController.uploadImage = async (req, res) => {
  console.log(req.files); // <-- console.log para ver los archivos que nos llegan por el objeto files.
  console.log(path.join(__dirname)); // <-- console.log para ver la ruta de nuestro proyecto.

  try {
    // Controlamos cuando el objeto files sea null (si el objeto viene vacío, no seguirá adelante con el código, lo que mostraría un error)
    if (req.files === null) return;
    // Controlamos si nos viene algún tipo de archivo en el objeto files
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No se ha cargado ningún archivo");
    }
    // si es 1 archivo, llega 1 objeto y lo metemos en un array: [{}]; si son >1, entonces sería: [[{},{},{},...]]
    // Puedes ver el resultado en consola gracias al console.log de la línea 10.
    // Obtenemos un array de objetos con todas las imágenes
    const images = !req.files.imagen.length
      ? [req.files.imagen]
      : req.files.imagen;
    // Recorremos el array para procesar cada imagen (recuerda: puede contener 1 o varias imágenes)
    for (const image of images) {
      // Ya podemos acceder a las propiedades del objeto image.
      // Obtenemos la ruta de la imagen.
      let uploadPath = path.join(__dirname, "../public/product/" + image.name);
      // La línea de arriba hace que la ruta de subida sea igual a: ruta de nuestro proyecto (__dirname) + carpeta que indiquemos + nombre del archivo.
      // Usamos el método mv() para ubicar el archivo en nuestro servidor
      image.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
      });
      const img = await dao.addImage({ name: image.name, path: uploadPath });
    }
    return res.send("¡Imagen subida!");
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

// Controlador para obtener una imagen por su id
productController.getImage = async (req, res) => {

  try {
    // Buscamos si el id de la imagen existe en la base de datos
    let image = await dao.getImageById(req.params.id);
    // Aquí arriba debe ser "let" en vez de "const" para que no casque la desestructuración de la línea 55 ("[image] = image").

    // Si la imagen (id) no existe, devolvemos un 404 (not found)
    if (image.length === 0) return res.status(404).send("La imagen no existe");
    [image] = image;
    // Si todo es correcto, devolvemos el id y la ruta donde se encuentra la imagen
    return res.send(
      `Tu imagen tiene el siguiente id: ${image.id} y la siguiente ruta: ${image.path}`
    );
  } catch (e) {
    console.log(e.message);
    //Si la imagen no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

// Controlador para obtener una imagen por su id (VERSIÓN ALTERNATIVA A LA DE JUSTO ENCIMA. Así puedes ver la foto directamente en Thunder.)
productController.getFile = async (req, res) => {

  try {
    // Buscamos si el id de la imagen existe en la base de datos
    const image = await dao.getImageById(req.params.id);
    // Si la imagen (id) no existe, devolvemos un 404 (not found)
    if (image.length === 0) return res.status(404).send("La imagen no existe");
    console.log(image[0].path);
    const ruta = image[0].path;

    // Obtiene el tipo del contenido del archivo
    const tipo = mime.getType(ruta);
    // Lee el archivo desde el directorio local
    fs.readFile(ruta, function (err, data) {
      if (err) {
        // Maneja el error si ocurre
        console.log(err);
        res.status(500).send("Error al leer el archivo");
      } else {
        // Establece el tipo de contenido según el archivo
        res.setHeader("Content-Type", tipo);
        // Envía el contenido del archivo al cliente
        res.send(data);
      }
    })
  } catch (e) {
    console.log(e.message);
    //Si la imagen no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

// Controlador para añadir un producto
productController.addProduct = async (req, res) => {
  // Todo este endpoint lo dividimos en 2 PARTES:

  // PARTE 1: Insertamos el producto en la tabla products y obtenemos el id del producto creado
  const { name, reference } = req.body;
  // Si no hay alguno de estos campos recibidos por el body, devolvemos un 400 (bad request)
  if (!name || !reference) { return res.status(400).send("Error al recibir el body")};
  // Buscamos el producto (por su referencia) en la base de datos

  try {
    const product = await dao.getProductByReference(reference);
    // Si existe el producto, respondemos con un 409 (conflict)
    if (product.length > 0) return res.status(409).send("Producto ya registrado");
    // Si no existe, lo registramos
    const addProduct = await dao.addProduct(req.body);
    console.log(addProduct);

    // PARTE 2: Insertamos las imágenes del producto en la tabla images y, en el objeto
    // que le pasamos, además de name y path, le pasamos el id del producto (ver línea 140)
    if (addProduct) {
      // Controlamos si nos viene algún tipo de archivo en el objeto files
      if (!req.files || req.files === null || Object.keys(req.files).length === 0) {
        return res.status(200).send("Producto añadido sin imagen")
      }
    // Igual que antes: si 1 archivo: [{}]; si >1 archivo: [{},{},{}...]
    console.log("Imágenes que subimos", req.files.imagen);
    // Obtenemos un array de objetos con todas las imágenes
    const images = !req.files.imagen.length ? [req.files.imagen] : req.files.imagen;
    console.log("images", images);
    // Recorremos el array para procesar cada imagen
    for (const image of images) {
      // Ya podemos acceder a las propiedades del objeto image.
      // Obtenemos la ruta de la imagen.
      const uploadPath = path.join(__dirname, "../public/product" + image.name);
      console.log("path", uploadPath);
      // Usamos el método mv() para ubicar el archivo en nuestro servidor
      image.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err)
      });
      await dao.addImage({ name: image.name, path: uploadPath, productId: addProduct});
    }
    return res.send("Producto creado")
    } else {
      return res.status(500).send("Error al insertar el producto")
    }
    } catch (e) {
    console.log(e.message);
    return res.status(500).send(e.message);
  }
};

// Controlador para obtener un producto por su referencia // Este no tiene mucho sentido porque ya le pasamos la ref directamente en req.params
productController.getProductByReference = async (req, res) => {
  const { reference } = req.params;
  if (!reference) return res.status(400).send("Error al recibir la referencia");

  try {
    // Buscamos si la referencia del producto existe en la base de datos
    const product = await dao.getProductByReference(reference);

    // Si el producto (reference) no existe, devolvemos un 404 (not found)
    if (!product) return res.status(404).send("El producto no existe");

    // Si todo es correcto, devolvemos la referencia del producto
    return res.send(
      `Tu producto tiene la siguiente referencia: ${reference}`
    );
  } catch (e) {
    console.log(e.message);
    //Si el producto no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

// Controlador para obtener un producto por su id y la ruta de la tabla images y lo unificamos en un mismo objeto
productController.getProductByIdJoinPath = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Error al recibir el id");

  try {
    // Buscamos si el id del producto existe en la base de datos
    const product = await dao.getProductByIdJoinPath(id);
    // Si el producto (id) no existe, devolvemos un 404 (not found)
    if (!product) return res.status(404).send("El producto no existe");

    // Si todo es correcto, devolvemos el id y la ruta donde se encuentra la imagen
    return res.status(200).send(product);

  } catch (e) {
    console.log(e.message);
    //Si el producto no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};


module.exports = productController;
