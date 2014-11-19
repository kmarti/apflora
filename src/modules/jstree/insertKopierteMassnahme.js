/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde');

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
    var insertTPopMassnKopie = $.ajax({
        type: 'post',
        url: 'api/v1/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassnNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
    });
    insertTPopMassnKopie.done(function (id) {
        var strukturtyp  = "tpopmassn",
            beschriftung = window.apf.erstelleLabelFuerMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
        if ($(aktiverNode).attr("id") === nodeTpopId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    });
    insertTPopMassnKopie.fail(function () {
        melde("Fehler: Die Massnahme wurde nicht erstellt");
    });
};