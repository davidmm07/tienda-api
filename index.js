'use strict'

var mongoose = require('mongoose');
var config = require('./config')
var app = require('./app');
var port = config.port;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dbstore',{useNewUrlParser: true},
	(err,res) => {
	if (err) {
		throw err;
	} else{
		console.log("Conection Status OK 200");

		app.listen(port, function(){
			console.log("store-api rest server listening in port :" + port);
		});
	}
});