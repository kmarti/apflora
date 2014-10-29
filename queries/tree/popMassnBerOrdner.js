/*jslint node: true, browser: true, nomen: true */
'use strict';


var _ = require('underscore'),
    erstellePopMassnBer = require('./popMassnBer');

var returnFunction = function (popMassnBerListe, pop) {
    var popMassnberOrdner = {},
        massnberVonPop,
        popMassnberNode;

    // Liste der MassnBer dieser pop erstellen
    massnberVonPop = _.filter(popMassnBerListe, function (popMassnBer) {
        return popMassnBer.PopId === pop.PopId;
    });

    // tpopOrdnerTpopber aufbauen
    popMassnberOrdner.data = 'Massnahmen-Berichte (' + massnberVonPop.length + ')';
    popMassnberOrdner.attr = {
        id: pop.PopId,
        typ: 'pop_ordner_massnber'
    };
    popMassnberOrdner.children = [];

    // massnber aufbauen
    _.each(massnberVonPop, function (massnber) {
        popMassnberNode = erstellePopMassnBer(massnber);
        popMassnberOrdner.children.push(popMassnberNode);
    });

    return popMassnberOrdner;
};

module.exports = returnFunction;