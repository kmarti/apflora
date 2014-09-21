'use strict';

var mysql = require('mysql');

var ap = function(connection, request, callback) {
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