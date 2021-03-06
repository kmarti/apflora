/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql              = require('mysql'),
    config             = require('../src/modules/configuration'),
    escapeStringForSql = require('./escapeStringForSql'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:      config.db.userName,
        password:  config.db.passWord,
        database: 'alexande_beob'
    });

module.exports = function (request, callback) {
    var apId            = escapeStringForSql(request.params.apId),
        tpopId          = escapeStringForSql(request.params.tpopId),
        beobId          = escapeStringForSql(request.params.beobId),
        nichtZuzuordnen = request.params.nichtZuzuordnen,
        url;

    if (beobId !== 'undefined') {
        // beobid wurde übergeben > auf eine Beobachtung filtern
        url = 'SELECT tblBeobInfospezies.NO_NOTE, tblBeobInfospezies.NO_ISFS, tblBeobInfospezies.FNS_XGIS AS X, tblBeobInfospezies.FNS_YGIS AS Y, tblBeobInfospezies.A_NOTE, tblBeobBereitgestellt.Datum AS Datum, tblBeobBereitgestellt.Autor, tblBeobInfospezies.PROJET, tblBeobInfospezies.DESC_LOCALITE FROM tblBeobInfospezies INNER JOIN tblBeobBereitgestellt ON tblBeobInfospezies.NO_NOTE = tblBeobBereitgestellt.NO_NOTE WHERE tblBeobInfospezies.FNS_XGIS>0 AND tblBeobInfospezies.FNS_YGIS>0 AND tblBeobInfospezies.NO_NOTE="' + beobId + '" UNION SELECT tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, tblBeobEvab.NO_ISFS, tblBeobEvab.COORDONNEE_FED_E AS X, tblBeobEvab.COORDONNEE_FED_N AS Y, tblBeobEvab.A_NOTE, tblBeobBereitgestellt.Datum AS Datum, tblBeobBereitgestellt.Autor, tblBeobEvab.Projekt_ZH AS PROJET, tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE FROM tblBeobBereitgestellt INNER JOIN tblBeobEvab ON tblBeobBereitgestellt.NO_NOTE_PROJET = tblBeobEvab.NO_NOTE_PROJET WHERE tblBeobEvab.COORDONNEE_FED_E>0 AND tblBeobEvab.COORDONNEE_FED_N>0 AND tblBeobEvab.NO_NOTE_PROJET="' + beobId + '" ORDER BY Datum DESC LIMIT 100';
    } else if (tpopId !== 'undefined') {
        // tpopId wurde übergeben > auf tpop filtern
        url = 'SELECT alexande_beob.tblBeobInfospezies.NO_NOTE, alexande_beob.tblBeobInfospezies.NO_ISFS, alexande_beob.tblBeobInfospezies.FNS_XGIS AS X, alexande_beob.tblBeobInfospezies.FNS_YGIS AS Y, alexande_beob.tblBeobInfospezies.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum AS Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobInfospezies.PROJET, alexande_beob.tblBeobInfospezies.DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblTPop.TPopXKoord, alexande_apflora.tblTPop.TPopYKoord FROM (alexande_beob.tblBeobInfospezies INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE) INNER JOIN (alexande_apflora.tblTPop INNER JOIN alexande_apflora.tblBeobZuordnung ON alexande_apflora.tblTPop.TPopId = alexande_apflora.tblBeobZuordnung.TPopId) ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobInfospezies.FNS_XGIS>0 AND alexande_beob.tblBeobInfospezies.FNS_YGIS>0 AND alexande_apflora.tblBeobZuordnung.TPopId=' + tpopId + ' UNION SELECT alexande_beob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, alexande_beob.tblBeobEvab.NO_ISFS, alexande_beob.tblBeobEvab.COORDONNEE_FED_E AS X, alexande_beob.tblBeobEvab.COORDONNEE_FED_N AS Y, alexande_beob.tblBeobEvab.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum AS Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobEvab.Projekt_ZH AS PROJET, alexande_beob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblTPop.TPopXKoord, alexande_apflora.tblTPop.TPopYKoord FROM (alexande_beob.tblBeobBereitgestellt INNER JOIN alexande_beob.tblBeobEvab ON alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET = alexande_beob.tblBeobEvab.NO_NOTE_PROJET) INNER JOIN (alexande_apflora.tblTPop INNER JOIN alexande_apflora.tblBeobZuordnung ON alexande_apflora.tblTPop.TPopId = alexande_apflora.tblBeobZuordnung.TPopId) ON alexande_beob.tblBeobEvab.NO_NOTE_PROJET = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobEvab.COORDONNEE_FED_E>0 AND alexande_beob.tblBeobEvab.COORDONNEE_FED_N>0 AND alexande_apflora.tblBeobZuordnung.TPopId=' + tpopId + ' ORDER BY Datum DESC LIMIT 100';
    } else if (apId !== 'undefined') {
        // apart_id wurde übergeben > auf Art filtern
        if (nichtZuzuordnen !== 'undefined') {
            // die nicht zugeordneten
            url = 'SELECT alexande_beob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, alexande_beob.tblBeobEvab.NO_ISFS, alexande_beob.tblBeobEvab.COORDONNEE_FED_E AS X, alexande_beob.tblBeobEvab.COORDONNEE_FED_N AS Y, alexande_beob.tblBeobEvab.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum AS Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobEvab.Projekt_ZH AS PROJET, alexande_beob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId FROM (alexande_beob.tblBeobBereitgestellt INNER JOIN alexande_beob.tblBeobEvab ON alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET = alexande_beob.tblBeobEvab.NO_NOTE_PROJET) LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobEvab.NO_NOTE_PROJET = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobEvab.COORDONNEE_FED_E>0 AND alexande_beob.tblBeobEvab.COORDONNEE_FED_N>0 AND alexande_apflora.tblBeobZuordnung.beobNichtZuordnen =1 AND alexande_beob.tblBeobEvab.NO_ISFS=' + apId + ' UNION SELECT alexande_beob.tblBeobInfospezies.NO_NOTE, alexande_beob.tblBeobInfospezies.NO_ISFS, alexande_beob.tblBeobInfospezies.FNS_XGIS AS X, alexande_beob.tblBeobInfospezies.FNS_YGIS AS Y, alexande_beob.tblBeobInfospezies.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum AS Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobInfospezies.PROJET, alexande_beob.tblBeobInfospezies.DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId FROM (alexande_beob.tblBeobInfospezies INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE) LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobInfospezies.FNS_XGIS>0 AND alexande_beob.tblBeobInfospezies.FNS_YGIS>0 AND alexande_apflora.tblBeobZuordnung.beobNichtZuordnen=1 AND alexande_beob.tblBeobInfospezies.NO_ISFS=' + apId + ' ORDER BY Datum DESC LIMIT 100';
        } else {
            // die nicht zugewiesenen
            url = 'SELECT alexande_beob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, alexande_beob.tblBeobEvab.NO_ISFS, alexande_beob.tblBeobEvab.COORDONNEE_FED_E AS X, alexande_beob.tblBeobEvab.COORDONNEE_FED_N AS Y, alexande_beob.tblBeobEvab.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum AS Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobEvab.Projekt_ZH AS PROJET, alexande_beob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId FROM (alexande_beob.tblBeobBereitgestellt INNER JOIN alexande_beob.tblBeobEvab ON alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET = alexande_beob.tblBeobEvab.NO_NOTE_PROJET) LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobEvab.NO_NOTE_PROJET = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobEvab.COORDONNEE_FED_E>0 AND alexande_beob.tblBeobEvab.COORDONNEE_FED_N>0 AND alexande_apflora.tblBeobZuordnung.TPopId Is Null AND alexande_beob.tblBeobEvab.NO_ISFS=' + apId + ' UNION SELECT alexande_beob.tblBeobInfospezies.NO_NOTE, alexande_beob.tblBeobInfospezies.NO_ISFS, alexande_beob.tblBeobInfospezies.FNS_XGIS AS X, alexande_beob.tblBeobInfospezies.FNS_YGIS AS Y, alexande_beob.tblBeobInfospezies.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum AS Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobInfospezies.PROJET, alexande_beob.tblBeobInfospezies.DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId FROM (alexande_beob.tblBeobInfospezies INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE) LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobInfospezies.FNS_XGIS>0 AND alexande_beob.tblBeobInfospezies.FNS_YGIS>0 AND alexande_apflora.tblBeobZuordnung.TPopId Is Null AND alexande_beob.tblBeobInfospezies.NO_ISFS=' + apId + ' ORDER BY Datum DESC LIMIT 100';
        }
    }
    // Daten abfragen
    connection.query(
        url,
        function (err, data) {
            if (err) { throw err; }
            callback(data);
        }
    );
};