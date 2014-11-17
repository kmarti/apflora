// erstellt alle Unterordner des Ordners vom Typ pop
// erwartet den node des pop-ordners

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (popNode, popId) {
    $.jstree._reference(popNode).create_node(popNode, "last", {
        "data": "Teilpopulationen",
        "attr": {
            "id": popId,
            "typ": "popOrdnerTpop"
        }
    });
    $.jstree._reference(popNode).create_node(popNode, "last", {
        "data": "Populations-Berichte",
        "attr": {
            "id": popId,
            "typ": "pop_ordner_popber"
        }
    });
    $.jstree._reference(popNode).create_node(popNode, "last", {
        "data": "Massnahmen-Berichte",
        "attr": {
            "id": popId,
            "typ": "pop_ordner_massnber"
        }
    });
};