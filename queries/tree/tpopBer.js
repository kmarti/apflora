'use strict';

var _ = require('underscore');

var returnFunction = function(tpopBerListe, tpop) {
	var tpopNodeTpopberOrdner = {},
    	tpopNodeTpopberOrdnerChildren = [],
        tpopberVonTpop;

    // Liste der Berichte dieser tpop erstellen
    tpopberVonTpop = _.filter(tpopBerListe, function(tpopBer) {
        return tpopBer.TPopId === tpop.TPopId;
    });

	// tpopOrdnerTpopber aufbauen
    tpopNodeTpopberOrdner.data = 'Teilpopulations-Berichte (' + tpopberVonTpop.length + ')';
    tpopNodeTpopberOrdner.attr = {
        id: 'tpop_ordner_tpopber' + tpop.TPopId,
        typ: 'tpop_ordner_tpopber'
    };
    tpopNodeTpopberOrdner.children = tpopNodeTpopberOrdnerChildren;
    return tpopNodeTpopberOrdner;
};

module.exports = returnFunction;