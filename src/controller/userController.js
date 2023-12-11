const bcrypt = require('bcrypt');
const knex = require('../../config/connection');
const jwt = require('jsonwebtoken');

const userRegistration = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existingUser = await knex('usuarios').where('email', email);

    if (existingUser.length > 0) {
      return res.status(400).json({
        mensagem: 'Já existe um usuário cadastrado com o e-mail informado.',
      });
    }

    const encryptedPassword = await bcrypt.hash(senha, 10);

    const response = await knex('usuarios')
      .insert({ nome, email, senha: encryptedPassword })
      .returning(['id', 'nome', 'email']);

    return res.status(201).json({
      id: response[0].id,
      nome: response[0].nome,
      email: response[0].email,
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(400).json({ mensagem: error.message });
  }
};

const updateUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  const userId = req.user.id;

  try {
    const existingUser = await knex('usuarios').where('email', email);

    if (existingUser.length > 0) {
      return res.status(400).json({
        mensagem: 'Já existe um usuário cadastrado com o e-mail informado.',
      });
    }

    const encryptedPassword = await bcrypt.hash(senha, 10);
    await knex('usuarios')
      .update({ nome, email, senha: encryptedPassword })
      .where('id', '=', userId);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await knex('usuarios').where({ email });

    if (user.length < 1) {
      return res.status(400).json({ mensagem: 'email ou senha incorretos' });
    }

    const correctPassword = await bcrypt.compare(senha, user[0].senha);

    if (correctPassword === false) {
      return res.json({ mensagem: 'email ou senha incorretos' });
    }

    const token = jwt.sign(user[0], process.env.JWT_PASSWORD);

    const finalUser = {
      email,
      senha: user[0].senha,
      token,
    };

    return res.json(finalUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: error.message });
  }
};

const detailUser = (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = { userRegistration, userLogin, detailUser, updateUser };
