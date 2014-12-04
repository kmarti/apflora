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
    var apId = decodeURIComponent(request.params.apId);
    // Daten abfragen
    connection.query(
        'SELECT alexande_apflora.tblAp.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.domApUmsetzung.DomainTxt AS ApUmsetzung, alexande_apflora.tblPop.PopId, alexande_apflora.tblPop.PopNr, alexande_apflora.tblPop.PopName, alexande_apflora.domPopHerkunft.HerkunftTxt AS PopHerkunft, alexande_apflora.tblPop.PopBekanntSeit, alexande_apflora.tblTPop.TPopId, alexande_apflora.tblTPop.TPopFlurname, alexande_apflora.tblTPop.TPopNr, alexande_apflora.tblTPop.TPopGemeinde, alexande_apflora.tblTPop.TPopXKoord, alexande_apflora.tblTPop.TPopYKoord, domPopHerkunft_1.HerkunftTxt AS TPopHerkunft FROM (((((alexande_apflora.tblAp INNER JOIN alexande_apflora.tblPop ON alexande_apflora.tblAp.ApArtId = alexande_apflora.tblPop.ApArtId) INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId) INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON alexande_apflora.tblAp.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId) LEFT JOIN alexande_apflora.domPopHerkunft ON alexande_apflora.tblPop.PopHerkunft = alexande_apflora.domPopHerkunft.HerkunftId) LEFT JOIN alexande_apflora.domApUmsetzung ON alexande_apflora.tblAp.ApUmsetzung = alexande_apflora.domApUmsetzung.DomainCode) LEFT JOIN alexande_apflora.domPopHerkunft AS domPopHerkunft_1 ON alexande_apflora.tblTPop.TPopHerkunft = domPopHerkunft_1.HerkunftId WHERE alexande_apflora.tblTPop.TPopXKoord Is Not Null AND alexande_apflora.tblTPop.TPopYKoord Is Not Null AND alexande_apflora.tblAp.ApArtId = ' + apId,
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};