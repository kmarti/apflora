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
        'SELECT AdrId AS id, AdrName FROM tblAdresse ORDER BY AdrName',
        function (err, data) {
            callback(err, data);
        }
    );
};