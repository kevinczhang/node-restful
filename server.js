// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express();  // define our app using express
var bodyParser = require('body-parser'); //will let us get parameters from our POST requests
var morgan = require('morgan'); // will log requests to the console so we can see what is happening
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); //is how we create and verify our JSON Web Tokens

var User = require('./app/models/user');

var router = require('./app/mongoAPI/api');
var userRouter = require('./app/mongoAPI/userAPI');
//var router = require('./app/sqliteAPI/api');

var port = process.env.PORT || 8081;    // set our port
// Start MongoDB
var config = require('./app/mongoAPI/config');
mongoose.connect(config.database); // connect to our database
app.set('superSecret', config.secret); // secret variable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function (req, res) {

    // find the user
    User.findOne({
        name: req.body.name
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user
                }, app.get('superSecret'));

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

// route middleware to verify a token
function checkToken(req, res, next) {
    if ( req.path == '/api/authenticate') return next();

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
};

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.all('*', checkToken)
app.use('/api', router);
app.use('/api', userRouter);
app.use('/api', apiRoutes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);