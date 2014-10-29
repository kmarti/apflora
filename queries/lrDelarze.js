/*jslint node: true, browser: true, nomen: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_beob'
    });

var returnFunction = function (request, callback) {
    connection.query(
        'SELECT Label AS id, CONCAT(Label, ": ", REPEAT(" ",(7-LENGTH(Label))), Einheit) AS Einheit FROM ArtenDb_LR WHERE LrMethodId = 1 ORDER BY Label',
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = returnFunction;