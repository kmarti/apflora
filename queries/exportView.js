'use strict';

var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora_views'
    });

var returnFunction = function (request, callback) {
    var view = decodeURIComponent(request.params.view); // Name des Views, aus dem die Daten geholt werden sollen
    connection.query(
        'SELECT * FROM ' + view,
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = returnFunction;