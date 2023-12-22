const userController = require("../app/controllers/userController");

let request;
let response;
let send; // <-- mock para response.status.send: Ver líneas 15-16.
let status; // <-- mock para response.status: Este es por si usamos el formato res.sendStatus(400).
let dao;

beforeEach(() => {
  send = jest.fn((message) => {});
  status = jest.fn((statusCode) => {
    return { send: send };
  });

  // Para que funcione el formato "res.status(400).send("LoQueSea")", hay que hacer esto:
  response = { status: status };
});


test("Crear usuario sin email, nombre ni password, devuelve 400", () => {
  request = { body: { email: "", name: "", password: "" } };

  userController.addUser(request, response);

  // Comprueba que la función mock se ha llamado 1 vez (sendStatus(400)):
  expect(status.mock.calls).toHaveLength(1);
  // Comprueba que la llamada a la función mock tiene como primer argumento el valor 400:
  expect(status.mock.calls[0][0]).toBe(400);

  expect(send.mock.calls).toHaveLength(1); // <-- Lo mismo pero en versión "response.status.send" (línea 5)
  expect(send.mock.calls[0][0]).toBe("Error en el body"); // <-- Lo mismo pero en versión "response.status.send" (línea 5)
});

test("Crear usuario con email pero sin nombre ni password, devuelve 400", () => {
  request = { body: { email: "augusto@mail.com", name: "", password: "" } };

  userController.addUser(request, response);

  // Comprueba que la función mock se ha llamado 1 vez (el beforeEach es para que el array siempre esté vacío al comenzar cada test):
  expect(status.mock.calls).toHaveLength(1);
  // Comprueba que la llamada a la función mock tiene como primer argumento el valor 400:
  expect(status.mock.calls[0][0]).toBe(400);

  expect(send.mock.calls).toHaveLength(1); // <-- Lo mismo pero en versión "response.status.send" (línea 5)
  expect(send.mock.calls[0][0]).toBe("Error en el body"); // <-- Lo mismo pero en versión "response.status.send" (línea 5)
});

test("Crear usuario con email y password pero sin nombre, devuelve 400", () => {
  request = { body: { email: "augusto@mail.com", name: "", password: "1234" } };

  userController.addUser(request, response);

  // Comprueba que la función mock se ha llamado 1 vez (el beforeEach es para que el array siempre esté vacío al comenzar cada test):
  expect(status.mock.calls).toHaveLength(1);
  // Comprueba que la llamada a la función mock tiene como primer argumento el valor 400:
  expect(status.mock.calls[0][0]).toBe(400);

  expect(send.mock.calls).toHaveLength(1); // <-- Lo mismo pero en versión "response.status.send" (línea 5)
  expect(send.mock.calls[0][0]).toBe("Error en el body"); // <-- Lo mismo pero en versión "response.status.send" (línea 5)
});

test("Crear usuario cuyo email ya está en base de datos, debe devolver 409", async () => {
  const email = "mortizzz@gmail.com";
  const name = "manolo";
  const password = "1234";

  request = { body: { email: email, name: name, password: password } };

  userController.dao = {
    getUserByEmail: jest.fn(async (email) => {
      if (email === "mortizzz@gmail.com") {
        return [{ email: email, name: name, password: password }];
      } else {
        return false;
      }
    })};

  await userController.addUser(request, response);

  // Comprueba que la función mock se ha llamado 1 vez (el beforeEach es para que el array siempre esté vacío al comenzar cada test):
  expect(userController.dao.getUserByEmail.mock.calls).toHaveLength(1);
  // Comprueba que la llamada a la función mock tiene como primer argumento el valor del campo email: // NotaAgu: este expect me lo he inventado yo.
  expect(userController.dao.getUserByEmail.mock.calls[0][0]).toBe("mortizzz@gmail.com");

  // Comprueba que la función mock se ha llamado 1 vez (el beforeEach es para que el array siempre esté vacío al comenzar cada test):
  expect(status.mock.calls).toHaveLength(1);
  // Comprueba que la llamada a la función mock tiene como primer argumento el valor 409:
  expect(status.mock.calls[0][0]).toBe(409);

  expect(send.mock.calls).toHaveLength(1); // <-- Lo mismo pero en versión "response.status.send" (línea 5)
  expect(send.mock.calls[0][0]).toBe("Usuario ya registrado"); // <-- Lo mismo pero en versión "response.status.send" (línea 5)
});
