'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SublevelsSchema = Schema ({
		name: String,
		sublevels: [{type: Schema.ObjectId, ref:'sublevels'}]
});

module.exports = mongoose.model('sublevels', SublevelsSchema);