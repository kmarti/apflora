/**
 * bekommt einen Datensatz von window.apf.deleted
 * stellt ihn wieder her
 */

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

var tabelleUpdate = function(request, callback) {
    var tabelle         = decodeURIComponent(request.params.tabelle),         // der Name der Tabelle, in der die Daten gespeichert werden sollen
        felder          = decodeURIComponent(request.params.felder),          // Ein Objekt mit allen feldern und deren Werten des wiederherzustellenden Datensatzes
        sql,
        feldnamen,
        feldwerte;

    felder = JSON.parse(felder);

    console.log('felder: ', felder);

    // Feldnamen und -werte extrahieren
    feldnamen = _.keys(felder).join();
    feldwerte = _.values(felder).join('","');

    // sql beginnen
    sql = 'INSERT INTO ' + tabelle + ' (' + feldnamen + ') VALUES ("' + feldwerte + '")';

    console.log('sql: ', sql);

    connection.query(
        sql,
        function(err, data) {
            if (err) throw err;
            callback(data.insertId);
        }
    );
};

module.exports = tabelleUpdate;