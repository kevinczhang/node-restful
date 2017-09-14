const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'leetcode_problems.db');
var express = require('express'); // call express

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();      // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('sqlite3 db is accessed.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
        // open the database
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the problems database.');
        });

        let sql = `SELECT ID as id, TITLE as title FROM problems`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            res.json(rows);
        });

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    })

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function (req, res) {
        // open the database
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the problems database.');
        });

        let sql = `INSERT INTO problems(ID, Number, Title, Difficulty, Description, Solution, Tags, Companies, SpecialTags) VALUES(?,?,?,?,?,?,?,?,?)`;

        // insert one row into the langs table
        db.run(sql, [440, req.body.name, 'req.body.title', req.body.level, req.body.description, '', '', '', ''], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });

    });

module.exports = router;