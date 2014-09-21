'use strict';

var mysql = require('mysql');

var adressen = function(connection, request, callback) {
    connection.query(
        'SELECT AdrId AS id, AdrName FROM tblAdresse ORDER BY AdrName',
        function(err, data) {
            if (err) callback(err);
            callback(null, data);
        }
    );
};

module.exports = adressen;