'use strict'

let path = require('path');
let fs = require('fs');
let mongoosePaginate = require('mongoose-pagination');

let Category = require('../models/categories');
let Sublevel = require('../models/sublevels');
let SublevelsController = require('../controllers/sublevels');

function getCategories(req, res) {
	let categoryId = req.params.id;
	var qs;
	if (!categoryId) {
		qs = Category.find({}).sort('name');
	}
	else {
		qs =Category.findById(categoryId);
	}
	qs.populate({path:'sublevels',
		populate:[{path:'sublevels',
		populate:[{path:'sublevels'}]}]
	})
	.exec((err, categories) =>{
		if (err) {
			return res.status(500).send({message:'Error en la petición'})
		}
		if (!categories) {
			return res.status(404).send({message:'the category not exists'});
		}
		return res.status(200).send({categories});
	});
}



function saveCategory(req, res){
	let category = new Category();
	let params = req.body;
	category.name = params.name;
	category.sublevels = params.sublevels;
	category.save((err,categoryStored)=>{
		if (err) {
			console.log(err);
			return res.status(500).send({message:'Error en el servidor'});
		}
		if (!categoryStored) {
			return res.status(404).send({message:'the category has not been saved'});
		}
		return res.status(200).send({category: categoryStored});
	});

}

function updateCategory(req, res){
	let categoryId = req.params.id;
	let update = req.body;

	//Category.findByIdAndUpdate(categoryId,update)findOneAndUpdate
	Category.findOneAndUpdate({_id:categoryId}, update,{new: true}, (err, categoryUpdated) =>{
		if (err) {
			return res.status(500).send({message:'Error updating category'});
		}
		if(!categoryUpdated){
			return res.status(404).send({message: 'Category could not be updated'});
		}
		res.status(200).send({category: categoryUpdated});
	});

}
function addSublevel(req, res){
	let categoryId = req.params.id;
	let update = req.body;
	Category.findOneAndUpdate({_id:categoryId}, {$push:{sublevels:update.sublevels}},{new: true},(err, categoryUpdated) =>{
		if (err) {
			return res.status(500).send({message:'Error updating category'});
		}
		if(!categoryUpdated){
			return res.status(404).send({message: 'Category could not be updated'});
		}
		res.status(200).send({category: categoryUpdated});
	});

}

module.exports = {
	getCategories,
	saveCategory,
	updateCategory,
	addSublevel
};
