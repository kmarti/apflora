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
        database: 'alexande_apflora_views'
    });

module.exports = function (request, callback) {
    var view = escapeStringForSql(decodeURIComponent(request.params.view)); // Name des Views, aus dem die Daten geholt werden sollen
    connection.query(
        'SELECT * FROM ' + view,
        function (err, data) {
            if (err) {
                throw err;
            }
            // null-werte eliminieren
            var data2 = data;
            _.each(data2, function (object) {
                _.each(object, function (value, key) {
                    if (value === null) {
                        object[key] = '';
                    }
                });
            });
            callback(err, data2);
        }
    );
};