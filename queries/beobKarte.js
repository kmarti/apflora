'use strict';

var mysql = require('mysql')
    , config = require('../src/modules/configuration')
    , connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    })
    ;

var beobKarte = function(request, callback) {
    var apId = decodeURIComponent(request.params.apId),
        beobId = decodeURIComponent(request.params.beobid);
    connection.query(
        'SELECT NO_ISFS, alexande_apflora.tblTeilpopulation.TPopId, COORDONNEE_FED_E, COORDONNEE_FED_N, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((COORDONNEE_FED_E-TPopXKoord)*(COORDONNEE_FED_E-TPopXKoord)+(COORDONNEE_FED_N-TPopYKoord)*(COORDONNEE_FED_N-TPopYKoord)) AS DistZuTPop FROM alexande_beob.tblBeobEvab INNER JOIN (alexande_apflora.tblPopulation INNER JOIN alexande_apflora.tblTeilpopulation ON alexande_apflora.tblPopulation.PopId = alexande_apflora.tblTeilpopulation.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE_PROJET ="' + beobid + '" AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL AND COORDONNEE_FED_E IS NOT NULL AND COORDONNEE_FED_N IS NOT NULL ORDER BY DistzuTPop, TPopFlurname',
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = beobKarte;