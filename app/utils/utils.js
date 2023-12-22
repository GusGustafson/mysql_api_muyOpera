const utils = {};

utils.removeUndefinedKeys = async (obj) => {
  try {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "-1" || obj[key] === -1) {
        obj[key] = null;
      } else if (obj[key] === undefined || obj[key] === "") {
        delete obj[key];
      }
    });

    return obj;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = utils;

// NotaAgu: Esta función sirve para eliminar aquellos campos que no nos lleguen por el body (por ejemplo,
// al actualizar algún dato del usuario, lo normal es que solo nos pasen por el body ese campo concreto,
// sin especificar los demás campos). Esta función elimina esos campos vacíos para que no nos lleguen como "undefined".
