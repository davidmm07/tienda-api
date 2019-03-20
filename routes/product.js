'use strict'

let express = require('express');
let ProductsController = require('../controllers/products');
let api = express.Router();
let md_auth = require('../middlewares/authenticated');
let multipart = require('connect-multiparty');

let md_upload = multipart({ uploadDir: './uploads/products'});


api.get('/product/:id', md_auth.ensureAuth, ProductsController.getProduct);
api.get('/products/:sublevel?', md_auth.ensureAuth, ProductsController.getProducts);
api.post('/product', md_auth.ensureAuth, ProductsController.saveProduct);
api.put('/product/:id', md_auth.ensureAuth, ProductsController.updateProduct);


module.exports = api;