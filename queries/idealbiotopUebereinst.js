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
        'SELECT DomainCode, DomainTxt FROM DomainTPopKontrIdBiotUebereinst ORDER BY DomainOrd',
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = returnFunction;