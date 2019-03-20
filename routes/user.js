'use strict'

let express = require('express');
let UserController = require('../controllers/user');
let md_auth = require('../middlewares/authenticated');
let multipart = require('connect-multiparty');

let md_upload = multipart({ uploadDir: './uploads/users'}); //middleware fichero

let api = express.Router(); // permite funciones get, post, put, delete
api.get('/test-user-controller', md_auth.ensureAuth, UserController.testUser);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-img-user/:id', [md_auth.ensureAuth,md_upload], UserController.uploadImage);
api.get('/get-image-file/:imageFile', md_auth.ensureAuth, UserController.getImageFile);

module.exports = api;
