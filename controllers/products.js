'use strict'

let path = require('path');
let fs = require('fs');
let mongoosePaginate = require('mongoose-pagination');

let Sublevel = require('../models/sublevels');
let Product = require('../models/products');

function getProduct(req, res){
	let productId = req.params.id;
	Product.findById(productId).populate({path:'sublevel_id'}).exec((err,product)=>{
		if (err) {
			return res.status(500).send({message:'Error en la petición'});
		}
		if (!product) {
			return res.status(404).send({message:'there are not products'});
		}
		return res.status(200).send({product});
	});
}

function getProducts(req,res){
	let sublevelId = req.params.sublevel;
	let find;
	if (!sublevelId) {
		find = Product.find({}).sort('name');
	}
	else {
		find = Product.find({sublevel_id:sublevelId}).sort('name')
	}
	find.populate({
		path: 'sublevel_id', 
		populate:{
			path:'sublevels',
			model:'sublevels'
		}
	}).exec((err, products) => {
		if (err) {
			console.log(err);
			return res.status(500).send({message:'Error en la petición'});	
		}
		if (!products) {
			return res.status(404).send({message:'there are not products'});
		}
		return res.status(200).send({products});
	})
}

function saveProduct(req,res){
	let product = new Product();

	let params = req.body;
	product.quantity = params.quantity;
	product.price = params.price;
	product.available = params.available;
	product.sublevel_id = params.sublevel_id;
	product.name = params.name;

	product.save((err,productStored) => {
		if (err) {
			console.log(err);
			return res.status(500).send({message:'Error en el servidor'});
		}
		if (!productStored) {
			return res.status(404).send({message:'the product has not been saved'});
		}
		return res.status(200).send({products: productStored});
	});


}

function updateProduct(req, res){
	let productId = req.params.id;
	let update = req.body;
	console.log(productId);
	Product.findOneAndUpdate({_id:productId}, update,{new: true} ,(err, productUpdated) =>{
		if (err) {
			return res.status(500).send({message:'Error updating product'});
		}
		if(!productUpdated){
			return res.status(404).send({message: 'product could not be updated'});
		}
		console.log(productUpdated);
		res.status(200).send({products: productUpdated});
	});	

}



module.exports = {
	getProduct,
	getProducts,
	saveProduct,
	updateProduct
};