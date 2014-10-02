'use strict';

var $ = require('jquery'),
    Backbone = require('backbone');

var returnFunction = function() {
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
            "ap=:apId/pop=:popId/tpop:tpopId/freiwKontr:freiwKontrId": "freiwKontr",
            "ap=:apId/pop=:popId/tpop:tpopId/feldKontr:feldKontrId":   "feldKontr",
            "ap=:apId/pop=:popId/tpop:tpopId/massnBer:massnBerId":     "massnBer",
            "ap=:apId/pop=:popId/tpop:tpopId/massn:massnId":           "massn",
            "exportieren":                                             "exportieren"
        }
    });
};

module.exports = returnFunction;