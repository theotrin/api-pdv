const joi = require('joi');

const orderSchema = joi.object({
    cliente_id: joi.number().positive().required().messages({
      'any.required': 'O campo cliente_id é obrigatório.',
      'number.base': 'O bampo cliente_id precisa ser um número.',
      'number.positive': 'Não existem clientes de id 0 ou menor.'
    }),
    observacao: joi.string(),
    pedido_produtos: joi.array().required().messages({
      'any.required': 'O campo pedido_produtos é obrigatório'
    })
  });

module.exports = orderSchema