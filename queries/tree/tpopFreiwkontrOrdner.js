'use strict';

var _ = require('underscore'),
    erstelleTPopFreiwKontr = require('./tpopFreiwkontr');

var returnFunction = function(tpopFreiwkontrListe, tpop) {
	var tpopNodeFreiwkontrOrdner = {},
    	tpopNodeFreiwkontrOrdnerChildren = [],
        freiwkontrVonTpop,
        freiwkontrNode;

    // Liste der Freiwkontrollen dieser tpop erstellen
    freiwkontrVonTpop = _.filter(tpopFreiwkontrListe, function(tpopFreiwkontr) {
        return tpopFreiwkontr.TPopId === tpop.TPopId;
    });

	// tpopOrdnerFreiwkontr aufbauen
    tpopNodeFreiwkontrOrdner.data = 'Freiwilligen-Kontrollen (' + freiwkontrVonTpop.length + ')';
    tpopNodeFreiwkontrOrdner.attr = {
        id: 'tpop_ordner_freiwkontr' + tpop.TPopId,
        typ: 'tpop_ordner_freiwkontr'
    };
    tpopNodeFreiwkontrOrdner.children = tpopNodeFreiwkontrOrdnerChildren;

    // freiwkontr aufbauen
    _.each(freiwkontrVonTpop, function(freiwkontr) {
        freiwkontrNode = erstelleTPopFreiwKontr(freiwkontr);
        tpopNodeFreiwkontrOrdnerChildren.push(freiwkontrNode);
    });

    return tpopNodeFreiwkontrOrdner;
};

module.exports = returnFunction;