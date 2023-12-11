const joi = require('joi');

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    'any.required': 'O campo email é obrigatório',
    'string.empty': 'o campo email é obrigatório.',
    'string.email': 'Email inválido',
  }),
  senha: joi.string().required().messages({
    'any.required': 'O campo senha é obrigatório',
    'string.empty': 'o campo senha é obrigatório.',
  }),
});

module.exports = loginSchema;
