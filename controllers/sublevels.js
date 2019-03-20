'use strict'

let path = require('path');
let fs = require('fs');
let mongoosePaginate = require('mongoose-pagination');

let Sublevel = require('../models/sublevels');


function getSublevels(req, res) {
	let sublevelId = req.params.id
	let qs;
	if (!sublevelId) {
		 qs = Sublevel.find({}); //Todos los subniveles
	}else {
		console.log(sublevelId);
		 qs = Sublevel.find({_id:sublevelId}); //Los subniveles de un subnivel en concreto
	}
	qs.populate({path:'sublevels'}).exec((err,sublevels) => {
		if (err) {
			return res.status(500).send({message:'Error en la petición'});
		}
		if (!sublevels) {
			return res.status(404).send({message:'there are not sublevels'});
		}
		res.status(200).send({sublevels});
	});

	
}

function saveSublevel(req, res){
	let sublevel = new Sublevel();
	let params = req.body;
	sublevel.name = params.name;
	sublevel.sublevels = params.sublevels;
	sublevel.save((err,sublevelStored)=>{
		if (err) {
			console.log(err);
			return res.status(500).send({message:'Error en el servidor'});
		}
		if (!sublevelStored) {
			return res.status(404).send({message:'the sublevel has not been saved'});
		}
		return res.status(200).send({sublevels: sublevelStored});
	});

}

function updateSublevel(req, res){
	let sublevelId = req.params.id;
	let update = req.body;

	//Category.findByIdAndUpdate(categoryId,update)findOneAndUpdate
	Sublevel.findOneAndUpdate({_id:sublevelId}, update,{new: true}, (err, sublevelUpdated) =>{
		if (err) {
			return res.status(500).send({message:'Error updating sub-level'});
		}
		if(!sublevelUpdated){
			return res.status(404).send({message: 'sub-level could not be updated'});
		}
		res.status(200).send({sublevels: sublevelUpdated});
	});

}

function addSublevel(req, res){
	let sublevelId = req.params.id;
	let update = req.body;

	Sublevel.findOneAndUpdate({_id:sublevelId}, {$push:{sublevels:update.sublevels}},{new: true},(err, sublevelUpdated) =>{
		if (err) {
			return res.status(500).send({message:'Error updating category'});
		}
		if(!sublevelUpdated){
			return res.status(404).send({message: 'Category could not be updated'});
		}
		res.status(200).send({sublevels: sublevelUpdated});
	});

}

module.exports = {
	getSublevels,
	saveSublevel,
	updateSublevel,
	addSublevel
};
