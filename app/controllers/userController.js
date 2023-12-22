const dao = require("../services/dao"); // <-- dao es la capa intermedia que nos facilita el acceso desde el controlador hasta la query a la BD.
const utils = require("../utils/utils");
const md5 = require("md5");
// Importamos la clase SignJWT de la librería jose (recuerda: la libreria jose no tiene dependencias):
const { SignJWT, jwtVerify } = require("jose");

// Esta variable que sigue es para que funcione el test (entonces hay que anularla en la línea 12):
// CUIDADO: si no se pone, la API casca.
let userController = {
  dao: dao,
};
// const userController = {}; // <-- Aquí hemos comentado la variable para que funcione el test.

/**
 * Controlador para añadir (registrar) un nuevo usuario
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns la confirmación de adición del usuario (con nombre e id)
 */
// Controlador para el registro de un usuario
userController.addUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Si no hay alguno de estos campos recibidos por el body, devolvemos un 400 (bad request)
  if (!name || !email || !password)
    return res.status(400).send("Error en el body");

  // Buscamos el usuario en la base de datos
  try {
    const user = await userController.dao.getUserByEmail(email); // <-- Hemos añadido "userController" para que funcione el test.
    console.log("buscamos el usuario", user); // <-- console.log para ver que realiza la búsqueda del usuario.
    // Si existe el usuario, respondemos con un 409 (conflict)
    if (user.length > 0) return res.status(409).send("Usuario ya registrado");
    // Si no existe, lo registramos
    const addUser = await userController.dao.addUser(req.body); // <-- Hemos añadido "userController" para que funcione el test.
    console.log("Añadimos el usuario y devuelve el id: ", addUser); // <-- console.log para ver que añade el usuario y se crea el id.
    if (addUser) {
      return res.send(`Usuario ${name} con id: ${addUser} registrado`);
    } else {
      return res.sendStatus(500); // <-- Incluimos este "else" por si se produce algún error al añadir el usuario.
    }
  } catch (e) {
    console.log(e.message);
    throw new Error(e);
  }
};

/**
 * Controlador para loguear un usuario
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns el token del usuario logueado
 */
// Controlador para el login de un usuario
userController.loginUser = async (req, res) => {
  // Obtenemos el email y password del body
  const { email, password } = req.body;
  // Si no hay alguno de estos campos recibidos por el body, devolvemos un 400 (bad request)
  if (!email || !password)
    return res.status(400).send("Error al recibir el body");

  // Buscamos el usuario en la base de datos
  try {
    let user = await dao.getUserByEmail(email);
    // Como la consulta a la base de datos nos devuelve un array con el objeto del usuario,
    // desestructuramos ese objeto "user" para quedarnos solo con la propiedad que nos interesa.
    [user] = user;
    // Si el usuario (email) no existe, devolvemos un 404
    if (!user) return res.status(404).send("Usuario no encontrado");
    // Si existe el usuario, comprobamos que la password es correcta. Si no lo es, devolvemos un 401 (unauthorized).
    console.log(md5(password)); // <-- console.log para ver la contraseña encriptada
    if (md5(password) !== user.password)
      return res.status(401).send("Contraseña no válida");
    // AHORA VIENEN LOS 3 PASOS PARA GENERAR TOKEN Y DEVOLVER TOKEN:
    // Construimos el JWT con el id, nombre, apellido, email y rol del usuario
    const jwtConstructor = new SignJWT({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email,
      userRole: user.userRole,
    });
    // Codificamos la clave secreta definida en la variable de entorno por requisito de la librería jose
    // y poder pasarla en el formato correcto (unit8Array) en el método .sign
    const encoder = new TextEncoder();
    // Generamos el JWT. Lo hacemos asíncrono, ya que nos devuelve una promesa.
    // Le indicamos la cabecera, la fecha de creación, la fecha de expiración y la firma (clave secreta).
    const jwt = await jwtConstructor
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1h") // Nota: la librería jose sí nos permite poner el tiempo de esta forma (en vez de ms).
      .sign(encoder.encode(process.env.JWT_SECRET));
    // Si todo es correcto, enviamos la respuesta 200 (OK)
    return res.send({ jwt });
  } catch (err) {
    //Si el usuario no existe, enviamos un 401 (unauthorized)
    return res.sendStatus(401);
  }
};

/**
 * Controlador para buscar un usuario por su email
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos del usuario logueado extraídos de la BD
 */
