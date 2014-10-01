'use strict';

var returnFunction = function(freiwkontr) {
    if (freiwkontr) {
        var node  = {},
            nodeText;

        // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
        if (freiwkontr.TPopKontrJahr > 0) {
            nodeText = freiwkontr.TPopKontrJahr;
        } else {
            nodeText = "(kein Jahr)";
        }

        // node aufbauen
        node.data = nodeText;
        node.attr = {
            id: freiwkontr.TPopKontrId,
            typ: 'tpopfreiwkontr'
        };

        return node;
    } else {
        return {};
    }
};

module.exports = returnFunction;