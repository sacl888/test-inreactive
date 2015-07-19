//var env = process.env.NODE_ENV || 'production'
var env = process.env.NODE_ENV = 'development';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); 
var flash = require('connect-flash');
var cors = require('cors');
/*variables connection to the bd mongoDB*/
var dbConfig = require('./db');
var mongoose = require('mongoose');

/* Connect to db */
mongoose.connect(dbConfig.url);

//var routes = require('./routes/index');
//var users = require('./routes/users');

var swig = require('swig');
var fs = require('fs');

var app = require('express.io')();
app.http().io();

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine','html');
app.set('views', path.join(__dirname, '/website/views'));

if(env == 'development'){
    console.log('cache del sistema correctamente seteada');
    app.set('view cache', false);
}
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json('application/json'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: 'http://127.0.0.1'
}));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.set('superSecret', 'Serginho123');

// TODO - Why Do we need this key ?

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

fs.readdirSync('./website/controllers').forEach(function(file){
    if(file.substr(-3) == '.js'){
        route = require('./website/controllers/'+file);
        route.controller(app, passport);
    }    
}) 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {    
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;