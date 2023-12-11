
const knex = require('../../config/connection');

const listCategories = async (req, res) => {
  try {
    const response = await knex('categorias');

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(error.message)
    }
  }
};



module.exports = { listCategories };
