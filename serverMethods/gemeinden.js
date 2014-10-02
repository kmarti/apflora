'use strict';

var mysql = require('mysql'),
    config = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var gemeinden = function(request, callback) {
    connection.query(
        'SELECT GmdName FROM DomainGemeinden ORDER BY GmdName',
        function(err, data) {
            callback(err, data);
        }
    );
};

module.exports = gemeinden;