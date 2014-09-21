'use strict';

var mysql = require('mysql');

var assozArt = function(connection, request, callback) {
    var assozArtId = decodeURIComponent(request.params.assozArtId);
    connection.query(
        'SELECT * FROM tblAssozArten WHERE AaId=' + assozArtId,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = assozArt;