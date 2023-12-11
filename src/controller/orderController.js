require("dotenv").config();
const knex = require('../../config/connection');
const  transport = require('../../config/transport');
const path = require('path');
const htmlCompiler = require("../utils/htmlCompiler");

const orderRegistrarion = async ( req, res) =>{
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {
        // Validar campos obrigatórios
        if (!cliente_id || !pedido_produtos || pedido_produtos.length === 0) {
          return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
        }
  
        // Validar se cliente existe
        const customer = await knex('clientes').where('id', cliente_id).first();
        if (!customer) {
          return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
  
        // Validar produto / puxar informações
  
        let valorTotal = 0;
  
        for (const item of pedido_produtos) {
  
            let produto = await knex('produtos')
            .where('id',item.produto_id)
            .first();
  
            if (!produto) {
                return res.status(400).json({ error: `Produto ${item.produto_id} não encontrado.` });
              }
  
              if (produto.quantidade_estoque < item.quantidade_produto) {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${item.produto_id}.` });
              }
  
  
            valorTotal += produto.valor * item.quantidade_produto;
            item.valor_produto = produto.valor;
            item.quantidade_estoque = produto.quantidade_estoque;
  
        }
  
        // inserir no banco de dados tabela pedido
  
        const pedido = await knex('pedidos')
        .insert({
          cliente_id: cliente_id,
          observacao: observacao,
          valor_total: valorTotal
        })
        .returning('*');
  
        // inserir banco de dados Tabela pedido_produtos
  
      for (const item of pedido_produtos) {
        await knex('pedido_produtos')
          .insert({
            pedido_id: pedido[0].id,
            produto_id: item.produto_id,
            quantidade_produto: item.quantidade_produto,
            valor_produto: item.valor_produto
          });
  
        let quantidadeReduzida = item.quantidade_estoque - item.quantidade_produto;
  
        await knex('produtos')
          .where('id', '=', item.produto_id)
          .update({
            quantidade_estoque: quantidadeReduzida
          });
      }
  
  
        const htmlPath = path.join(__dirname, '../template/email.html');
        const html = await htmlCompiler(htmlPath, {
            nome: customer.nome
        });
  
        // Enviar e-mail para o cliente
        await transport.sendMail({
          from: `${process.env.MAIL_NAME} <${process.env.MAIL_FROM}>`,
          to: `${customer.nome} <${customer.email}>`,
          subject: 'Cofirmação de conclusão de pedido',
          html,
        });
  
        return res.status(201).json({ message: 'Pedido cadastrado com sucesso.' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }
    };
    const orderList = async (req,res) =>{
      const { cliente_id } = req.query;

      try {
        let query = knex('pedidos').select('*');
    
        if (cliente_id) {
          query.where('cliente_id', cliente_id);
        }
    
        const pedidos = await query;
    
        if (!pedidos || pedidos.length === 0) {
          return res.status(404).json({ mensagem: 'Pedidos não encontrados.' });
        }
    
        const result = [];
    
        for (const pedido of pedidos) {
          const pedidoProdutos = await knex('pedido_produtos')
            .select('*')
            .where('pedido_id', pedido.id);
    
          const formattedPedido = {
            pedido: {
              id: pedido.id,
              valor_total: pedido.valor_total,
              observacao: pedido.observacao,
              cliente_id: pedido.cliente_id,
            },
            pedido_produtos: pedidoProdutos.map((produto) => ({
              id: produto.id,
              quantidade_produto: produto.quantidade_produto,
              valor_produto: produto.valor_produto,
              pedido_id: produto.pedido_id,
              produto_id: produto.produto_id,
            })),
          };
    
          result.push(formattedPedido);
        }
    
        return res.status(200).json(result);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
      }
    }


module.exports = {orderRegistrarion, orderList}

