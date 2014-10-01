'use strict';

var _ = require('underscore')
    , erstelleTPopBer = require('./tpopBer');

var returnFunction = function(tpopBerListe, tpop) {
	var tpopNodeTpopberOrdner = {},
    	tpopNodeTpopberOrdnerChildren = [],
        tpopberVonTpop,
        tpopBerNode;

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

    // tpopber aufbauen
    _.each(tpopberVonTpop, function(tpopber) {
        tpopBerNode = erstelleTPopBer(tpopber);
        tpopNodeTpopberOrdnerChildren.push(tpopBerNode);
    });

    return tpopNodeTpopberOrdner;
};

module.exports = returnFunction;