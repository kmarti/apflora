/*jslint node: true, browser: true, nomen: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_beob'
    });

var artliste = function (request, callback) {
    console.log('get artliste');
    connection.query(
        "SELECT TaxonomieId, IF(Status Is Not Null, CONCAT(Artname, '   ', Status), Artname) AS Artname FROM ArtenDb_Arteigenschaften ORDER BY Artname",
        function (err, data) {
            console.log('GOT artliste');
            callback(err, data);
        }
    );
};

module.exports = artliste;