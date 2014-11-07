// erstellt alle Unterordner des Ordners vom Typ tpop
// erwartet den node des tpop-ordners

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');
$.jstree = require('jquery.jstree');

var returnFunction = function (tpopNode, tpopId) {
    $.jstree._reference(tpopNode).create_node(tpopNode, "last", {
        "data": "Massnahmen",
        "attr": {
            "id": tpopId,
            "typ": "tpop_ordner_massn"
        }
    });
    $.jstree._reference(tpopNode).create_node(tpopNode, "last", {
        "data": "Massnahmen-Berichte",
        "attr": {
            "id": tpopId,
            "typ": "tpop_ordner_massnber"
        }
    });
    $.jstree._reference(tpopNode).create_node(tpopNode, "last", {
        "data": "Feldkontrollen",
        "attr": {
            "id": tpopId,
            "typ": "tpop_ordner_feldkontr"
        }
    });
    $.jstree._reference(tpopNode).create_node(tpopNode, "last", {
        "data": "Freiwilligen-Kontrollen",
        "attr": {
            "id": tpopId,
            "typ": "tpop_ordner_freiwkontr"
        }
    });
    $.jstree._reference(tpopNode).create_node(tpopNode, "last", {
        "data": "Teilpopulations-Berichte",
        "attr": {
            "id": tpopId,
            "typ": "tpop_ordner_tpopber"
        }
    });
    $.jstree._reference(tpopNode).create_node(tpopNode, "last", {
        "data": "Beobachtungen",
        "attr": {
            "id": tpopId,
            "typ": "tpop_ordner_beob_zugeordnet"
        }
    });
};

module.exports = returnFunction;