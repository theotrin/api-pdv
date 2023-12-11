const s3 = require('../../config/backblaze');
const knex = require('../../config/connection');

const registerProduct = async (req, res) => {
  try {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { file } = req;

    let image = {
      Location: null,
    };

    if (file) {
      image = await s3
        .upload({
          Bucket: process.env.BACKBLAZE_BUCKET,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();
    }

    const newProduct = await knex('produtos')
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: image.Location,
      })
      .returning('*');

    return res.status(201).json(newProduct[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: 'erro interno do servidor' });
  }
};

const editProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const editableProduct = await knex('produtos').where({ id });

    if (editableProduct.length < 1) {
      return res.status(404).json({ mensagem: 'produto não encontrado' });
    }

    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    const nullCategory = await knex('categorias')
      .select('*')
      .where({ id: categoria_id });

    if (nullCategory.length < 1) {
      return res
        .status(404)
        .json({ mensagem: 'A categoria informada não existe' });
    }

    const { file } = req;

    let image = {
      Location: null,
    };

    if (file) {

      const product = await knex('produtos').where({ id });

      if(product[0].produto_imagem != null){
        const parsedUrl = new URL(product[0].produto_imagem);

        const path = parsedUrl.pathname;

        const endURL = path.split('/').pop();
        
        await s3.deleteObject({
          Bucket: process.env.BACKBLAZE_BUCKET,
          Key: endURL
        }).promise()
      }

      image = await s3
        .upload({
          Bucket: process.env.BACKBLAZE_BUCKET,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();
    }

    const updatedProduct = await knex('produtos')
      .where({ id })
      .update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: image.Location,
      })
      .returning('*');

    return res.status(200).json(updatedProduct[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: 'erro interno do servidor' });
  }
};

const listProduct = async (req, res) => {
  const { categoria_id } = req.query;
  try {
    const response = await knex('produtos');

    if (response.length < 1) {
      return res.status(400).json({ mensagem: 'Produtos não encontrados.' });
    }

    if (categoria_id) {
      const response = await knex
        .select('p.*')
        .from('produtos as p')
        .innerJoin('categorias as c', 'p.categoria_id', 'c.id')
        .where('p.categoria_id', categoria_id);

      if (response.length < 1) {
        return res.status(400).json({ mensagem: 'Produtos não encontrados' });
      } else {
        return res.status(200).json(response);
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ mensagem: 'erro interno do servidor' });
  }
};

const detailProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await knex('produtos').where({ id }).first();

    if (response === undefined) {
      return res.status(400).json({ mensagem: 'Produto não encontrado.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ mensagem: 'erro interno do servidor' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const productInfoByID = await knex('pedido_produtos')
      .join('produtos', 'pedido_produtos.produto_id', '=', 'produtos.id')
      .select('*')
      .where('produtos.id', '=', id);

    if (productInfoByID.length > 0) {
      return res.status(400).json({
        mensagem:
          'Este produto não pode ser excluído porque pertence a algum pedido',
      });
    }

    const product = await knex('produtos').where({ id });

    if (product < 1) {
      return res.status(400).json({ mensagem: 'Produto não encontrado.' });
    }

    if(product[0].produto_imagem === null){
      await knex('produtos').where({ id }).del();
      return res.status(204).send();
    }
    
    const parsedUrl = new URL(product[0].produto_imagem);

    const path = parsedUrl.pathname;

    const endURL = path.split('/').pop();
    
    await knex('produtos').where({ id }).del();
    
    await s3.deleteObject({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Key: endURL
    }).promise()
    
    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: 'erro interno do servidor' });
  }
};

module.exports = {
  registerProduct,
  editProduct,
  listProduct,
  detailProduct,
  deleteProduct,
};
