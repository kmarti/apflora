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
        url: 'api/v1/insert/apflora/tabelle=tblPopMassnBer/feld=PopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + encodeURIComponent(sessionStorage.user)
    }).done(function (id) {
        var strukturtyp  = "popmassnber",
            beschriftung = "neuer Massnahmen-Bericht";
        if ($(aktiverNode).attr("id") === nodePopId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
    });
};