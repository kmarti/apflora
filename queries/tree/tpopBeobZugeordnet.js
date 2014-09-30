'use strict';

var _ = require('underscore');

var returnFunction = function(tpopBeobZugeordnetListe, tpop) {
	var tpopNodeTpopBeobZugeordnetOrdner = {},
    	tpopNodeTpopBeobZugeordnetOrdnerChildren = [],
        tpopbeobzugeordnetVonTpop;

    // Liste der zugeordneten Beobachtungen dieser tpop erstellen
    tpopbeobzugeordnetVonTpop = _.filter(tpopBeobZugeordnetListe, function(tpopBeobZugeordnet) {
        return tpopBeobZugeordnet.TPopId === tpop.TPopId;
    });

	// tpopOrdnerBeobZugeordnet aufbauen
    tpopNodeTpopBeobZugeordnetOrdner.data = 'Beobachtungen (' + tpopbeobzugeordnetVonTpop.length + ')';
    tpopNodeTpopBeobZugeordnetOrdner.attr = {
        id: 'tpop_ordner_beob_zugeordnet' + tpop.TPopId,
        typ: 'tpop_ordner_beob_zugeordnet'
    };
    tpopNodeTpopBeobZugeordnetOrdner.children = tpopNodeTpopBeobZugeordnetOrdnerChildren;
    return tpopNodeTpopBeobZugeordnetOrdner;
};

module.exports = returnFunction;