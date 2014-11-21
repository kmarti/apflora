// Baut einen neuen Knoten auf der näcshttieferen Hierarchiestufe, als der Befehl aufgerufen wurde
// parentNode wird nur von Strukturtyp apziel benutzt

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                               = require('jquery'),
    initiiereFormularMitStrukturtyp = require('../initiiereFormularMitStrukturtyp'),
    erstelleUnterordnerVonTpop      = require('./erstelleUnterordnerVonTpop'),
    erstelleUnterordnerVonPop       = require('./erstelleUnterordnerVonPop'),
    erstelleIdAusDomAttributId      = require('../erstelleIdAusDomAttributId'),
    capitaliseFirstLetter           = require('../../lib/capitaliseFirstLetter');

module.exports = function (aktiverNode, parentNode, strukturtyp, dsId, beschriftung) {
    var neuerNode,
        neueApzieleNode;

    // Beschriftung muss String sein
    if (beschriftung && typeof beschriftung !== 'string') {
        beschriftung = beschriftung.toString();
    }

    console.log('insertNeuenNodeEineHierarchiestufeTiefer: node-beschriftung = ', beschriftung);

    // id global verfügbar machen
    localStorage[strukturtyp + "Id"] = dsId;
    // letzte globale Variable entfernen
    delete window.apf[strukturtyp];
    if (strukturtyp === "apziel" && localStorage.apzielVonOrdnerApziel) {
        // localStorage.apzielVonOrdnerApziel sagt: apziel wird vom ordner_apziel aus angelegt > temporären Unterordner anlegen
        neueApzieleNode = $.jstree._reference(aktiverNode).create_node(aktiverNode, "last", {
            "data": "neue AP-Ziele",
            "attr": {
                "id":  erstelleIdAusDomAttributId($(aktiverNode).attr("id")),
                "typ": "apzieljahr"
            }
        });
        // darunter neuen Node bauen
        neuerNode = $.jstree._reference(neueApzieleNode).create_node(neueApzieleNode, "last", {
            "data": beschriftung,
            "attr": {
                "id":  dsId,
                "typ": "apziel"
            }
        });
        delete localStorage.apzielVonOrdnerApziel;
    } else {
        // Normalfall
        // neuen Node bauen
        neuerNode = $.jstree._reference(aktiverNode).create_node(aktiverNode, "last", {
            "data": beschriftung,
            "attr": {
                "id":  dsId,
                "typ": strukturtyp
            }
        });
    }
    // allfällige Unterordner anlegen
    if (strukturtyp === "pop") {
        erstelleUnterordnerVonPop(neuerNode, dsId);
    }
    if (strukturtyp === "tpop") {
        erstelleUnterordnerVonTpop(neuerNode, dsId);
    }
    if (strukturtyp === "apziel") {
        $.jstree._reference(neuerNode).create_node(neuerNode, "last", {
            "data": "0 Ziel-Berichte",
            "attr": {
                "id":  dsId,
                "typ": "zielberOrdner"
            }
        });
        // im create_node-Event von jstree wird Jahr eingefügt und gespeichert
    }
    // Node-Beschriftung: Anzahl anpassen
    if (strukturtyp === "apziel" && localStorage.apzielVonApzieljahr) {
        // hier ist ein Ordner zwischengeschaltet
        // Parent Node-Beschriftung: Anzahl anpassen, wenns nicht der neue Ordner ist
        if ($.jstree._reference(parentNode).get_text(parentNode) !== "neue AP-Ziele") {
            window.apf.beschrifteOrdner(parentNode);
        }
        // aktiver Node-Beschriftung: Anzahl anpassen
        window.apf.beschrifteOrdner(aktiverNode);
        delete localStorage.apzielVonApzieljahr;
    } else if (strukturtyp !== "jberUebersicht") {
        window.apf.beschrifteOrdner(aktiverNode);
    }
    // node selecten
    $.jstree._reference(aktiverNode).deselect_all();
    $.jstree._reference(neuerNode).select_node(neuerNode);
    // Formular initiieren
    initiiereFormularMitStrukturtyp(strukturtyp);
};