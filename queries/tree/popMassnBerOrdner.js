'use strict';

var _ = require('underscore'),
    erstellePopMassnBer = require('./popMassnBer');

var returnFunction = function(popMassnBerListe, pop) {
	var popNodeMassnberOrdner = {},
    	popNodeMassnberOrdnerChildren = [],
        massnberVonPop,
        popNodeMassnberNode;

    // Liste der MassnBer dieser pop erstellen
    massnberVonPop = _.filter(popMassnBerListe, function(popMassnBer) {
        return popMassnBer.PopId === pop.PopId;
    });

	// tpopOrdnerTpopber aufbauen
    popNodeMassnberOrdner.data = 'Massnahmen-Berichte (' + massnberVonPop.length + ')';
    popNodeMassnberOrdner.attr = {
        id: pop.PopId,
        typ: 'pop_ordner_massnber'
    };
    popNodeMassnberOrdner.children = popNodeMassnberOrdnerChildren;

    // massnber aufbauen
    _.each(massnberVonPop, function(massnber) {
        popNodeMassnberNode = erstellePopMassnBer(massnber);
        popNodeMassnberOrdnerChildren.push(popNodeMassnberNode);
    });

    return popNodeMassnberOrdner;
};

module.exports = returnFunction;