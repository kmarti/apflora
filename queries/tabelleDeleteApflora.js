/*jslint node: true, browser: true, nomen: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var tabelle = function (request, callback) {
    var tabelle       = decodeURIComponent(request.params.tabelle),       // der Name der Tabelle, aus der die Daten gelöscht werden sollen
        tabelleIdFeld = decodeURIComponent(request.params.tabelleIdFeld), // das ist der Name der ID der Tabelle
        tabelleId     = decodeURIComponent(request.params.tabelleId);     // der Wert der ID des zu löschenden Datensatzes

    connection.query(
        'DELETE FROM ' + tabelle + ' WHERE ' + tabelleIdFeld + '="' + tabelleId + '"',
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = tabelle;