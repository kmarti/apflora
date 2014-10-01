'use strict';

var _ = require('underscore'),
    erstelleTPopFeldKontr = require('./tpopFeldkontr');

var returnFunction = function(tpopFeldkontrListe, tpop) {
	var tpopFeldkontrOrdner = {},
        feldkontrVonTpop,
        feldkontrNode;

    // Liste der Feldkontrollen dieser tpop erstellen
    feldkontrVonTpop = _.filter(tpopFeldkontrListe, function(tpopFeldkontr) {
        return tpopFeldkontr.TPopId === tpop.TPopId;
    });

	// tpopOrdnerFeldkontr aufbauen
    tpopFeldkontrOrdner.data = 'Feldkontrollen (' + feldkontrVonTpop.length + ')';
    tpopFeldkontrOrdner.attr = {
        id: 'tpop_ordner_feldkontr' + tpop.TPopId,
        typ: 'tpop_ordner_feldkontr'
    };
    tpopFeldkontrOrdner.children = [];

    // feldkontr aufbauen
    _.each(feldkontrVonTpop, function(feldkontr) {
        feldkontrNode = erstelleTPopFeldKontr(feldkontr);
        tpopFeldkontrOrdner.children.push(feldkontrNode);
    });

    return tpopFeldkontrOrdner;
};

module.exports = returnFunction;