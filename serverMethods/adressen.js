'use strict';

var mysql  = require('mysql')
    , config = require('../src/modules/configuration')
    , connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    })
    ;

var adressen = function(request, callback) {
    connection.query(
        'SELECT AdrId AS id, AdrName FROM tblAdresse ORDER BY AdrName',
        function(err, data) {
            if (err) callback(err);
            callback(null, data);
        }
    );
};

module.exports = adressen;