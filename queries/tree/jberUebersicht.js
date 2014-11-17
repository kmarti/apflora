/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var _             = require('underscore'),
    mysql         = require('mysql'),
    config        = require('../../src/modules/configuration'),
    connection    = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var jberÜbersicht = function (JBerJahr) {
    connection.query(
        'SELECT JbuJahr FROM tblJBerUebersicht WHERE JbuJahr=' + JBerJahr,
        function (err, data) {
            var node      = {},
                nodeArray = [];

            if (err) throw err;

            if (data && data[0]) {
                data = data[0];
                node.data = 'Übersicht zu allen Arten';
                node.attr = {
                    id: data.JbuJahr,
                    typ: 'jberUebersicht'
                };
                nodeArray.push(node);
                return nodeArray;
            }
            return null;
        }
    );
};

module.exports = jberÜbersicht;