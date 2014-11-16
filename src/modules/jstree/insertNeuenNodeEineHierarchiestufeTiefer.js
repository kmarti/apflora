// Baut einen neuen Knoten auf der näcshttieferen Hierarchiestufe, als der Befehl aufgerufen wurde
// parentNode wird nur von Strukturtyp apziel benutzt

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');
$.jstree = require('jquery.jstree');

var returnFunction = function (aktiverNode, parentNode, strukturtyp, dsId, beschriftung) {
    var NeuerNode,
        neueApzieleNode,
        initiiereFormularMitStrukturtyp = require('../initiiereFormularMitStrukturtyp'),
        erstelleUnterordnerVonTpop      = require('./erstelleUnterordnerVonTpop'),
        erstelleUnterordnerVonPop       = require('./erstelleUnterordnerVonPop'),
        erstelleIdAusDomAttributId      = require('../erstelleIdAusDomAttributId');

    // id global verfügbar machen
    localStorage[strukturtyp + "Id"] = dsId;
    // letzte globale Variable entfernen
    delete window.apf[strukturtyp];
    if (strukturtyp === "apziel" && localStorage.apziel_von_ordner_apziel) {
        // localStorage.apziel_von_ordner_apziel sagt: apziel wird vom ordner_apziel aus angelegt > temporären Unterordner anlegen
        neueApzieleNode = $.jstree._reference(aktiverNode).create_node(aktiverNode, "last", {
            "data": "neue AP-Ziele",
            "attr": {
                "id": erstelleIdAusDomAttributId($(aktiverNode).attr("id")),
                "typ": "apzieljahr"
            }
        });
        // darunter neuen Node bauen
        NeuerNode = $.jstree._reference(neueApzieleNode).create_node(neueApzieleNode, "last", {
            "data": beschriftung,
            "attr": {
                "id": dsId,
                "typ": strukturtyp
            }
        });
        delete localStorage.apziel_von_ordner_apziel;
    } else {
        // Normalfall
        // neuen Node bauen
        NeuerNode = $.jstree._reference(aktiverNode).create_node(aktiverNode, "last", {
            "data": beschriftung,
            "attr": {
                "id": dsId,
                "typ": strukturtyp
            }
        });
    }
    // allfällige Unterordner anlegen
    if (strukturtyp === "pop") {
        erstelleUnterordnerVonPop(NeuerNode, dsId);
    }
    if (strukturtyp === "tpop") {
        erstelleUnterordnerVonTpop(NeuerNode, dsId);
    }
    if (strukturtyp === "apziel") {
        $.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
            "data": "0 Ziel-Berichte",
            "attr": {
                "id": dsId,
                "typ": "zielber_ordner"
            }
        });
        // im create_node-Event von jstree wird Jahr eingefügt und gespeichert
    }
    // Node-Beschriftung: Anzahl anpassen
    if (strukturtyp === "apziel" && localStorage.apziel_von_apzieljahr) {
        // hier ist ein Ordner zwischengeschaltet
        // Parent Node-Beschriftung: Anzahl anpassen, wenns nicht der neue Ordner ist
        if ($.jstree._reference(parentNode).get_text(parentNode) !== "neue AP-Ziele") {
            window.apf.beschrifte_ordner_apziel(parentNode);
        }
        // aktiver Node-Beschriftung: Anzahl anpassen
        window.apf.beschrifte_ordner_apzieljahr(aktiverNode);
        delete localStorage.apziel_von_apzieljahr;
    } else if (strukturtyp !== "jber_uebersicht") {
        window.apf["beschrifte_ordner_" + strukturtyp](aktiverNode);
    }
    // node selecten
    $.jstree._reference(aktiverNode).deselect_all();
    $.jstree._reference(NeuerNode).select_node(NeuerNode);
    // Formular initiieren
    initiiereFormularMitStrukturtyp(strukturtyp);
};

module.exports = returnFunction;