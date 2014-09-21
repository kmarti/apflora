'use strict';

var mysql = require('mysql');

var apliste = function(cacheId, connection, request, callback) {
    switch(decodeURIComponent(request.params.programm)) {
        case 'programm_ap':
            connection.query(
                "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAktionsplan ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAktionsplan.ApArtId WHERE alexande_apflora.tblAktionsplan.ApStatus BETWEEN 1 AND 3 ORDER BY ap_name",
                function(err, data) {
                    if (err) callback(err);
                    callback(null, data);
                }
            );
            break;
        case 'programm_alle':
            connection.query(
                "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAktionsplan ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAktionsplan.ApArtId ORDER BY ap_name",
                function(err, data) {
                    if (err) callback(err);
                    callback(null, data);
                }
            );
            break;
        default:
            connection.query(
                "SELECT IF(alexande_beob.ArtenDb_Arteigenschaften.Status is not null, CONCAT(alexande_beob.ArtenDb_Arteigenschaften.Artname, '   ', alexande_beob.ArtenDb_Arteigenschaften.Status), alexande_beob.ArtenDb_Arteigenschaften.Artname) AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften WHERE alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId not in (SELECT alexande_apflora.tblAktionsplan.ApArtId FROM alexande_apflora.tblAktionsplan) ORDER BY ap_name",
                function(err, data) {
                    if (err) callback(err);
                    callback(null, data);
                }
            );
            break;
    }
};

module.exports = apliste;