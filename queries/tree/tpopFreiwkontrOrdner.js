'use strict';

var _                      = require('underscore'),
    erstelleTPopFreiwKontr = require('./tpopFreiwkontr');

var returnFunction = function (tpopFreiwkontrListe, tpop) {
    var tpopFreiwkontrOrdner = {},
        freiwkontrVonTpop,
        freiwkontrNode;

    // Liste der Freiwkontrollen dieser tpop erstellen
    freiwkontrVonTpop = _.filter(tpopFreiwkontrListe, function (tpopFreiwkontr) {
        return tpopFreiwkontr.TPopId === tpop.TPopId;
    });

    // tpopOrdnerFreiwkontr aufbauen
    tpopFreiwkontrOrdner.data = 'Freiwilligen-Kontrollen (' + freiwkontrVonTpop.length + ')';
    tpopFreiwkontrOrdner.attr = {
        id: 'tpop_ordner_freiwkontr' + tpop.TPopId,
        typ: 'tpop_ordner_freiwkontr'
    };
    tpopFreiwkontrOrdner.children = [];

    // freiwkontr aufbauen
    _.each(freiwkontrVonTpop, function (freiwkontr) {
        freiwkontrNode = erstelleTPopFreiwKontr(freiwkontr);
        tpopFreiwkontrOrdner.children.push(freiwkontrNode);
    });

    return tpopFreiwkontrOrdner;
};

module.exports = returnFunction;