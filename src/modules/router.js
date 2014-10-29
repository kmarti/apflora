/*jslint node: true, browser: true, nomen: true */
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
    initiiereTPopFeldkontr  = require('./initiiereTPopFeldkontr'),
    initiiereTPopMassnBer   = require('./initiiereTPopMassnBer'),
    initiiereTPopMassn      = require('./initiiereTPopMassn');

var returnFunction = Backbone.Router.extend({
    routes: {
        '':                                                        'home',
        'ap=:apId':                                                'ap',
        'ap=:apId/assozart=:assozId':                              'assozart',
        'ap=:apId/idealbiotop':                                    'idealbiotop',
        'ap=:apId/beobNichtZuzuordnen=:beobId':                    'beobNichtZuzuordnen',
        'ap=:apId/beobNichtBeurteilt=:beobId':                     'beobNichtBeurteilt',
        'ap=:apId/bericht=:berId':                                 'bericht',
        'ap=:apId/apBericht=:apBerId':                             'apBericht',
        'ap=:apId/apBericht=:apBerId/uebersicht=:uebId':           'apBerÜbersicht',
        'ap=:apId/erfolgskriterium=:erfkritId':                    'erfolgskriterium',
        'ap=:apId/apZiel=:apZielId':                               'apZiel',
        'ap=:apId/apZiel=:apZielId/zielBericht:zielberId':         'zielBericht',
        'ap=:apId/pop=:popId':                                     'pop',
        'ap=:apId/pop=:popId/massnber:massnberId':                 'popMassnBer',
        'ap=:apId/pop=:popId/popber:popberId':                     'popBer',
        'ap=:apId/pop=:popId/tpop:tpopId':                         'tpop',
        'ap=:apId/pop=:popId/tpop:tpopId/beobZugeordnet:beobId':   'beobZugeordnet',
        'ap=:apId/pop=:popId/tpop:tpopId/tpopBer:tpopBerId':       'tpopBer',
        'ap=:apId/pop=:popId/tpop:tpopId/freiwKontr:feldKontrId':  'freiwKontr',
        'ap=:apId/pop=:popId/tpop:tpopId/feldKontr:feldKontrId':   'feldKontr',
        'ap=:apId/pop=:popId/tpop:tpopId/massnBer:massnBerId':     'massnBer',
        'ap=:apId/pop=:popId/tpop:tpopId/massn:massnId':           'massn',
        'exportieren':                                             'exportieren'
    },
    home: function () {
        console.log('route zu index');
        initiiereIndex();
    },
    ap: function (apId) {
        console.log('route zu ap ', apId);
        // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
        // Die Markierung wird im load-Event wieder entfernt
        window.apf.ap_zeigen = true;
        // direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
        initiiereAp(apId);
    },
    assozart: function (apId, assozId) {
        console.log('route zu Assozart');
        initiiereAssozart(apId, assozId);
    },
    idealbiotop: function (apId) {
        console.log('route zu Idealbiotop');
        initiiereIdealbiotop(apId);
    },
    beobNichtZuzuordnen: function (apId, beobId) {
    },
    beobNichtBeurteilt: function (apId, beobId) {
    },
    bericht: function (apId, berId) {
        console.log('route zu Ber');
        initiiereBer(apId, berId);
    },
    apBericht: function (apId, apBerId) {
        console.log('route zu Jber');
        initiiereJber(apId, apBerId);
    },
    apBerÜbersicht: function (apId, uebId) {
        console.log('route zu JberUebersicht');
        initiiereJberUebersicht(apId, uebId);
    },
    erfolgskriterium: function (apId, erfkritId) {
        console.log('route zu Erfkrit');
        initiiereErfkrit(apId, erfkritId);
    },
    apZiel: function (apId, apZielId) {
        console.log('route zu Apziel');
        initiiereApziel(apId, apZielId);
    },
    zielBericht: function (apId, apZielId, zielberId) {
        console.log('route zu Zielber');
        initiiereZielber(apId, apZielId, zielberId);
    },
    pop: function (apId, popId) {
        console.log('route zu Pop');
        initiierePop(apId, popId);
    },
    popMassnBer: function (apId, popId, massnberId) {
        console.log('route zu PopMassnBer');
        initiierePopMassnBer(apId, popId, massnberId);
    },
    popBer: function (apId, popId, popberId) {
        console.log('route zu PopBer');
        initiierePopBer(apId, popId, popberId);
    },
    tpop: function (apId, popId, tpopId) {
        console.log('route zu TPop');
        initiiereTPop(apId, popId, tpopId);
    },
    beobZugeordnet: function (apId, popId, tpopId, beobId) {
        console.log('route zu TPopBer');
    },
    tpopBer: function (apId, popId, tpopId, tpopBerId) {
        initiiereTPopBer(apId, popId, tpopId, tpopBerId);
    },
    freiwKontr: function (apId, popId, tpopId, feldKontrId) {
        console.log('route zu TPopFeldkontr');
        initiiereTPopFeldkontr(apId, popId, tpopId, 'freiwKontr');
    },
    feldKontr: function (apId, popId, tpopId, feldKontrId) {
        console.log('route zu TPopFeldkontr');
        initiiereTPopFeldkontr(apId, popId, tpopId, 'feldKontr');
    },
    massnBer: function (apId, popId, tpopId, massnBerId) {
        console.log('route zu TPopMassnBer');
        initiiereTPopMassnBer(apId, popId, tpopId, massnBerId);
    },
    massn: function (apId, popId, tpopId, massnId) {
        console.log('route zu TPopMassn');
        initiiereTPopMassn(apId, popId, tpopId, massnId);
    },
    exportieren: function () {
        window.apf.initiiereExporte();
    },
    initialize: function() {
        //Backbone.history.start({pushState: true});
        console.log('the router was started');
    }

});

module.exports = returnFunction;