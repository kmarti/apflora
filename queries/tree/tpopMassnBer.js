/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var returnFunction = function (tpopMassnber) {
    var node  = {},
        nodeText1,
        nodeText2;

    if (tpopMassnber) {
        // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
        if (tpopMassnber.TPopMassnBerJahr) {
            nodeText1 = tpopMassnber.TPopMassnBerJahr;
        } else {
            nodeText1 = "(kein Jahr)";
        }

        if (tpopMassnber.BeurteilTxt) {
            nodeText2 = tpopMassnber.BeurteilTxt;
        } else {
            nodeText2 = "(keine Beurteilung)";
        }

        // node aufbauen
        node.data = nodeText1 + ': ' + nodeText2;
        node.attr = {
            id: tpopMassnber.TPopMassnBerId,
            typ: 'tpopmassnber'
        };
    }

    return node;
};

module.exports = returnFunction;