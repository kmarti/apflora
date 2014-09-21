'use strict';

var mysql = require('mysql');

var gemeinden = function(connection, request, callback) {
    connection.query(
        'SELECT GmdName FROM DomainGemeinden ORDER BY GmdName',
        function(err, data) {
            if (err) callback(err);
            callback(null, data);
        }
    );
};

module.exports = gemeinden;