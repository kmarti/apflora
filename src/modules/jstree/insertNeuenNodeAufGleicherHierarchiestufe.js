// Baut einen neuen Knoten auf derselben Hierarchiestufe, von welcher der Befehl aufgerufen wurde

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

$.jstree = require('jquery.jstree');

var returnFunction = function (aktiver_node, parent_node, strukturtyp, ds_id, beschriftung) {
    var NeuerNode,
        initiiereFormularMitStrukturtyp = require('../initiiereFormularMitStrukturtyp'),
        erstelleUnterordnerVonTpop      = require('./erstelleUnterordnerVonTpop'),
        erstelleUnterordnerVonPop       = require('./erstelleUnterordnerVonPop');
    // id global verfügbar machen
    localStorage[strukturtyp + "_id"] = ds_id;
    // letzte globale Variable entfernen
    delete window.apf[strukturtyp];
    // neuen Node bauen
    NeuerNode = $.jstree._reference(parent_node).create_node(parent_node, "last", {
        "data": beschriftung,
        "attr": {
            "id": ds_id,
            "typ": strukturtyp
        }
    });
    // allfällige Unterordner anlegen
    if (strukturtyp === "pop") {
        erstelleUnterordnerVonPop(NeuerNode, ds_id);
    }
    if (strukturtyp === "tpop") {
        erstelleUnterordnerVonTpop(NeuerNode, ds_id);
    }
    if (strukturtyp === "apziel") {
        $.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
            "data": "0 Ziel-Berichte",
            "attr": {
                "id": ds_id,
                "typ": "zielber_ordner"
            }
        });
    }

    // Parent Node-Beschriftung: Anzahl anpassen
    if (strukturtyp === "apziel") {
        var grandparent_node = $.jstree._reference(parent_node)._get_parent(parent_node);
        // grandparent Node-Beschriftung: Anzahl anpassen
        window.apf.beschrifte_ordner_apziel(grandparent_node);
        // parent Node-Beschriftung: Anzahl anpassen
        // nur, wenn es nicht der Ordner ist, der "neue AP-Ziele" heisst
        if ($.jstree._reference(parent_node).get_text(parent_node) !== "neue AP-Ziele") {
            window.apf.beschrifte_ordner_apzieljahr(parent_node);
        }
    } else {
        // Normalfall
        window.apf["beschrifte_ordner_"+strukturtyp](parent_node);
    }
    
    // node selecten
    $.jstree._reference(aktiver_node).deselect_all();
    $.jstree._reference(NeuerNode).select_node(NeuerNode);
    // Formular initiieren
    initiiereFormularMitStrukturtyp(strukturtyp);
};

module.exports = returnFunction;