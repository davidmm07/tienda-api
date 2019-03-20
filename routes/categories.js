'use strict'

let express = require('express');
let CategoriesController = require('../controllers/categories');
let api = express.Router();
let md_auth = require('../middlewares/authenticated');
let multipart = require('connect-multiparty');

let md_upload = multipart({ uploadDir: './uploads/categories'});


api.get('/categories/:id?', md_auth.ensureAuth, CategoriesController.getCategories);
api.post('/categories', md_auth.ensureAuth, CategoriesController.saveCategory);
api.put('/categories/:id', md_auth.ensureAuth, CategoriesController.updateCategory);
api.put('/add-sublevel/:id', md_auth.ensureAuth, CategoriesController.addSublevel);

module.exports = api;