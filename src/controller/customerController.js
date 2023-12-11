const e = require('express');
const knex = require('../../config/connection');

const customerRegistrarion = async (req, res) => {
  try {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
      req.body;

    const existingUserEmail = await knex('clientes').where('email', email);

    if (existingUserEmail.length > 0) {
      return res.status(400).json({
        mensagem: 'Já existe um cliente cadastrado com o e-mail informado.',
      });
    }

    const existingUserCpf = await knex('clientes').where('cpf', cpf);

    if (existingUserCpf.length > 0) {
      return res.status(400).json({
        mensagem: 'Já existe um cliente cadastrado com o cpf informado.',
      });
    }

    const response = await knex('clientes')
      .insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
      .returning(['id', 'nome', 'email', 'cpf']);

    return res.status(201).json({
      id: response[0].id,
      nome: response[0].nome,
      email: response[0].email,
      cpf: response[0].cpf,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: error.message });
  }
};

const editCustomer = async (req, res) => {
  try {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
      req.body;
    const { id } = req.params;

    const existingUser = await knex('clientes').where('id', id);

    if (existingUser.length < 1) {
      return res.status(400).json({
        mensagem: `cliente de id ${id} não existe`,
      });
    }

    const existingUserEmail = await knex('clientes').where('email', email);

    if (existingUserEmail.length > 0) {
      return res.status(400).json({
        mensagem: 'Já existe um cliente cadastrado com o e-mail informado.',
      });
    }

    const existingUserCpf = await knex('clientes').where('cpf', cpf);

    if (existingUserCpf.length > 0) {
      return res.status(400).json({
        mensagem: 'Já existe um cliente cadastrado com o cpf informado.',
      });
    }

    const response = await knex('clientes')
      .update({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      })
      .where('id', id)
      .returning('*');

    return res.status(201).json({ usuarioAtualizado: response[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: error.message });
  }
};

const listCustomers = async (req, res) => {
  try {
    const customers = await knex('clientes');

    return res.status(200).json(customers);
  } catch (error) {
    console.log(error.message);
  }
};

const detailCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await knex('clientes').where({ id });

    if (customer.length < 1) {
      return res.status(400).json({ mensagem: 'Cliente não encontrado.' });
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  customerRegistrarion,
  editCustomer,
  detailCustomer,
  listCustomers,
};
