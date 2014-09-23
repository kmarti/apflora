'use strict';

var mysql = require('mysql')
    , config = require('../src/modules/configuration')
    , connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_beob'
    })
    ;

var tabelle = function(request, callback) {
    var id = decodeURIComponent(request.params.id);     // der Wert der ID
    connection.query(
        'SELECT * FROM tblBeobInfospezies WHERE NO_NOTE=' + id,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = tabelle;