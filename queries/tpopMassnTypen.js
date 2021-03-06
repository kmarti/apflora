/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

module.exports = function (request, callback) {
    connection.query(
        'SELECT MassnTypCode as id, MassnTypTxt FROM domTPopMassnTyp ORDER BY MassnTypOrd',
        function (err, data) {
            if (err) { throw err; }
            callback(data);
        }
    );
};