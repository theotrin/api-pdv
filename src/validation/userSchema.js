const joi = require('joi');

const userSchema = joi.object({
  nome: joi.string().required().messages({
    'any.required': 'O campo nome é obrigatório.',
    'string.empty': 'o campo nome é obrigatório.',
    'string.base': 'nome inválido.',
  }),
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

module.exports = userSchema;
