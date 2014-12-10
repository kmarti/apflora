/**
 * bekommt einen Datensatz von window.apf.deleted
 * stellt ihn wieder her
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql              = require('mysql'),
    _                  = require('underscore'),
    config             = require('../src/modules/configuration'),
    escapeStringForSql = require('./escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

module.exports = function (request, callback) {
    var tabelle = escapeStringForSql(request.params.tabelle), // der Name der Tabelle, in der die Daten gespeichert werden sollen
        felder  = request.params.felder,                      // Ein Objekt mit allen feldern und deren Werten des wiederherzustellenden Datensatzes
        sql,
        feldnamen,
        feldwerte;

    felder = JSON.parse(felder);

    // Feldnamen und -werte extrahieren
    feldnamen = _.keys(felder).join();
    feldwerte = _.values(felder).join('","');

    // sql beginnen
    sql = 'INSERT INTO ' + tabelle + ' (' + feldnamen + ') VALUES ("' + feldwerte + '")';

    connection.query(
        sql,
        function (err, data) {
            if (err) { throw err; }
            callback(data.insertId);
        }
    );
};