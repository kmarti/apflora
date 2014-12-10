/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql              = require('mysql'),
    config             = require('../src/modules/configuration'),
    escapeStringForSql = require('./escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

module.exports = function (request, callback) {
    var beobId = escapeStringForSql(request.params.beobId);

    connection.query(
        'SELECT NO_NOTE_PROJET, NO_ISFS, alexande_apflora.tblTPop.TPopId, COORDONNEE_FED_E, COORDONNEE_FED_N, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((COORDONNEE_FED_E-TPopXKoord)*(COORDONNEE_FED_E-TPopXKoord)+(COORDONNEE_FED_N-TPopYKoord)*(COORDONNEE_FED_N-TPopYKoord)) AS DistZuTPop FROM alexande_beob.tblBeobEvab INNER JOIN (alexande_apflora.tblPop INNER JOIN alexande_apflora.tblTPop ON alexande_apflora.tblPop.PopId = alexande_apflora.tblTPop.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE_PROJET ="' + beobId + '" AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL AND COORDONNEE_FED_E IS NOT NULL AND COORDONNEE_FED_N IS NOT NULL ORDER BY DistzuTPop, TPopFlurname',
        function (err, data) {
            if (err) { throw err; }
            callback(data);
        }
    );
};