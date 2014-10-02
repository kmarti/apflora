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
    var popId = decodeURIComponent(request.params.popId);
    // Daten abfragen
    connection.query(
        'SELECT tblAktionsplan.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, DomainApUmsetzung.DomainTxt AS ApUmsetzung, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblPopulation.PopXKoord, tblPopulation.PopYKoord, tblPopulation.PopGuid FROM (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON tblAktionsplan.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode WHERE tblPopulation.PopXKoord Is Not Null AND tblPopulation.PopYKoord Is Not Null AND tblPopulation.PopId = ' + popId,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = returnFunction;