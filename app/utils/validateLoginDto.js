// importamos Type de la libreria "@sinclair/typebox
const { Type } = require('@sinclair/typebox')
// importamos la librería ajv
const Ajv = require('ajv')
// importamos los paquetes que extienden la funcionalidad de ajv
const addFormats = require('ajv-formats')
const addErrors = require('ajv-errors')

// Componemos el esquema usando la librería con la propiedad Type
const LoginDTOSchema = Type.Object({
  email: Type.String({
    format: 'email',
    errorMessage: {
      type: 'El tipo de email deber ser un string',
      format: 'Email debe contener un correo electrónico válido'
    }
  }),
  password: Type.String({
    errorMessage: {
      type: 'El tipo de password debe ser un string'
    }
  })
}, {
  additionalProperties: false,
  errorMessage: {
    type: 'Debe ser un objeto',
    additionalProperties: 'El formato del objeto no es válido',
    required: {
      email: 'El email es requerido',
      password: 'La password es requerida'
    }
  }
})

// instanciamos la clase
const ajv = new Ajv({ allErrors: true }) // allErrors:true nos valida los fallos de los dos campos (email y password)
// funciones para extender la funcionalidad de Ajv.
// addFormats añade formato de validación (lo aplicamos a email)
addFormats(ajv, ['email'])
// addErrors permite personalizar los errores.
addErrors(ajv, { keepErrors: false })

// Metemos el esquema en el ajv para generar una función de validación
const validate = ajv.compile(LoginDTOSchema)

// Función para validar el dto (email, password)
const validateLoginDto = (req, res, next) => {
  // le pasamos la funciónd e validación
  const isDTOValid = validate(req.body)
  // Si no ha pasado la validación enviamos un 400 y el tipo de error de la validación

  if (!isDTOValid) return res.status(400).send(ajv.errorsText(validate.errors, { separator: '\n' }))

  next()
}

module.exports = validateLoginDto
