/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                        = require('jquery'),
    erstelleIdAusDomAttributId               = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    melde                                    = require('../melde');

module.exports = function (aktiverNode, parentNode, ApArtId) {
    $.ajax({
        type: 'post',
        url: 'api/v1/insert/apflora/tabelle=tblZiel/feld=ApArtId/wert=' + erstelleIdAusDomAttributId(ApArtId) + '/user=' + sessionStorage.user
    }).done(function (id) {
        var strukturtyp  = "apziel",
            beschriftung = "neues Ziel";
        // mitteilen, dass von ganz oben ein apziel erstellt wird und daher noch ein Zwischenordner erstellt werden muss
        localStorage.apzielVonOrdnerApziel = true;
        // zur Sicherheit den anderen Zeiger löschen
        delete localStorage.apzielVonApzieljahr;
        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
    }).fail(function () {
        melde("Fehler: Kein neues AP-Ziel erstellt");
    });
};