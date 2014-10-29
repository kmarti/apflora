/*jslint node: true, browser: true, nomen: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var apliste = function (request, callback) {
    var sql;
    // url setzen
    switch (decodeURIComponent(request.params.programm)) {
    case 'programm_ap':
        sql = "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAktionsplan ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAktionsplan.ApArtId WHERE alexande_apflora.tblAktionsplan.ApStatus BETWEEN 1 AND 3 ORDER BY ap_name";
        break;
    case 'programm_neu':
        sql = "SELECT IF(alexande_beob.ArtenDb_Arteigenschaften.Status NOT LIKE 'akzeptierter Name', CONCAT(alexande_beob.ArtenDb_Arteigenschaften.Artname, ' (', alexande_beob.ArtenDb_Arteigenschaften.Status, ')'), alexande_beob.ArtenDb_Arteigenschaften.Artname) AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften WHERE alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId not in (SELECT alexande_apflora.tblAktionsplan.ApArtId FROM alexande_apflora.tblAktionsplan) ORDER BY ap_name";
        break;
    case 'programm_alle':
    default:
        sql = "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAktionsplan ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAktionsplan.ApArtId ORDER BY ap_name";
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

module.exports = apliste;