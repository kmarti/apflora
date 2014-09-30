'use strict';

var returnFunction = function(popber) {
    var node  = {},
        nodeText;
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    if (popber.PopBerJahr && popber.EntwicklungTxt) {
        nodeText = popber.PopBerJahr + ": " + popber.EntwicklungTxt;
    } else if (popber.PopBerJahr) {
        nodeText = popber.PopBerJahr + ": (nicht beurteilt)";
    } else if (popber.EntwicklungTxt) {
        nodeText = "(kein Jahr): " + popber.EntwicklungTxt;
    } else {
        nodeText = "(kein Jahr): (nicht beurteilt)";
    }
    node.data = nodeText;
    node.attr = {
        id: popber.PopBerId,
        typ: 'popber'
    };
    return node;
};

module.exports = returnFunction;