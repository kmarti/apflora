'use strict';

var _ = require('underscore');

var returnFunction = function(tpopFreiwkontrListe, tpop) {
	var tpopNodeFreiwkontrOrdner = {},
    	tpopNodeFreiwkontrOrdnerChildren = [],
        freiwkontrVonTpop;

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
    return tpopNodeFreiwkontrOrdner;
};

module.exports = returnFunction;