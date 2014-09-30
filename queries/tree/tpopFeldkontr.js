'use strict';

var _ = require('underscore');

var returnFunction = function(tpopFeldkontrListe, tpop) {
	var tpopNodeFeldkontrOrdner = {},
    	tpopNodeFeldkontrOrdnerChildren = [],
        feldkontrVonTpop;

    // Liste der Feldkontrollen dieser tpop erstellen
    feldkontrVonTpop = _.filter(tpopFeldkontrListe, function(tpopFeldkontr) {
        return tpopFeldkontr.TPopId === tpop.TPopId;
    });

	// tpopOrdnerFeldkontr aufbauen
    tpopNodeFeldkontrOrdner.data = 'Feldkontrollen (' + feldkontrVonTpop.length + ')';
    tpopNodeFeldkontrOrdner.attr = {
        id: 'tpop_ordner_feldkontr' + tpop.TPopId,
        typ: 'tpop_ordner_feldkontr'
    };
    tpopNodeFeldkontrOrdner.children = tpopNodeFeldkontrOrdnerChildren;
    return tpopNodeFeldkontrOrdner;
};

module.exports = returnFunction;