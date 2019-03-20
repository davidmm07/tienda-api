'use strict'

let express = require('express');
let SublevelsController = require('../controllers/sublevels');
let api = express.Router();
let md_auth = require('../middlewares/authenticated');
let multipart = require('connect-multiparty');

let md_upload = multipart({ uploadDir: './uploads/sublevels'});


api.get('/sublevels/:id?', md_auth.ensureAuth, SublevelsController.getSublevels);
api.post('/sublevels', md_auth.ensureAuth, SublevelsController.saveSublevel);
api.put('/sublevels/:id', md_auth.ensureAuth, SublevelsController.updateSublevel);
api.put('/add-sub-sublevel/:id', md_auth.ensureAuth, SublevelsController.addSublevel);


module.exports = api;