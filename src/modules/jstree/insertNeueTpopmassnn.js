/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde');

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
    $.ajax({
        type: 'post',
        url: 'api/v1/insert/apflora/tabelle=tblTPopMassn/feld=TPopId/wert=' + erstelleIdAusDomAttributId(nodeTpopId) + '/user=' + encodeURIComponent(sessionStorage.user)
    }).done(function (id) {
        var strukturtyp  = "tpopmassn",
            beschriftung = "neue Massnahme";
        if ($(aktiverNode).attr("id") === nodeTpopId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Keine neue Massnahme erstellt");
    });
};