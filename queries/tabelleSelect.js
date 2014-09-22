'use strict';

var mysql = require('mysql');

var tabelle = function(connection, request, callback) {
    var tabelle   = decodeURIComponent(request.params.tabelle),       // der Name der Tabelle, aus der die Daten geholt werden sollen
    tabelleIdFeld = decodeURIComponent(request.params.tabelleIdFeld), // das ist der Name der ID der Tabelle
    tabelleId     = decodeURIComponent(request.params.tabelleId);     // der Wert der ID
    connection.query(
        'SELECT * FROM ' + tabelle + ' WHERE ' + tabelleIdFeld + '=' + tabelleId,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = tabelle;