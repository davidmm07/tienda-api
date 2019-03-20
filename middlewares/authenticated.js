'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');

exports.ensureAuth = function(req, res, next){

	if (!req.headers.authorization) {
		return res.status(403).send({message: 'la petición no tiene la cabecera de autenticación'})
	}
	var token = req.headers.authorization.replace(/['"]+/g,'');


	try{
		let payload = jwt.decode(token, config.secret);
		if (payload.exp <= moment().unix()) {
			return res.status(403).send({message: 'el token ha expirado'});
		}
		req.user = payload;

	}catch(ex){
		return res.status(403).send({message: 'el token no es válido'});
	}


	next();  // para salir del middleware

};