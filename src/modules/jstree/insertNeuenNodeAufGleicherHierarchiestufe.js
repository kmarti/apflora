// Baut einen neuen Knoten auf derselben Hierarchiestufe, von welcher der Befehl aufgerufen wurde

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                               = require('jquery'),
    initiiereFormularMitStrukturtyp = require('../initiiereFormularMitStrukturtyp'),
    erstelleUnterordnerVonTpop      = require('./erstelleUnterordnerVonTpop'),
    erstelleUnterordnerVonPop       = require('./erstelleUnterordnerVonPop'),
    capitaliseFirstLetter           = require('../../lib/capitaliseFirstLetter');

module.exports = function (aktiverNode, parentNode, strukturtyp, dsId, beschriftung) {
    var neuerNode,
        grandparentNode;

    // Beschriftung muss String sein
    if (beschriftung && typeof beschriftung !== 'String') {
        beschriftung = beschriftung.toString();
    }

    // id global verfügbar machen
    localStorage[strukturtyp + "Id"] = dsId;
    // letzte globale Variable entfernen
    delete window.apf[strukturtyp];
    // neuen Node bauen
    neuerNode = $.jstree._reference(parentNode).create_node(parentNode, "last", {
        "data": beschriftung,
        "attr": {
            "id": dsId,
            "typ": strukturtyp
        }
    });
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
                "id": dsId,
                "typ": "zielberOrdner"
            }
        });
    }

    // Parent Node-Beschriftung: Anzahl anpassen
    if (strukturtyp === "apziel") {
        grandparentNode = $.jstree._reference(parentNode)._get_parent(parentNode);
        // grandparent Node-Beschriftung: Anzahl anpassen
        window.apf.beschrifteOrdnerApziel(grandparentNode);
        // parent Node-Beschriftung: Anzahl anpassen
        // nur, wenn es nicht der Ordner ist, der "neue AP-Ziele" heisst
        if ($.jstree._reference(parentNode).get_text(parentNode) !== "neue AP-Ziele") {
            window.apf.beschrifteOrdnerApzieljahr(parentNode);
        }
    } else {
        // Normalfall
        window.apf["beschrifteOrdner" + capitaliseFirstLetter(strukturtyp)](parentNode);
    }

    // node selecten
    $.jstree._reference(aktiverNode).deselect_all();
    $.jstree._reference(neuerNode).select_node(neuerNode);
    // Formular initiieren
    initiiereFormularMitStrukturtyp(strukturtyp);
};