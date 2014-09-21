'use strict';

var mysql = require('mysql');

var assozart = function(connection, request, callback) {
    var assozartId = decodeURIComponent(request.params.assozArtId);
    connection.query(
        'SELECT * FROM tblAssozArten WHERE AaId=' + assozartId,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = assozart;