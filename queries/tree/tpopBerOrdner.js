/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var _               = require('underscore'),
    erstelleTPopBer = require('./tpopBer');

var returnFunction = function (tpopBerListe, tpop) {
    var tpopTpopberOrdner = {},
        tpopberVonTpop,
        tpopBerNode;

    // Liste der Berichte dieser tpop erstellen
    tpopberVonTpop = _.filter(tpopBerListe, function (tpopBer) {
        return tpopBer.TPopId === tpop.TPopId;
    });

    // tpopOrdnerTpopber aufbauen
    tpopTpopberOrdner.data = 'Teilpopulations-Berichte (' + tpopberVonTpop.length + ')';
    tpopTpopberOrdner.attr = {
        id: 'tpop_ordner_tpopber' + tpop.TPopId,
        typ: 'tpop_ordner_tpopber'
    };
    tpopTpopberOrdner.children = [];

    // tpopber aufbauen
    _.each(tpopberVonTpop, function (tpopber) {
        tpopBerNode = erstelleTPopBer(tpopber);
        tpopTpopberOrdner.children.push(tpopBerNode);
    });

    return tpopTpopberOrdner;
};

module.exports = returnFunction;