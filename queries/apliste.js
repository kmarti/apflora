/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

module.exports = function (request, callback) {
    // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
    var sql,
        programm = decodeURIComponent(request.params.programm);
    // url setzen
    switch (programm) {
    case 'programmAp':
        sql = "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS label, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAp ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAp.ApArtId WHERE alexande_apflora.tblAp.ApStatus BETWEEN 1 AND 3 ORDER BY label";
        break;
    case 'programmNeu':
        sql = "SELECT IF(alexande_beob.ArtenDb_Arteigenschaften.Status NOT LIKE 'akzeptierter Name', CONCAT(alexande_beob.ArtenDb_Arteigenschaften.Artname, ' (', alexande_beob.ArtenDb_Arteigenschaften.Status, ')'), alexande_beob.ArtenDb_Arteigenschaften.Artname) AS label, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften WHERE alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId not in (SELECT alexande_apflora.tblAp.ApArtId FROM alexande_apflora.tblAp) ORDER BY label";
        break;
    case 'programmAlle':
    default:
        sql = "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS label, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAp ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAp.ApArtId ORDER BY label";
        break;
    }

    // Daten abfragen
    connection.query(
        sql,
        function (err, data) {
            callback(err, data);
        }
    );
};