'use strict';

var mysql = require('mysql'),
    config = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var ap = function(request, callback) {
    var userName = decodeURIComponent(request.params.name),
        password = decodeURIComponent(request.params.pwd);
    connection.query(
        'SELECT NurLesen FROM tblUser WHERE UserName = "' + userName + '" AND Passwort = "' + password + '"',
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = ap;