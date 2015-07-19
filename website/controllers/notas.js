var express = require('express');
var Notas = require('../models/notas');
var db = {};

module.exports.controller = function(app, passport){

	app.get('/notas', function(req, res){
		Notas.find({}, function(err, notas){
			if(err){
				return res.send(err);
			}
			res.json({
				notas:notas
			});
		});		
	});

	app.post('/notas/save', function(req, res) {
	  console.log('POST', req.body);
	  var postNota = req.body;
	  var newNota = new Notas();

	  newNota.title = postNota.title,
	  newNota.description = postNota.description,
	  newNota.type = postNota.type,
	  newNota.body = postNota.body

	  newNota.save(function(err){
	  	if(err){
	  		console.log('Error in saving nota');
	  	}else{
	  		console.log('Nota registration successful');
	  		res.set('Content-Type','application/json');
		  	res.status(201);

		  	// send response
	  		res.json({
			    nota: postNota
		  	});
	  	}
	  })	  
	  
	});

	app.get('/notas/:id?', function(req, res){
		console.log('GET /notas/%s', req.params.id);
		var id = req.params.id;		
		Notas.findOne({ '_id' : id }, function(err, nota){
			if(err){
				console.log('Error in Get nota by id: ', err);				
				return res.send(err);
			}
			if(nota){
				res.json({
					nota:nota
				});
			}else{
				console.log('No se encontró la nota');
				return false;
			}
		});		
	});

	app.put('/notas/:id', function(req, res){
		
		var id = req.params.id;
		var Update = req.body;
		Notas.findById(id, function(err, nota){
			if(!err){
				nota.title = Update.nota.title;
				nota.description = Update.nota.description;
				nota.type = Update.nota.type;
				nota.body = Update.nota.body;
				nota.save(function (err){
					if(!err){
						res.json({
							nota: nota
						});
					}else{
						console.log(err);
					}
				});
			}else{
				console.log("Error buscando la nota");
			}
		});     

	});

	app.delete('/notas/:id?', function(req, res){
		var id = req.params.id;

		Notas.findById(id, function (err, nota){
			nota.remove(function(err){
				if(!err){
					res
						.status(204)
						.send();
				}else{
					console.log(err);
				}					
			})	
		})

		
	})
}
