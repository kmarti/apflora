'use strict';

var _ = require('underscore')
    , erstelleTpop = require('./tpop');

var returnFunction = function(results, tpopListe, pop) {
	var popNodeTpopOrdner = {},
    	popNodeTpopOrdnerChildren = [],
        tpopVonPop;

    // Liste der tpop dieser pop erstellen
    tpopVonPop = _.filter(tpopListe, function(tpop) {
        return tpop.PopId === pop.PopId;
    });

	// tpopOrdnerTpop aufbauen
    popNodeTpopOrdner.data = 'Teilpopulationen (' + tpopVonPop.length + ')';
    popNodeTpopOrdner.attr = {
        id: pop.PopId,
        typ: 'pop_ordner_tpop'
    };
    popNodeTpopOrdner.children = popNodeTpopOrdnerChildren;

    // tpop aufbauen
    _.each(tpopVonPop, function(tpop) {
        var tpopNode = erstelleTpop(results, tpop);
        popNodeTpopOrdnerChildren.push(tpopNode);
    });

    return popNodeTpopOrdner;
};

module.exports = returnFunction;