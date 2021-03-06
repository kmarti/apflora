/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql              = require('mysql'),
    config             = require('../src/modules/configuration'),
    escapeStringForSql = require('./escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:      config.db.userName,
        password:  config.db.passWord,
        database: 'alexande_beob'
    });

module.exports = function (request, callback) {
    var tabelle = escapeStringForSql(request.params.tabelle), // Name der Tabelle, aus der die Daten geholt werden sollen
        feld    = escapeStringForSql(request.params.feld),    // Name der ID der Tabelle
        wert    = escapeStringForSql(request.params.wert);    // Wert der ID

    connection.query(
        'SELECT * FROM ' + tabelle + ' WHERE ' + feld + '=' + wert,
        function (err, data) {
            if (err) { throw err; }
            callback(data);
        }
    );
};