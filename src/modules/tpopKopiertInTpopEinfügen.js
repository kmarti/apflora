// wird offenbar momentan nicht verwendet

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    _                                         = require('underscore'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./jstree/insertNeuenNodeAufGleicherHierarchiestufe'),
    erstelleIdAusDomAttributId                = require('./erstelleIdAusDomAttributId'),
    melde                                     = require('./melde');

module.exports = function (aktiverNode, parentNode) {
    var data = {};

    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!window.apf.pruefeSchreibvoraussetzungen()) {
        return;
    }
    // drop kennt den parent nicht
    if (!parentNode) {
        parentNode = $.jstree._reference(aktiverNode)._get_parent(aktiverNode);
    }
    // User und neue PopId mitgeben
    data.MutWer = sessionStorage.user;
    data.PopId  = erstelleIdAusDomAttributId($(parentNode).attr("id"));
    // die alten id's entfernen
    delete window.apf.tpopObjektKopiert.PopId;
    delete window.apf.tpopObjektKopiert.TPopId;
    // das wird gleich neu gesetzt, alte Werte verwerfen
    delete window.apf.tpopObjektKopiert.MutWann;
    delete window.apf.tpopObjektKopiert.MutWer;
    // alle verbliebenen Felder an die url hängen
    _.each(window.apf.tpopObjektKopiert, function (value, key) {
        // Nullwerte ausschliessen
        if (value !== null) {
            data[key] = value;
        }
    });
    // und an die DB schicken
    $.ajax({
        type: 'post',
        url: 'api/v1/tpopInsertKopie/popId=' + data.PopId + '/tpopId=' + erstelleIdAusDomAttributId($(window.apf.tpop_node_kopiert).attr("id")) + '/user=' + data.MutWer
    }).done(function (tpopId) {
        var strukturtyp  = "tpop",
            beschriftung = window.apf.tpopObjektKopiert.TPopNr + " " + window.apf.tpopObjektKopiert.TPopFlurname;

        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, tpopId, beschriftung);
    }).fail(function () {
        melde("Fehler: Die Teilpopulation wurde nicht erstellt");
    });
};