const userQueries = require("./queries/userQueries");
const theatreQueries = require("./queries/theatreQueries");
const operaQueries = require("./queries/operaQueries");
const singerQueries = require("./queries/singerQueries");
const eventQueries = require("./queries/eventQueries");
const budgetRequestQueries = require("./queries/budgetRequestQueries");
const objectQueries = require("./queries/objectQueries");

const dao = {};

// SECCIÓN DE DAO PARA "USUARIOS"
// Buscar un usuario por el email
dao.getUserByEmail = async (email) => await userQueries.getUserByEmail(email);
// Buscar un usuario por el id
dao.getUserById = async (id) => await userQueries.getUserById(id);
// Añadir un nuevo usuario
dao.addUser = async (userData) => await userQueries.addUser(userData);
// Eliminar un usuario por su id
dao.deleteUser = async (id) => await userQueries.deleteUser(id);
// Modificar un usuario por su id
dao.updateUser = async (id, userData) => await userQueries.updateUser(id, userData);

// SECCIÓN DE DAO PARA "IMÁGENES Y PRODUCTOS"
// Añadir datos de la imagen subida al servidor
dao.addImage = async (imageData) => await productQueries.addImage(imageData);
// Obtener una imagen por su id
dao.getImageById = async (id) => await productQueries.getImageById(id);
// Buscar un producto por su id
// dao.getProductById = async (id) => await productQueries.getProductById(id);
// Buscar un producto por su id y unirlo a sus imágenes
dao.getProductByIdJoinPath = async (id) => await productQueries.getProductByIdJoinPath(id);
// Buscar un producto por su referencia
dao.getProductByReference = async (reference) => await productQueries.getProductByReference(reference);
// Añadir un nuevo producto
dao.addProduct = async (productData) => await productQueries.addProduct(productData);

// SECCIÓN DE DAO PARA "PEDIDOS"
// Añadir un nuevo pedido
dao.addOrder = async (orderData) => await orderQueries.addOrder(orderData);
// Añadir relación entre producto  y pedido
dao.addRProductOrder = async (rProductOrderData) => await orderQueries.addRProductOrder(rProductOrderData);
// Obtener los pedidos de un usuario
dao.getUserOrders = async (idClient) => await orderQueries.getUserOrders(idClient);

// SECCIÓN DE DAO PARA "TEATROS"
// Buscar todos los teatros
dao.getAllTheatres = async () => await theatreQueries.getAllTheatres();
// Buscar un teatro por el id
dao.getTheatreById = async (id) => await theatreQueries.getTheatreById(id);

// SECCIÓN DE DAO PARA "ÓPERAS"
// Buscar todas las óperas
dao.getAllOperas = async () => await operaQueries.getAllOperas();
// Buscar una ópera por el id
dao.getOperaById = async (id) => await operaQueries.getOperaById(id);

// SECCIÓN DE DAO PARA "CANTANTES"
// Buscar todos los cantantes
dao.getAllSingers = async () => await singerQueries.getAllSingers();
// Buscar un cantante por el id
dao.getSingerById = async (id) => await singerQueries.getSingerById(id);

// SECCIÓN DE DAO PARA "EVENTOS"
// Buscar todos los eventos
dao.getAllEvents = async () => await eventQueries.getAllEvents();
// Buscar un evento por el id
dao.getEventById = async (id) => await eventQueries.getEventById(id);
// Buscar todos los eventos con condiciones
dao.getEventsWithConditions = async (idTheatre, theatreName, idOpera, operaName, idSinger1, singer1Fullname, idSinger2, singer2Fullname, singerAnyFullname) => await eventQueries.getEventsWithConditions(idTheatre, theatreName, idOpera, operaName, idSinger1, singer1Fullname, idSinger2, singer2Fullname, singerAnyFullname);

// SECCIÓN DE DAO PARA "PRESUPUESTOS"
// Buscar todos los presupuestos
dao.getAllBudgetRequests = async () => await budgetRequestQueries.getAllBudgetRequests();
// Buscar un presupuesto por el id
dao.getBudgetRequestById = async (id) => await budgetRequestQueries.getBudgetRequestById(id);
// Añadir un nuevo presupuesto
dao.addBudgetRequest = async (budgetRequestData) => await budgetRequestQueries.addBudgetRequest(budgetRequestData);

// SECCIÓN DE DAO PARA "OBJETOS"
// Buscar objetos por palabra
dao.getObjectsByWord = async (queryWord) => await objectQueries.getObjectsByWord(queryWord);

module.exports = dao;
