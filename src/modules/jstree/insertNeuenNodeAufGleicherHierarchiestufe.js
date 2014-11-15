// Baut einen neuen Knoten auf derselben Hierarchiestufe, von welcher der Befehl aufgerufen wurde

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

var returnFunction = function (aktiverNode, parentNode, strukturtyp, dsId, beschriftung) {
    var NeuerNode,
        grandparentNode,
        initiiereFormularMitStrukturtyp = require('../initiiereFormularMitStrukturtyp'),
        erstelleUnterordnerVonTpop      = require('./erstelleUnterordnerVonTpop'),
        erstelleUnterordnerVonPop       = require('./erstelleUnterordnerVonPop');
    // id global verfügbar machen
    localStorage[strukturtyp + "_id"] = dsId;
    // letzte globale Variable entfernen
    delete window.apf[strukturtyp];
    // neuen Node bauen
    NeuerNode = $.jstree._reference(parentNode).create_node(parentNode, "last", {
        "data": beschriftung,
        "attr": {
            "id": dsId,
            "typ": strukturtyp
        }
    });
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
    }

    // Parent Node-Beschriftung: Anzahl anpassen
    if (strukturtyp === "apziel") {
        grandparentNode = $.jstree._reference(parentNode)._get_parent(parentNode);
        // grandparent Node-Beschriftung: Anzahl anpassen
        window.apf.beschrifte_ordner_apziel(grandparentNode);
        // parent Node-Beschriftung: Anzahl anpassen
        // nur, wenn es nicht der Ordner ist, der "neue AP-Ziele" heisst
        if ($.jstree._reference(parentNode).get_text(parentNode) !== "neue AP-Ziele") {
            window.apf.beschrifte_ordner_apzieljahr(parentNode);
        }
    } else {
        // Normalfall
        window.apf["beschrifte_ordner_" + strukturtyp](parentNode);
    }

    // node selecten
    $.jstree._reference(aktiverNode).deselect_all();
    $.jstree._reference(NeuerNode).select_node(NeuerNode);
    // Formular initiieren
    initiiereFormularMitStrukturtyp(strukturtyp);
};

module.exports = returnFunction;