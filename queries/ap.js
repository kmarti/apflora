'use strict';

var mysql = require('mysql');

var ap = function(connection, request, callback) {
    var apId = decodeURIComponent(request.params.apId);
    connection.query(
            'SELECT alexande_apflora.tblAktionsplan.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.tblAktionsplan.ApStatus, alexande_apflora.tblAktionsplan.ApJahr, alexande_apflora.tblAktionsplan.ApUmsetzung, alexande_apflora.tblAktionsplan.ApBearb, alexande_apflora.tblAktionsplan.ApArtwert, alexande_apflora.tblAktionsplan.MutWann, alexande_apflora.tblAktionsplan.MutWer FROM alexande_apflora.tblAktionsplan INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON alexande_apflora.tblAktionsplan.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId WHERE ApArtId = ' + apId,
        function(err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = ap;