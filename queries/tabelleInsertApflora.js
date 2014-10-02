'use strict';

var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var assozartInsert = function(request, callback) {
    var tabelle = decodeURIComponent(request.params.tabelle), // der Name der Tabelle, in der die Daten gespeichert werden sollen
        feld    = decodeURIComponent(request.params.feld),    // der Name des Felds, dessen Daten gespeichert werden sollen
        wert    = decodeURIComponent(request.params.wert),    // der Wert, der gespeichert werden soll
        user    = decodeURIComponent(request.params.user),    // der Benutzername
        date    = new Date().toISOString();                   // wann gespeichert wird

    connection.query(
        'INSERT INTO ' + tabelle + ' (' + feld + ', MutWann, MutWer) VALUES (' + wert + ', "' + date + '", "' + user + '")',
        function(err, data) {
            if (err) throw err;
            callback(data.insertId);
        }
    );
};

module.exports = assozartInsert;