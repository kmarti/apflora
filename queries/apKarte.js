'use strict';

var mysql = require('mysql'),
    config = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var returnFunction = function(request, callback) {
    var apId = decodeURIComponent(request.params.apId);
    // Daten abfragen
    connection.query(
        'SELECT alexande_apflora.tblAktionsplan.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.DomainApUmsetzung.DomainTxt AS ApUmsetzung, alexande_apflora.tblPopulation.PopId, alexande_apflora.tblPopulation.PopNr, alexande_apflora.tblPopulation.PopName, alexande_apflora.DomainPopHerkunft.HerkunftTxt AS PopHerkunft, alexande_apflora.tblPopulation.PopBekanntSeit, alexande_apflora.tblTeilpopulation.TPopId, alexande_apflora.tblTeilpopulation.TPopFlurname, alexande_apflora.tblTeilpopulation.TPopNr, alexande_apflora.tblTeilpopulation.TPopGemeinde, alexande_apflora.tblTeilpopulation.TPopXKoord, alexande_apflora.tblTeilpopulation.TPopYKoord, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft FROM (((((alexande_apflora.tblAktionsplan INNER JOIN alexande_apflora.tblPopulation ON alexande_apflora.tblAktionsplan.ApArtId = alexande_apflora.tblPopulation.ApArtId) INNER JOIN alexande_apflora.tblTeilpopulation ON alexande_apflora.tblPopulation.PopId = alexande_apflora.tblTeilpopulation.PopId) INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON alexande_apflora.tblAktionsplan.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId) LEFT JOIN alexande_apflora.DomainPopHerkunft ON alexande_apflora.tblPopulation.PopHerkunft = alexande_apflora.DomainPopHerkunft.HerkunftId) LEFT JOIN alexande_apflora.DomainApUmsetzung ON alexande_apflora.tblAktionsplan.ApUmsetzung = alexande_apflora.DomainApUmsetzung.DomainCode) LEFT JOIN alexande_apflora.DomainPopHerkunft AS DomainPopHerkunft_1 ON alexande_apflora.tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId WHERE alexande_apflora.tblTeilpopulation.TPopXKoord Is Not Null AND alexande_apflora.tblTeilpopulation.TPopYKoord Is Not Null AND alexande_apflora.tblAktionsplan.ApArtId = ' + apId,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = returnFunction;