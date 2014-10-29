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
    connection.query(
        "SELECT TaxonomieId AS id, IF(Status NOT LIKE 'akzeptierter Name', CONCAT(Artname, ' (', Status, ')'), Artname) AS name FROM alexande_beob.ArtenDb_Arteigenschaften ORDER BY Artname",
        function (err, data) {
            callback(err, data);
        }
    );
};

module.exports = artliste;