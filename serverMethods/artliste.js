'use strict';

var mysql = require('mysql');

var artliste = function(connection, request, callback) {
    connection.query(
        "SELECT TaxonomieId, IF(Status Is Not Null, CONCAT(Artname, '   ', Status), Artname) AS Artname FROM ArtenDb_Arteigenschaften ORDER BY Artname",
        function(err, data) {
            if (err) callback(err);
            callback(null, data);
        }
    );
};

module.exports = artliste;