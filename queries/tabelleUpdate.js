/**
 * aktualisiert ein Feld in einer Tabelle
 * Namen von Tabelle und Feld werden übermittelt
 */

'use strict';

var mysql = require('mysql');

var tabelleUpdate = function(connection, request, callback) {
    var tabelle = decodeURIComponent(request.params.tabelle),
        tabelleIdFeld = decodeURIComponent(request.params.tabelleIdFeld),
        tabelleId = decodeURIComponent(request.params.tabelleId),
        feld = decodeURIComponent(request.params.feld),
        wert = decodeURIComponent(request.params.wert),
        user = decodeURIComponent(request.params.user),
        date = new Date().toISOString(),
        sql = 'UPDATE ' + tabelle + ' SET ' + feld + '="' + wert + '", MutWann="' + date + '", MutWer="' + user + '" WHERE ' + tabelleIdFeld + ' = ' + tabelleId;
    // Ist ein Feld neu leer, muss NULL übergeben werden
    // wert ist dann 'undefined'
    if (wert === 'undefined') sql = 'UPDATE ' + tabelle + ' SET ' + feld + '= NULL, MutWann="' + date + '", MutWer="' + user + '" WHERE ' + tabelleIdFeld + ' = ' + tabelleId;
    connection.query(
        sql,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = tabelleUpdate;