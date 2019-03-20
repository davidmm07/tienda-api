'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ProductsSchema = Schema ({
		quantity: Number,
		price: String,
		available: Boolean,
		sublevel_id: {type: Schema.ObjectId, ref:'sublevels'},
		name: String,
});

module.exports = mongoose.model('products', ProductsSchema);