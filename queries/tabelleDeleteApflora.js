/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql              = require('mysql'),
    config             = require('../src/modules/configuration'),
    escapeStringForSql = require('./escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

module.exports = function (request, callback) {
    var tabelle       = escapeStringForSql(request.params.tabelle),       // der Name der Tabelle, aus der die Daten gelöscht werden sollen
        tabelleIdFeld = escapeStringForSql(request.params.tabelleIdFeld), // das ist der Name der ID der Tabelle
        tabelleId     = escapeStringForSql(request.params.tabelleId);     // der Wert der ID des zu löschenden Datensatzes

    connection.query(
        'DELETE FROM ' + tabelle + ' WHERE ' + tabelleIdFeld + '="' + tabelleId + '"',
        function (err, data) {
            if (err) { throw err; }
            callback(data);
        }
    );
};