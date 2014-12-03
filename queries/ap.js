/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql = require('mysql'),
    config = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var ap = function (request, callback) {
    var apId = decodeURIComponent(request.params.apId);
    connection.query(
        'SELECT alexande_apflora.tblAp.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.tblAp.ApStatus, alexande_apflora.tblAp.ApJahr, alexande_apflora.tblAp.ApUmsetzung, alexande_apflora.tblAp.ApBearb, alexande_apflora.tblAp.ApArtwert, alexande_apflora.tblAp.MutWann, alexande_apflora.tblAp.MutWer FROM alexande_apflora.tblAp INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON alexande_apflora.tblAp.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId WHERE ApArtId = ' + apId,
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = ap;