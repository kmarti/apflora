/*jslint node: true, browser: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var returnFunction = function (request, callback) {
    var tpopId = decodeURIComponent(request.params.tpopId);
    // Daten abfragen
    connection.query(
        'SELECT tblAktionsplan.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, DomainApUmsetzung.DomainTxt AS ApUmsetzung, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopId, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft FROM (((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON tblAktionsplan.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId WHERE tblTeilpopulation.TPopXKoord Is Not Null AND tblTeilpopulation.TPopYKoord Is Not Null AND tblTeilpopulation.TPopId = ' + tpopId,
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = returnFunction;