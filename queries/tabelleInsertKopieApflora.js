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

var returnFunction = function(request, callback) {
    var tabelle   = decodeURIComponent(request.params.tabelle),     // der Name der Tabelle, in der die Daten gespeichert werden sollen
        feldliste = decodeURIComponent(request.params.feldliste),   // der Name des Felds, dessen Daten gespeichert werden sollen
        wertliste = decodeURIComponent(request.params.wertliste),   // der Wert, der gespeichert werden soll
        user      = decodeURIComponent(request.params.user),        // der Benutzername
        date      = new Date().toISOString();                       // wann gespeichert wird

    // sicherstellen, dass die Werte keine Kommatas enthalten
    _.each(wertliste, function(wert) {
        wert = wert.replace(',', ';');
    });

    connection.query(
        'INSERT INTO ' + tabelle + ' (' + feldliste.join() + ', MutWann) VALUES (' + wertliste.join() + ', "' + date + '")',
        function(err, data) {
            if (err) throw err;
            callback(data.insertId);
        }
    );
};

module.exports = returnFunction;