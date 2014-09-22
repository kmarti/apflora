/**
 * aktualisiert ein Feld in einer Tabelle
 * Namen von Tabelle und Feld werden übermittelt
 */

'use strict';

var mysql = require('mysql');

var tabelleUpdate = function(connection, request, callback) {
    var apId = decodeURIComponent(request.params.apId),
        feld = decodeURIComponent(request.params.feld),
        wert = decodeURIComponent(request.params.wert),
        user = decodeURIComponent(request.params.user),
        date = new Date().toISOString();
    if (wert === null) wert = 'NULL';
    console.log('date', date);
    connection.query(
        'UPDATE tblAssozArten SET ' + feld + '="' + wert + '", MutWann="' + date + '", MutWer="' + user + '" WHERE AaId = ' + apId,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = tabelleUpdate;