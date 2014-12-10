/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde');

module.exports = function (aktiverNode, parentNode, nodeApId) {
    $.ajax({
        type: 'post',
        url: 'api/v1/insert/apflora/tabelle=tblZiel/feld=ApArtId/wert=' + erstelleIdAusDomAttributId(nodeApId) + '/user=' + encodeURIComponent(sessionStorage.user)
    }).done(function (id) {
        var strukturtyp  = "apziel",
            beschriftung = "neues Ziel";

        // mitteilen, dass von ganz oben ein apziel erstellt wird und daher noch ein Zwischenordner erstellt werden muss
        localStorage.apzielVonOrdnerApziel = true;
        // zur Sicherheit den anderen Zeiger löschen
        delete localStorage.apzielVonApzieljahr;
        if ($(aktiverNode).attr("typ") === 'apOrdnerApziel') {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else if ($(aktiverNode).attr("typ") === 'apzieljahr') {
            insertNeuenNodeEineHierarchiestufeTiefer(parentNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Kein neues AP-Ziel erstellt");
    });
};