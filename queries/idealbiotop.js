'use strict';

var mysql = require('mysql');

var idealbiotop = function(connection, request, callback) {
    var apId = decodeURIComponent(request.params.apId);
    connection.query(
        'SELECT * FROM tblIdealbiotop WHERE IbApArtId=' + apId,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = idealbiotop;