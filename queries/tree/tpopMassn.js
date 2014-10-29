/*jslint node: true, browser: true */
'use strict';


var returnFunction = function (tpopMassn) {
    var node  = {},
        nodeText1,
        nodeText2;

    if (tpopMassn) {
        // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
        if (tpopMassn.TPopMassnJahr) {
            nodeText1 = tpopMassn.TPopMassnJahr;
        } else {
            nodeText1 = "(kein Jahr)";
        }

        if (tpopMassn.MassnTypTxt) {
            nodeText2 = tpopMassn.MassnTypTxt;
        } else {
            nodeText2 = "(kein Typ)";
        }

        // node aufbauen
        node.data = nodeText1 + ': ' + nodeText2;
        node.attr = {
            id: tpopMassn.TPopMassnId,
            typ: 'tpopmassn'
        };
    }

    return node;
};

module.exports = returnFunction;