// Controlador para buscar un usuario por su email
userController.getUserByEmail = async (req, res) => {
  // Obtenemos el email del body
  const { email } = req.params;
  // Si no existe este campo recibido por el body, devolvemos un 400 (bad request)
  if (!email) return res.status(400).send("Error al recibir el body");

  try {
    let user = await dao.getUserByEmail(email);
    // Como la consulta a la base de datos nos devuelve un array con el objeto del usuario,
    // desestructuramos ese objeto "user" para quedarnos solo con la propiedad que nos interesa.
    [user] = user;
    // Si el usuario (email) no existe, devolvemos un 404
    if (!user) return res.status(404).send("Usuario no encontrado");
    // Si todo es correcto, devolvemos los datos del usuario
    return res.send({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      userRole: user.userRole,
      registerDate: user.registerDate,
      updateDate: user.updateDate,
    });
  } catch (e) {
    console.log(e.message);
    //Si el usuario no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

/**
 * Controlador para buscar un usuario por su id
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns los datos del usuario logueado extraídos de la BD
 */
// Controlador para buscar un usuario por su id
userController.getUserById = async (req, res) => {
  // Obtenemos el id del body
  const { id } = req.params;
  // Si no existe este campo recibido por el body, devolvemos un 400 (bad request)
  if (!id) return res.status(400).send("Error al recibir el body");

  try {
    let user = await dao.getUserById(id);
    // Como la consulta a la base de datos nos devuelve un array con el objeto del usuario,
    // desestructuramos ese objeto "user" para quedarnos solo con la propiedad que nos interesa.
    [user] = user;
    // Si el usuario (id) no existe, devolvemos un 404
    if (!user) return res.status(404).send("Usuario no encontrado");
    // Si todo es correcto, devolvemos los datos del usuario
    return res.send({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      userRole: user.userRole,
      registerDate: user.registerDate,
      updateDate: user.updateDate,
    });
  } catch (e) {
    console.log(e.message);
    //Si el usuario no existe, enviamos un 400
    return res.status(400).send(e.message);
  }
};

/**
 * Controlador para eliminar un usuario por su id
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns la confirmación de eliminación del usuario (id)
 */
// Controlador para eliminar un usuario por su id
userController.deleteUser = async (req, res) => {
  const { id } = req.params;
  // OBTENER CABECERA Y COMPROBAR SU AUTENTICIDAD Y CADUCIDAD
  const { authorization } = req.headers;
  // Si no existe el token, enviamos un 401 (unauthorized)
  if (!authorization) return res.sendStatus(401);
  // Obtenemos el token de la cabecera
  const token = authorization.split(" ")[1];
  let user = await dao.getUserById(id); // <-- Este "user" es un objeto (un array, concretamente).
  [user] = user; // <-- Desestructuramos el array "user" para luego (línea siguiente) poder ver si su propiedad "user" no está vacía.
  if (!user) return res.status(404).send("El usuario no existe");

  try {
    // Codificamos la clave secreta
    const encoder = new TextEncoder();
    // Verificamos el token con la función jwtVerify. Le pasamos el token y la clave secreta codificada.
    const { payload } = await jwtVerify(
      token,
      encoder.encode(process.env.JWT_SECRET)
    );
    // Verificamos que seamos usuario administrador
    if (!payload.userRole)
      return res.status(409).send("No tiene permiso de administrador"); // <-- El administrador tiene rol "1"; los demás, "0".
    // Buscamos si el id del usuario existe en la base de datos
    const user = await dao.getUserById(id);
    // Si no existe, devolvemos un 404 (not found)
    if (user.length === 0) return res.status(404).send("El usuario no existe");
    // Si existe, eliminamos el usuario por el id
    const isDeleted = await dao.deleteUser(id);
    if (!isDeleted) {
      return res.sendStatus(204);
    }
    // Devolvemos la respuesta
    return res.send(`Usuario con id ${id} eliminado`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

/**
 * Controlador para modificar un usuario por su id
 * @param {*} req esta es la petición
 * @param {*} res esta es la respuesta
 * @returns la confirmación de modificación del usuario (id)
 */
// Controlador para modificar un usuario por su id
userController.updateUser = async (req, res) => {
  const { id } = req.params; // <-- Eso es solo para acortar "req.params.id" en las líneas 140, 143 y 144.
  // OBTENER CABECERA Y COMPROBAR SU AUTENTICIDAD Y CADUCIDAD
  const { authorization } = req.headers;
  // Si no existe el token, enviamos un 401 (unauthorized)
  if (!authorization) return res.sendStatus(401);
  // Si no nos llega ningún campo por el body, devolvemos un 400 (bad request)
  if (Object.entries(req.body).length === 0)
    return res.status(400).send("Error al recibir el body");

  // Obtenemos el token de la cabecera
  const token = authorization.split(" ")[1];

  try {
    // Codificamos la clave secreta
    const encoder = new TextEncoder();
    // Verificamos el token con la función jwtVerify. Le pasamos el token y la clave secreta codificada.
    const { payload } = await jwtVerify(
      token,
      encoder.encode(process.env.JWT_SECRET)
    );

    // Verificamos que el id del payload sea el mismo que el id del usuario que queremos modificar
    if (payload.id !== Number(id))
      return res.status(401).send("Usuario no autorizado");

    // Verificamos que no exista ya otro usuario con ese mismo email
    const existingUser = await dao.getUserByEmail(req.body.email);
    // if (existingUser.length > 0 && existingUser.id !== Number(id)) {
    if (existingUser.length > 0 && existingUser[0].id !== payload.id) {
      return res
        .status(400)
        .send("Ese correo electrónico ya lo está usando otro usuario");
    }

    // Actualizamos el usuario
    const updateUser = await dao.updateUser(id, req.body);
    if (updateUser) return res.send(`Usuario con id ${id} modificado`);
  } catch (e) {
    console.log(e.message);
    throw new Error(e.message);
  }
};


module.exports = userController;
