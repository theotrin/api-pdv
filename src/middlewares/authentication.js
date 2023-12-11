const knex = require('../../config/connection');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_PASSWORD;

const validateAuthentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(400)
      .json({ mensagem: 'Missing token in request header' });
  }

  try {
    const token = authorization.replace('Bearer ', '').trim();

    const { id } = jwt.verify(token, jwtSecret);

    const existingUser = await knex('usuarios').where({ id }).first();

    if (!existingUser) {
      return res.status(404).json('User not found');
    }

    const { senha, ...user } = existingUser;

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = { validateAuthentication };
