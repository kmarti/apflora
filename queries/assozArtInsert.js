'use strict';

var mysql = require('mysql');

var assozArtInsert = function(connection, request, callback) {
    var apId = decodeURIComponent(request.params.apId),
        user = decodeURIComponent(request.params.user),
        date = new Date().toISOString();
    console.log('date', date);
    connection.query(
        'INSERT INTO tblAssozArten (AaApArtId, MutWann, MutWer) VALUES (' + apId + ', "' + date + '", "' + user + '")',
        function(err, data) {
            if (err) throw err;
            callback(data.insertId);
        }
    );
};

module.exports = assozArtInsert;