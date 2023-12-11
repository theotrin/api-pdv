const express = require('express');
const {
  userRegistration,
  userLogin,
  updateUser,
  detailUser,
} = require('./controller/userController');
const {
  listCategories
} = require('./controller/categoriesController');

const validateBody = require('./middlewares/validateBody');
const userSchema = require('./validation/userSchema');
const loginSchema = require('./validation/loginSchema');
const productSchema = require('./validation/productSchema');
const customerSchema = require('./validation/customerSchema');
const { validateAuthentication } = require('./middlewares/authentication');
const {
  customerRegistrarion,
  editCustomer,
  detailCustomer,
  listCustomers,
} = require('./controller/customerController');
const { orderRegistrarion, orderList } = require('./controller/orderController');
const { deleteProduct,
  registerProduct,
  editProduct,
  listProduct,
  detailProduct,
} = require('./controller/productController');
const multer = require('./multer');
const orderSchema = require('./validation/orderSchema');

const router = express.Router();

router.get('/categoria', listCategories);

router.post('/usuario', validateBody(userSchema), userRegistration);

router.post('/login', validateBody(loginSchema), userLogin);

router.use(validateAuthentication);

router.get('/usuario', detailUser);

router.put('/usuario', validateBody(userSchema), updateUser);

router.get('/produto', listProduct);

router.get('/produto/:id', detailProduct);

router.post('/produto', multer.single('produto_imagem'), validateBody(productSchema), registerProduct);

router.put('/produto/:id', multer.single('produto_imagem'), validateBody(productSchema), editProduct);

router.post('/cliente', validateBody(customerSchema), customerRegistrarion);

router.put('/cliente/:id', validateBody(customerSchema), editCustomer);

router.get('/cliente', listCustomers);

router.get('/cliente/:id', detailCustomer);

router.delete('/produto/:id', deleteProduct);

router.post('/pedido', validateBody(orderSchema), orderRegistrarion);

router.get('/pedido', orderList);

module.exports = router;
