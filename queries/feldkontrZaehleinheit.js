/*jslint node: true, browser: true, nomen: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var returnFunction = function (request, callback) {
    connection.query(
        'SELECT ZaehleinheitCode, ZaehleinheitTxt FROM DomainTPopKontrZaehleinheit ORDER BY ZaehleinheitOrd',
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = returnFunction;