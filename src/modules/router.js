'use strict';

var Backbone                = require('backbone'),
    initiiereIndex          = require('./initiiereIndex'),
    initiiereAp             = require('./initiiereAp'),
    initiiereAssozart       = require('./initiiereAssozart'),
    initiiereIdealbiotop    = require('./initiiereIdealbiotop'),
    initiiereBer            = require('./initiiereBer'),
    initiiereJber           = require('./initiiereJber'),
    initiiereJberUebersicht = require('./initiiereJberUebersicht'),
    initiiereErfkrit        = require('./initiiereErfkrit'),
    initiiereApziel         = require('./initiiereApziel'),
    initiiereZielber        = require('./initiiereZielber'),
    initiierePop            = require('./initiierePop'),
    initiierePopMassnBer    = require('./initiierePopMassnBer'),
    initiierePopBer         = require('./initiierePopBer'),
    initiiereTPop           = require('./initiiereTPop'),
    initiiereTPopBer        = require('./initiiereTPopBer'),
    initiiereTPopFeldkontr  = require('./initiiereTPopFeldkontr');

var returnFunction = function () {
    var router = new Backbone.Router.extend({
        routes: {
            "":                                                        "home",
            "ap=:apId":                                                "ap",
            "ap=:apId/assozart=:assozId":                              "assozart",
            "ap=:apId/idealbiotop":                                    "idealbiotop",
            "ap=:apId/beobNichtZuzuordnen=:beobId":                    "beobNichtZuzuordnen",
            "ap=:apId/beobNichtBeurteilt=:beobId":                     "beobNichtBeurteilt",
            "ap=:apId/bericht=:berId":                                 "bericht",
            "ap=:apId/apBericht=:apBerId":                             "apBericht",
            "ap=:apId/apBericht=:apBerId/uebersicht=:uebId":           "apBerÜbersicht",
            "ap=:apId/erfolgskriterium=:erfkritId":                    "erfolgskriterium",
            "ap=:apId/apZiel=:apZielId":                               "apZiel",
            "ap=:apId/apZiel=:apZielId/zielBericht:zielberId":         "zielBericht",
            "ap=:apId/pop=:popId":                                     "pop",
            "ap=:apId/pop=:popId/massnber:massnberId":                 "popMassnBer",
            "ap=:apId/pop=:popId/popber:popberId":                     "popBer",
            "ap=:apId/pop=:popId/tpop:tpopId":                         "tpop",
            "ap=:apId/pop=:popId/tpop:tpopId/beobZugeordnet:beobId":   "beobZugeordnet",
            "ap=:apId/pop=:popId/tpop:tpopId/tpopBer:tpopBerId":       "tpopBer",
            "ap=:apId/pop=:popId/tpop:tpopId/freiwKontr:feldKontrId":  "freiwKontr",
            "ap=:apId/pop=:popId/tpop:tpopId/feldKontr:feldKontrId":   "feldKontr",
            "ap=:apId/pop=:popId/tpop:tpopId/massnBer:massnBerId":     "massnBer",
            "ap=:apId/pop=:popId/tpop:tpopId/massn:massnId":           "massn",
            "exportieren":                                             "exportieren"
        },
        home: function () {
            initiiereIndex();
        },
        ap: function (apId) {
            initiiereAp(apId);
        },
        assozart: function (apId, assozId) {
            initiiereAssozart(apId, assozId);
        },
        idealbiotop: function (apId) {
            initiiereIdealbiotop(apId);
        },
        beobNichtZuzuordnen: function (apId, beobId) {
        },
        beobNichtBeurteilt: function (apId, beobId) {
        },
        bericht: function (apId, berId) {
            initiiereBer(apId, berId);
        },
        apBericht: function (apId, apBerId) {
            initiiereJber(apId, apBerId);
        },
        apBerÜbersicht: function (apId, uebId) {
            initiiereJberUebersicht(apId, uebId);
        },
        erfolgskriterium: function (apId, erfkritId) {
            initiiereErfkrit(apId, erfkritId);
        },
        apZiel: function (apId, apZielId) {
            initiiereApziel(apId, apZielId);
        },
        zielBericht: function (apId, apZielId, zielberId) {
            initiiereZielber(apId, apZielId, zielberId);
        },
        pop: function (apId, popId) {
            initiierePop(apId, popId);
        },
        popMassnBer: function (apId, popId, massnberId) {
            initiierePopMassnBer(apId, popId, massnberId);
        },
        popBer: function (apId, popId, popberId) {
            initiierePopBer(apId, popId, popberId);
        },
        tpop: function (apId, popId, tpopId) {
            initiiereTPop(apId, popId, tpopId);
        },
        beobZugeordnet: function (apId, popId, tpopId, beobId) {
        },
        tpopBer: function (apId, popId, tpopId, tpopBerId) {
            initiiereTPopBer(apId, popId, tpopId, tpopBerId);
        },
        freiwKontr: function (apId, popId, tpopId, feldKontrId) {
            initiiereTPopFeldkontr(apId, popId, tpopId, feldKontrId);
        },
        feldKontr: function (apId, popId, tpopId, feldKontrId) {
        },
        massnBer: function (apId, popId, tpopId, massnBerId) {
        },
        massn: function (apId, popId, tpopId, massnId) {
        },
        exportieren: function () {
        }
    });

    // TODO: home initiieren

};

module.exports = returnFunction;