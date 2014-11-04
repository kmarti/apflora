/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql      = require('mysql'),
    async      = require('async'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var returnFunction = function (request, callback) {
    var tpopId      = decodeURIComponent(request.params.tpopId),
        popId       = decodeURIComponent(request.params.popId),
        user        = decodeURIComponent(request.params.user),          // der Benutzername
        date        = new Date().toISOString();                         // wann gespeichert wird

    async.series([
        function (callback) {
            // Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
            connection.query(
                'CREATE TEMPORARY TABLE tmp SELECT * FROM tblTeilpopulation WHERE TPopId = ' + tpopId,
                function (err) {
                    // nur allfällige Fehler weiterleiten
                    callback(err, null);
                }
            );
        },
        function (callback) {
            // TPopId anpassen
            connection.query(
                'UPDATE tmp SET TPopId = NULL, PopId = ' + popId + ', MutWann="' + date + '", MutWer="' + user + '"',
                function (err) {
                    // nur allfällige Fehler weiterleiten
                    callback(err, null);
                }
            );
        },
        function (callback) {
            connection.query(
                'INSERT INTO tblTeilpopulation SELECT * FROM tmp',
                function (err, data) {
                    callback(err, data.insertId);
                }
            );
        }
    ], function (err, results) {
        // neue id zurück liefern
        return results[2];
    });
};

module.exports = returnFunction;