// wird offenbar momentan nicht verwendet

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $     = require('jquery'),
    _     = require('underscore'),
    melde = require('./melde');

var returnFunction = function (aktiver_node, parent_node) {
    var data = {},
        insertNeuenNodeAufGleicherHierarchiestufe = require('./jstree/insertNeuenNodeAufGleicherHierarchiestufe');
    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!window.apf.prüfeSchreibvoraussetzungen()) {
        return;
    }
    // drop kennt den parent nicht
    if (!parent_node) {
        parent_node = $.jstree._reference(aktiver_node)._get_parent(aktiver_node);
    }
    // User und neue PopId mitgeben
    data.MutWer = sessionStorage.User;
    data.PopId = window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id"));
    // die alten id's entfernen
    delete window.apf.tpop_objekt_kopiert.PopId;
    delete window.apf.tpop_objekt_kopiert.TPopId;
    // das wird gleich neu gesetzt, alte Werte verwerfen
    delete window.apf.tpop_objekt_kopiert.MutWann;
    delete window.apf.tpop_objekt_kopiert.MutWer;
    // alle verbliebenen Felder an die url hängen
    _.each(window.apf.tpop_objekt_kopiert, function (value, key) {
        // Nullwerte ausschliessen
        if (value !== null) {
            data[key] = value;
        }
    });
    // und an die DB schicken
    $.ajax({
        type: 'post',
        url: 'api/v1/tpopInsertKopie/popId=' + data.PopId + '/tpopId=' + window.apf.erstelleIdAusDomAttributId($(window.apf.tpop_node_kopiert).attr("id")) + '/user=' + data.MutWer
    }).done(function (tpop_id) {
        var strukturtyp = "tpop",
            beschriftung = window.apf.tpop_objekt_kopiert.TPopNr + " " + window.apf.tpop_objekt_kopiert.TPopFlurname;
        insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, tpop_id, beschriftung);
    }).fail(function () {
        melde("Fehler: Die Teilpopulation wurde nicht erstellt");
    });
};

module.exports = returnFunction;