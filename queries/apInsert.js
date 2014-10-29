/*jslint node: true, browser: true */
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

var returnFunction = function (request, reply) {
    var apId = decodeURIComponent(request.params.apId), // ApArtId
        user = decodeURIComponent(request.params.user), // der Benutzername
        date = new Date().toISOString();                // wann gespeichert wird

    async.parallel({
        insertIntoTblAktionsplan: function (callback) {
            connection.query(
                'INSERT INTO tblAktionsplan (ApArtId, MutWann, MutWer) VALUES (' + apId + ', "' + date + '", "' + user + '")',
                function (err, data) {
                    callback(err, null);
                }
            );
        },
        getArtwert: function (callback) {
            connection.query(
                'SELECT Artwert FROM alexande_beob.ArtenDb_Arteigenschaften WHERE TaxonomieId=' + apId,
                function (err, data) {
                    // keine Fehler melden, wenn bloss der Artwert nicht geholt wurde
                    if (data && data[0]) {
                        var artwert = data[0];
                        callback(null, artwert);
                    } else {
                        callback(null, null);
                    }
                }
            );
        }
    }, function (err, results) {
        var artwert = results.getArtwert || null;
        if (artwert) {
            connection.query(
                'UPDATE tblAktionsplan SET ApArtwert="' + artwert + '" WHERE ApArtId = ' + apId,
                function (err, data) {
                    // nichts tun
                }
            );
        }
    });
};

module.exports = returnFunction;