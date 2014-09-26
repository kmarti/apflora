'use strict';

var _ = require('underscore')
    , mysql = require('mysql')
    , config = require('../../src/modules/configuration')
    , connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    })
    , response = {}
    , responseArray = []
    ;

var jberÜbersicht = function(JBerJahr) {
    connection.query(
        'SELECT JbuJahr FROM tblJBerUebersicht WHERE JbuJahr=' + JBerJahr,
        function(err, data) {
            if (err) throw err;
            if (data && data[0]) {
                data = data[0];
                response.data = 'Übersicht zu allen Arten';
                response.attr = {
                    id: data.JbuJahr,
                    typ: 'jber_uebersicht'
                };
                responseArray.push(response);
                return responseArray;
            } else {
                return null;
            }
        }
    );
};

module.exports = jberÜbersicht;