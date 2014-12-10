/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde');

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
    // und an die DB schicken
    $.ajax({
        type: 'post',
        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontrNodeKopiert).attr("id")) + '/user=' + encodeURIComponent(sessionStorage.user)
    }).done(function (id) {
        var strukturtyp = "tpopfreiwkontr",
            beschriftung = window.apf.tpopfreiwkontrObjektKopiert.TPopKontrJahr.toString();
        if ($(aktiverNode).attr("id") === nodeTpopId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
    });
};