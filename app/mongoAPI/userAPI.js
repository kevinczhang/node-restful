var User = require('../models/user');
var express = require('express'); // call express
var config = require('../mongoAPI/config');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();      // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening in user API.');
    next(); // make sure we go to the next routes and don't stop here
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/users')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function (req, res) {

        var user = new User();      // create a new instance of the Bear model
        user.name = req.body.name;  // set the bears name (comes from the request)
        user.password = req.body.password;
        user.admin = req.body.admin;

        // save the bear and check for errors
        user.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

module.exports = router;