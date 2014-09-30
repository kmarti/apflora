'use strict';

var _ = require('underscore');

var returnFunction = function(tpopMassnBerListe, tpop) {
	var tpopNodeMassnBerOrdner = {},
    	tpopNodeMassnBerOrdnerChildren = [],
        massnberVonTpop;

    // Liste der Massnahmen-Berichte dieser tpop erstellen
	massnberVonTpop = _.filter(tpopMassnBerListe, function(tpopMassnBer) {
        return tpopMassnBer.TPopId === tpop.TPopId;
    });

	// tpopOrdnerMassnahmenBer aufbauen
    tpopNodeMassnBerOrdner.data = 'Massnahmen-Berichte (' + massnberVonTpop.length + ')';
    tpopNodeMassnBerOrdner.attr = {
        id: 'tpop_ordner_massnber' + tpop.TPopId,
        typ: 'tpop_ordner_massnber'
    };
    tpopNodeMassnBerOrdner.children = tpopNodeMassnBerOrdnerChildren;
    return tpopNodeMassnBerOrdner;
};

module.exports = returnFunction;