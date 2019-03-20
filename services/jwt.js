'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');

exports.createToken= function(user){
	var payload = {
		sub: user._id,
		name: user.name,
		nit: user.nit,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(), //tiempo actual formato timestamp
		exp: moment().add(30, 'minutes').unix  //expira cada 30 minutos
	};

/*	bcrypt.hash(config.secret,null, null, (err,hash) =>{
		config.secret = hash;
	});*/

	return jwt.encode(payload, config.secret);
};