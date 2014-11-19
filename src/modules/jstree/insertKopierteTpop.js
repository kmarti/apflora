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
        url: 'api/v1/tpopInsertKopie/popId=' + erstelleIdAusDomAttributId(nodePopId) + '/tpopId=' + erstelleIdAusDomAttributId($(window.apf.tpopNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
    }).done(function (id) {
        var strukturtyp = "tpop",
            beschriftung = window.apf.tpopObjektKopiert.TPopFlurname;
        if (window.apf.tpopObjektKopiert.TPopNr) {
            beschriftung = window.apf.tpopObjektKopiert.TPopNr + ': ' + window.apf.tpopObjektKopiert.TPopFlurname;
        }
        if ($(aktiverNode).attr("id") === nodePopId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Die Teilpopulation wurde nicht erstellt");
    });
};