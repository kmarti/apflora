/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde'),
    erstelleLabelFuerMassnahme                = require('../erstelleLabelFuerMassnahme');

module.exports = function (aktiverNode, parentNode, nodeTpopId) {
    $.ajax({
        type: 'post',
        url: 'api/v1/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassnNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
    }).done(function (id) {
        var strukturtyp  = "tpopmassn",
            beschriftung = erstelleLabelFuerMassnahme(window.apf.tpopmassnObjektKopiert.TPopMassnJahr, window.apf.tpopmassnObjektKopiert.TPopMassnBerErfolgsbeurteilungTxt);
        if ($(aktiverNode).attr("id") === nodeTpopId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Die Massnahme wurde nicht erstellt");
    });
};