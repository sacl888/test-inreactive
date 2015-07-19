var express = require('express');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var jwt    = require('jsonwebtoken');


var isAuthenticated = function(req, res, next){
	if (req.isAuthenticated())		
		return next();
	res.redirect('/');	
}

var ensureAdmin = function(req, res, next){
  	if(req.user && req.user.admin === true)
	     next();
  	else
      	res.redirect('/');
}

var getUser = function(req, res, next){
	var idUser = req.session.passport.user;	
	User.findById(idUser, function(err, user){
		if(err){
			
		}else{
			req.user = user;
			next();
		}		
	});	
}


var objectUsers = {};

module.exports.controller = function(app, passport){
	

	/*app.io.route('login', function(req){
		//console.log(req.data);		
		var username = req.data.username;
		var password = req.data.password;

		User.findOne({ 'username' :  username }, function(err, user) {
                // In case of any error, return using the done method
                if(err)
                    return done(err);
                // Username does not exist, log the error and redirect back
                if (!user){
                    console.log('User Not Found with username '+username);
                } 
                // User exists but wrong password, log the error 
                if (!isValidPassword(user, password)){
                    console.log('Su contraseña no es correcta');
                }
                //console.log('Logueado correctamentr');
                req.session = user;
	    		req.io.emit('session', req.session);
        });		
	});


	/*app.io.route('post', {
		create: function(req){			
			app.io.broadcast('post:create', req.data)
		},
		remove: function(req){
			app.io.broadcast('post:remove', req.data)
		}
	})	

	/*app.io.route('ready', function(req) {
		console.log(req);
		User.find({online:1}, function(err, users){
			req.io.emit('usersOnline', users)
			req.io.broadcast('usersOnline', users)
		});	    
	});

	app.io.route('salir', function(req){		
		var idUser = req.data._id;
		var dataUser = req.data;
  		User.findById(idUser, function(err, user){
			if(!err){
				user.username = dataUser.username;
				user.firstname = dataUser.firstname;
				user.lastname = dataUser.lastname;
				user.email = dataUser.email; 
				user.phone = dataUser.phone;
				user.admin = (dataUser.username == 'admin') ? true : false;
				user.online = 0;
				user.save(function(err){
					User.find({online:1}, function(err, users){
						req.io.broadcast('usersOnline', users)
					})
				});												
			}else{
				console.log(err);
			}
		});  		
	})

	app.io.route('disconnect', function(req) {
		console.log('HOLA MUNDO DISCONNECT!!!!!!', req);
	  	/*
		User.find({online:1}, function(err, users){
			req.io.broadcast('usersOnline', users)
		});	
	  	*/  	 
	/*});*/

	var ensureToken = function(req, res, next){
	    // check header or url parameters or post parameters for token
	    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	    // decode token
	    if (token) {
	    	//console.log('VA POR ACÁ');
	        // verifies secret and checks exp
	        jwt.verify(token, app.get('superSecret'), function(err, decoded) { 
	        	console.log('VA POR AQUÍ :)');
	            
				if (err) {
	                return res.json({ success: false, message: 'Failed to authenticate token.' });      
	            } else {
	                //console.log('VA POR ACÁ');
	                // if everything is good, save to request for use in other routes
	                req.decoded = decoded;  
	                next();
	            }	            
	        });
	    }else{
	        // if there is no token
	        // return an error
	        return res.status(403).send({ 
	            success: false, 
	            message: 'No token provided.'
	        });        
	    }    
	}

	app.io.route('ready', function(req){
		User.find({online:1}, function(err, users){
			if(err){
				console.log('Ocurrió un error buscando los usuarios online');
			}else{
				req.io.emit('usersOnline', {users:users})
				req.io.broadcast('usersOnline', {users:users})
			}			
		})		
	})


	app.post('/ingreso', passport.authenticate('login', {
		failureRedirect: '/failedUser',
		failureFlash : true  
	}),
		function(req, res) {
			console.log(req);
			// req.authInfo is set using the `info` argument supplied by
            // `BearerStrategy`.  It is typically used to indicate a scope of the token,
            // and used in access control checks.  For illustrative purposes, this
            // example simply returns the scope in the response.
            var user = {
            	user_id: req.user._id,
            	username: req.user.username,
            	firstname:req.user.firstname,
            	lastname: req.user.lastname,
            	email : req.user.email,
            	phone: req.user.phone,
            	online: req.user.online,
            	admin: req.user.admin,
            	scope: req.authInfo,
            }

            var token = jwt.sign(user, app.get('superSecret'), {
				expiresInMinutes: 2 // expires in 24 hours
			});

			User.findById(req.user._id, function(err, user){
				if(!err){
					user.username = user.username;
					user.firstname = user.firstname;
					user.lastname = user.lastname;
					user.email = user.email; 
					user.phone = user.phone;
					user.admin = (user.username == 'admin') ? true : false;
					user.online = 1;
					user.save(function(err){					
						if(err){
							console.log('Error al editar el usuario');
						}else{
							res.json({ 
				            	error:'',
				            	user : user,
				            	token:token 
				            })	
						}
					});												
				}else{
					console.log(err);
				}
			})            		           
        }		
	);	

	//simple route get information..
	app.post('/information', ensureToken, function(req, res){				
  		res.json({ message: 'Welcome to the coolest API on earth!', success:true });		
	});

	app.get('/failedUser', function(req, res){
  		res.json({
		    error: 'Error al iniciar sesión, por favor verifique sus datos'
	  	});			
	});

	//#####################################

 	app.get('/', function(req, res) {
	  res.render('index', { message: req.flash('message') });
	});
	
  	app.get('/login', function(req, res){
      	// any logic goes here
      	res.render('index', { message: req.flash('message') });
  	}); 	

	/* Handle Login POST */
	app.post('/authenticate', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	app.get('/register', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	app.post('/register', passport.authenticate('register', {
		successRedirect: '/home',
		failureRedirect: '/register',
		failureFlash : true  
	}));

	app.get('/home', getUser, isAuthenticated, function(req, res){		
		//objectUsers["users"] = req.user;		
		console.log('My id session: ',req.session.passport.user);
		var idUser = req.user._id;
		var dataUser = req.user;	
		//req.session = req.user._id;	
		
		User.findById(idUser, function(err, user){
			if(!err){
				user.username = dataUser.username;
				user.firstname = dataUser.firstname;
				user.lastname = dataUser.lastname;
				user.email = dataUser.email; 
				user.phone = dataUser.phone;
				user.admin = (dataUser.username == 'admin') ? true : false;
				user.online = 1;
				user.save(function(err){					
					res.render('home',{user: user, title:'Welcome to the Home'});
				});
												
			}else{
				console.log(err);
			}
		})	
	});		

  	app.get('/salir', function(req, res){
  		req.io.broadcast('logout',req.user)					
		req.logout();
		res.redirect('/');  		      	
  	});

  	app.post('/api/salir', function(req, res){		
		var idUser = req.body.user_id;
		User.findById(idUser, function(err, user){
			if(!err){
				user.username = user.username;
				user.firstname = user.firstname;
				user.lastname = user.lastname;
				user.email = user.email; 
				user.phone = user.phone;
				user.admin = (user.username == 'admin') ? true : false;
				user.online = 0;
				user.save(function(err){					
					if(err){
						console.log('Error al editar el usuario');
					}else{
						req.logout();
						res.json({ 
				        	error:'',        	
				        })
					}
				});												
			}else{
				console.log(err);
			}
		})		
  	});
}