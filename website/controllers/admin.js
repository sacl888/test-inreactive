var express = require('express');
var Admin = require('../models/user');

var isAuthenticated = function(req, res, next){
	if (req.isAuthenticated())
		return next();
	res.redirect('/');	
}

var ensureAdmin = function(req, res, next){
  	if(req.user && req.user.admin === true)
	    next();
  	else
      	res.redirect('/home');
}

module.exports.controller = function(app, passport){
	app.get('/admin/', isAuthenticated, ensureAdmin, function(req, res){
		res.render('admin/', {
			title: 'Home'
		});			
	});

	app.get('/admin/list_users', isAuthenticated, ensureAdmin, function(req, res){
		Admin.find({}, function(err, users){
			console.log(users);
			if(err) return next(err);
			res.render('admin/lista_usuarios_view',{
				title:'Lista Usuarios',
				users:users
			});
		})
	})

	app.get('/admin/findUpdate/:id', isAuthenticated, ensureAdmin, function(req, res){
		var idUser = req.params.id;
		Admin.findById(idUser, function(err, requestUser){
			if(err){
				console.log("Error al buscar el usuario");
			}else{
				res.send({
					user:requestUser
				});
				
			}
		})
	});

	app.post('/admin/update/:idUser', isAuthenticated, ensureAdmin, function(req, res){
		var idUser = req.params.idUser;
		dataUser = req.body;
		console.log(dataUser);
		Admin.findById(idUser, function(err, user){
			if(!err){
				user.username = dataUser.username;
				user.firstname = dataUser.firstname;
				user.lastname = dataUser.lastname;
				user.email = dataUser.email; 
				user.phone = dataUser.phone;
				user.admin = (dataUser.username == 'admin') ? true : false;
				user.save(function(err){
					var resError = (!err) ? '' : err;
					res.json({
						error:resError
					});
				})
			}else{
				console.log(err);
			}
		}) 
	})

	app.get('/admin/delete/:idUser', isAuthenticated, ensureAdmin, function(req, res){
		console.log(req.params);
		if(req.params.idUser){
			Admin.remove({_id:req.params.idUser}, function(err, user){		
				if(err){
					return next(err);
					console.log('error en la ejecución de la consulta');
				}else{
					console.log('Usuraio eliminado exitosamente: ' + user);
					res.redirect('/admin/list_users');
				}	
			});
		}
	})	

}