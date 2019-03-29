'use strict'

var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path')


function testUser(req, res){
	res.status(200).send({
		message: 'testing this users controller'
	});
}

function saveUser(req, res){
	var user = new User();
	var params = req.body;
	user.name = params.name;
	user.nit = params.nit;
	user.email= params.email.toLowerCase();
	user.password= params.password;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if (!params.password) {
		res.status(200).send({message:'Introduce la contraseña'});
		return res
	}
	// Encriptar contraseña y guardar datos
	bcrypt.hash(params.password, null, null, (err, hash) =>{
		user.password = hash ;
	if (user.name == null || user.nit == null || user.email == null) {
		res.status(200).send({message:'Ingresa todos los campos'});

		return res

	}
	user.save((err,userStored) =>{
		if (err) {
			return res.status(500).send({message: 'Error al guardar el usuario'});
		}
		if(!userStored){
			return res.status(404).send({message: 'No se ha registrado el usuario'});
		}
		res.status(200).send({user:userStored});
		});
	});
		
}

function updateUser(req,res){
	var userId = req.params.id;
	var update = req.body;

	if (userId != req.user.sub) {
		return res.status(500).send({message:'No tienes permiso para actualizar el usuario'});
	}
	//verifico si tiene img, si es asi la eliminaria.
	if (update.image!=null) {
		var imgFile = update.image;
		var path_file = "./uploads/users/"+imgFile;
		fs.unlink(path_file,(err)=>{
			if (err) throw err;
			console.log(imgFile+' fue eliminado');
		});
	}
	User.findOneAndUpdate({_id:userId}, update, {new: true},(err, userUpdated) =>{
		if (err) {
			return res.status(500).send({message:'Error al actualizar el usuario'});
		}
		if(!userUpdated){
			return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
		}
		res.status(200).send({user: userUpdated});
	});
}


function loginUser(req, res){
	let params = req.body;
	let email = params.email.toLowerCase();
	let password = params.password;

	User.findOne({email: email},(err, user) =>{
		if (err) {
			return res.status(500).send({message:'Error en la petición'});
		}
		if (!user) {
			return res.status(404).send({message:'El usuario no existe'});
		}
		bcrypt.compare(password, user.password, (err, check) =>{
			if (!check) {
				return res.status(404).send({message: 'El usuario no ha podido loguearse'});
			}
			// devolver los datos del usuario logueado
			if (!params.gethash) {
				return res.status(200).send({user});
			}
			res.status(200).send({token:jwt.createToken(user)}); 
			// devolver un token de jwt
		});
	});
}

function uploadImage(req, res){
	let userId = req.params.id;
	let file_name = 'no subido ...';

	if (!req.files) {
		return res.status(200).send({message:'No has subido ninguna imagen'});
	}
	let file_path = req.files.image.path;
	let file_ext = path.extname(file_path)
	file_name  = path.basename(file_path,file_ext);
	if (file_ext == '.png' || file_ext == '.jpg' || file_ext == '.gif' ) {
		file_name = file_name+file_ext;
		User.findOneAndUpdate({_id:userId},{image:file_name},(err,userUpdated)=>{
			if(!userUpdated){
				return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}
			return res.status(200).send({image: file_name, user: userUpdated});		
		});
	}
	else{
		return res.status(200).send({message:'Extensión del archivo no valida'})

	}



}

function getImageFile(req, res){

	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+ imageFile;

	fs.exists(path_file,(exists)=>{
		if(!exists){
			return res.status(200).send({message:'No existe la imagen ...'});
		}
		res.sendFile(path.resolve(path_file));
	});
}

module.exports = {
	testUser,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};