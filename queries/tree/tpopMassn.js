'use strict';

var _ = require('underscore');

var returnFunction = function(tpopMassnListe, tpop) {
	var tpopNodeMassnOrdner = {},
		tpopNodeMassnOrdnerChildren = [],
		massnVonTpop;

	// Liste der Massnahmen dieser tpop erstellen
	massnVonTpop = _.filter(tpopMassnListe, function(tpopMassn) {
        return tpopMassn.TPopId === tpop.TPopId;
    });

	// tpopOrdnerMassnahmen aufbauen
    tpopNodeMassnOrdner.data = 'Massnahmen (' + massnVonTpop.length + ')';
    tpopNodeMassnOrdner.attr = {
        id: 'tpop_ordner_massn' + tpop.TPopId,
        typ: 'tpop_ordner_massn'
    };
    tpopNodeMassnOrdner.children = tpopNodeMassnOrdnerChildren;
    return tpopNodeMassnOrdner;
};

module.exports = returnFunction;