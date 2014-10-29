/*jslint node: true, browser: true, nomen: true */
'use strict';


var _            = require('underscore'),
    erstelleTpop = require('./tpop');

var returnFunction = function (results, tpopListe, pop) {
    var popTpopOrdner = {},
        tpopVonPop;

    // Liste der tpop dieser pop erstellen
    tpopVonPop = _.filter(tpopListe, function (tpop) {
        return tpop.PopId === pop.PopId;
    });

    // tpopOrdnerTpop aufbauen
    popTpopOrdner.data = 'Teilpopulationen (' + tpopVonPop.length + ')';
    popTpopOrdner.attr = {
        id: pop.PopId,
        typ: 'pop_ordner_tpop'
    };
    popTpopOrdner.children = [];

    // tpop aufbauen
    _.each(tpopVonPop, function (tpop) {
        var tpopNode = erstelleTpop(results, tpop);
        popTpopOrdner.children.push(tpopNode);
    });

    return popTpopOrdner;
};

module.exports = returnFunction;