'use strict';

var mysql = require('mysql'),
    config = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_beob'
    });

var tabelle = function(request, callback) {
    var tabelle = decodeURIComponent(request.params.tabelle), // Name der Tabelle, aus der die Daten geholt werden sollen
        feld    = decodeURIComponent(request.params.feld),    // Name der ID der Tabelle
        wert    = decodeURIComponent(request.params.wert);    // Wert der ID

    connection.query(
        'SELECT * FROM ' + tabelle + ' WHERE ' + feld + '=' + wert,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = tabelle;