const joi = require('joi');

const productSchema = joi.object({
  descricao: joi.string().messages({
    'string.empty': 'o campo descricao é obrigatório.',
    'string.base': 'nome inválido.',
  }),
  quantidade_estoque: joi.number().required().positive().messages({
    'any.required': 'O campo quantidade_estoque é obrigatório.',
    'number.base': 'O campo quantidade_estoque precisa ser um número.',
    'number.positive': 'O campo quantidade_estoque precisa ser maior que 0'
  }),
  valor: joi.number().required().positive().messages({
    'any.required': 'O campo valor é obrigatório.',
    'number.base': 'O campo valor precisa ser um número.',
    'number.positive': 'O valor precisa ser positivo'
  }),
  categoria_id: joi.number().required().positive().messages({
    'number.positive': 'não existe categoria 0 ou abaixo',
    'any.required': 'O é obrigatório informar a categoria na qual o produto pertence',
    'number.base': 'O é obrigatório informar a categoria na qual o produto pertence'
  }),
});

module.exports = productSchema;
