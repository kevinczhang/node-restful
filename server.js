// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express();  // define our app using express
var bodyParser = require('body-parser'); //will let us get parameters from our POST requests
var morgan = require('morgan'); // will log requests to the console so we can see what is happening
var mongoose = require('mongoose');

var User = require('./app/models/user');
var userRouter;
var DBrouter;

var port = process.env.PORT || 8081;    // set our port

// Config based on config file
var config = require('./app/config');
if(config.useMongoDB){
    mongoose.connect(config.database); // connect to our database
    DBrouter = require('./app/mongoAPI/api');
    userRouter = require('./app/mongoAPI/userAPI');
}
if(config.useSqlite){
    DBrouter = require('./app/sqliteAPI/api');
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

// get an instance of the router for api routes
var authRoutes = require('./app/authentication/authenticationAPI');

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', DBrouter);

if(config.useMongoDB){
    app.all('*', authRoutes);
    app.use('/api', userRouter);
}

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);