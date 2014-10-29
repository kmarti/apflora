/*jslint node: true, browser: true */
'use strict';


var _                    = require('underscore'),
    erstelleTPopMassnBer = require('./tpopMassnBer');

var returnFunction = function (tpopMassnBerListe, tpop) {
    var tpopMassnBerOrdner = {},
        massnberVonTpop,
        massnberNode;

    // Liste der Massnahmen-Berichte dieser tpop erstellen
    massnberVonTpop = _.filter(tpopMassnBerListe, function (tpopMassnBer) {
        return tpopMassnBer.TPopId === tpop.TPopId;
    });

    // tpopOrdnerMassnahmenBer aufbauen
    tpopMassnBerOrdner.data = 'Massnahmen-Berichte (' + massnberVonTpop.length + ')';
    tpopMassnBerOrdner.attr = {
        id: 'tpop_ordner_massnber' + tpop.TPopId,
        typ: 'tpop_ordner_massnber'
    };
    tpopMassnBerOrdner.children = [];

    // massnber aufbauen
    _.each(massnberVonTpop, function (massnber) {
        massnberNode = erstelleTPopMassnBer(massnber);
        tpopMassnBerOrdner.children.push(massnberNode);
    });


    return tpopMassnBerOrdner;
};

module.exports = returnFunction;