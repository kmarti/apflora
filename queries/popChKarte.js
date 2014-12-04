/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

module.exports = function (request, callback) {
    var popId = decodeURIComponent(request.params.popId);
    // Daten abfragen
    connection.query(
        'SELECT tblAp.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, domApUmsetzung.DomainTxt AS ApUmsetzung, tblPop.PopId, tblPop.PopNr, tblPop.PopName, domPopHerkunft.HerkunftTxt AS PopHerkunft, tblPop.PopBekanntSeit, tblPop.PopXKoord, tblPop.PopYKoord, tblPop.PopGuid FROM (((tblAp INNER JOIN tblPop ON tblAp.ApArtId = tblPop.ApArtId) INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON tblAp.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId) LEFT JOIN domPopHerkunft ON tblPop.PopHerkunft = domPopHerkunft.HerkunftId) LEFT JOIN domApUmsetzung ON tblAp.ApUmsetzung = domApUmsetzung.DomainCode WHERE tblPop.PopXKoord Is Not Null AND tblPop.PopYKoord Is Not Null AND tblPop.PopId = ' + popId,
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};