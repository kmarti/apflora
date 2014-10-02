'use strict';

var _ = require('underscore'),
    erstellePopBer = require('./popBer');

var returnFunction = function(popBerListe, pop) {
	var popNodePopberOrdner         = {},
    	popNodePopberOrdnerChildren = [],
        popberVonPop,
        popBerNode;

    // Liste der Berichte dieser pop erstellen
    popberVonPop = _.filter(popBerListe, function(popBer) {
        return popBer.PopId === pop.PopId;
    });

	// tpopOrdnerTpopber aufbauen
    popNodePopberOrdner.data = 'Populations-Berichte (' + popberVonPop.length + ')';
    popNodePopberOrdner.attr = {
        id: pop.PopId,
        typ: 'pop_ordner_popber'
    };
    popNodePopberOrdner.children = popNodePopberOrdnerChildren;

    // popber aufbauen
    _.each(popberVonPop, function(popber) {
        popBerNode = erstellePopBer(popber);
        popNodePopberOrdnerChildren.push(popBerNode);
    });

    return popNodePopberOrdner;
};

module.exports = returnFunction;