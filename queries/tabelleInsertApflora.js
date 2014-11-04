/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql      = require('mysql'),
    _          = require('underscore'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var assozartInsert = function (request, callback) {
    var tabelle = decodeURIComponent(request.params.tabelle),             // der Name der Tabelle, in der die Daten gespeichert werden sollen
        feld    = decodeURIComponent(request.params.feld),                // der Name des Felds, dessen Daten gespeichert werden sollen
        wert    = decodeURIComponent(request.params.wert),                // der Wert, der gespeichert werden soll
        user    = decodeURIComponent(request.params.user),                // der Benutzername
        date    = new Date().toISOString(),                               // wann gespeichert wird
        configTable = _.findWhere(config.tables, {tabelleInDb: tabelle}), // die table in der Konfiguration, welche die Informationen dieser Tabelle enthält
        nameMutwannFeld = configTable.mutWannFeld || 'MutWann',           // so heisst das MutWann-Feld in dieser Tabelle
        nameMutWerFeld = configTable.mutWerFeld || 'MutWer';              // so heisst das MutWer-Feld in dieser Tabelle

    connection.query(
        'INSERT INTO ' + tabelle + ' (' + feld + ', ' + nameMutwannFeld + ', ' + nameMutWerFeld + ') VALUES ("' + wert + '", "' + date + '", "' + user + '")',
        function (err, data) {
            if (err) throw err;
            callback(data.insertId);
        }
    );
};

module.exports = assozartInsert;