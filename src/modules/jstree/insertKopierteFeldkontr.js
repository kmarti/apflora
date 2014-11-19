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
        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontrNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
    }).done(function (id) {
        var strukturtyp = "tpopfeldkontr",
            beschriftung = window.apf.erstelleLabelFuerFeldkontrolle(window.apf.tpopfeldkontrObjektKopiert.TPopKontrJahr, window.apf.tpopfeldkontrObjektKopiert.TPopKontrTyp);
        if ($(aktiverNode).attr("id") === nodeTpopId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
    });
};