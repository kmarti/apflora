/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde');

module.exports = function (aktiverNode, parentNode, nodePopId) {
    $.ajax({
        type: 'post',
        url: 'api/v1/insert/apflora/tabelle=tblTeilpopulation/feld=PopId/wert=' + erstelleIdAusDomAttributId(nodePopId) + '/user=' + sessionStorage.user
    }).done(function (id) {
        var strukturtyp = "tpop",
            beschriftung = "neue Teilpopulation";
        if ($(aktiverNode).attr("id") === nodePopId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Keine neue Teilpopulation erstellt");
    });
};