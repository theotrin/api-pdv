const joi = require('joi');

const customerSchema = joi.object({
  nome: joi.string().required().messages({
    'any.required': 'O campo nome é obrigatório.',
    'string.empty': 'O campo nome é obrigatório.',
    'string.base': 'Nome inválido.'
  }),
  email: joi.string().email().required().messages({
    'any.required': 'O campo email é obrigatório.',
    'string.empty': 'O campo email é obrigatório.',
    'string.email': 'Email inválido.'
  }),
  cpf: joi.number().required().messages({
    'any.required': 'O campo cpf é obrigatório.',
    'number.base': 'O campo cpf precisa ser um número.'
  }),
  cep: joi.number().messages({
    'number.base': 'O campo cep precisa ser um número.'
  }),
  rua: joi.string().messages({
    'string.base': 'O campo rua precisa ser um texto'
  }),
  numero: joi.number().messages({
    'number.base': 'O campo numero precisa ser um numero'
  }),
  bairro: joi.string().messages({
    'string.base': 'O campo bairro precisa ser um texto'
  }
  ),
  cidade: joi.string().messages({
    'string.base': 'O campo cidade precisa ser um texto'
  }),
  estado: joi.string().messages({
    'string.base': 'O campo cidade precisa ser um texto'
  })
});

module.exports = customerSchema;