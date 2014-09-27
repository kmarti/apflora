'use strict';

var _ = require('underscore')
    , mysql = require('mysql')
    , async = require('async')
    , config = require('../../src/modules/configuration')
    , connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    })
    , response = {}
    , apId
    , tpopListe
    , popListe
    , popIds
    , tpopIds
    ;

var returnFunction = function(request, reply) {
    apId = decodeURIComponent(request.params.id);

    // zuerst die popliste holen
    connection.query(
        'SELECT PopNr, PopName, PopId, ApArtId FROM tblPopulation where ApArtId = ' + apId + ' ORDER BY PopNr, PopName',
        function (err, result) {
            if (err) reply(err);
            popListe = result;
            popIds = _.pluck(popListe, 'PopId');

            // dann die tpopliste
            connection.query(
                'SELECT TPopNr, TPopFlurname, TPopId, PopId FROM tblTeilpopulation where PopId in (' + popIds.join() + ') ORDER BY TPopNr, TPopFlurname',
                function (err, result) {
                    if (err) reply(err);
                    tpopListe = result;
                    tpopIds = _.pluck(tpopListe, 'TPopId');
                    // jetzt parallel alle übrigen Daten aus dem pop-baum
                    async.parallel({
                        tpopMassnListe: function(callback) {
                            connection.query(
                                'SELECT TPopMassnId, TPopId, TPopMassnJahr, TPopMassnDatum, MassnTypTxt FROM tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON TPopMassnTyp = MassnTypCode where TPopId in (' + tpopIds.join() + ' ORDER BY TPopMassnJahr, TPopMassnDatum, MassnTypTxt',
                                function(err, tpopMassnListe) {
                                    callback(err, tpopMassnListe);
                                }
                            );
                        },
                        tpopMassnBerListe: function(callback) {
                            connection.query(
                                    'SELECT TPopMassnBerId, TPopId, TPopMassnBerJahr, BeurteilTxt FROM tblTeilPopMassnBericht LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON TPopMassnBerErfolgsbeurteilung = BeurteilId where TPopId in (' + tpopIds.join() + ' ORDER BY TPopMassnBerJahr, BeurteilTxt',
                                function(err, tpopMassnBerListe) {
                                    callback(err, tpopMassnBerListe);
                                }
                            );
                        },
                        tpopFeldkontrListe: function(callback) {
                            connection.query(
                                'SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tblTeilPopFeldkontrolle where (TPopId in (' + tpopIds.join() + ')) AND (TPopKontrTyp<>"Freiwilligen-Erfolgskontrolle" OR TPopKontrTyp IS NULL) ORDER BY TPopKontrJahr, TPopKontrTyp',
                                function(err, tpopFeldkontrListe) {
                                    callback(err, tpopFeldkontrListe);
                                }
                            );
                        },
                        tpopFreiwkontrListe : function(callback) {
                            connection.query(
                                'SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tblTeilPopFeldkontrolle where (TPopId in (' + tpopIds.join() + ')) AND (TPopKontrTyp="Freiwilligen-Erfolgskontrolle") ORDER BY TPopKontrJahr, TPopKontrTyp',
                                function(err, tpopFreiwkontrListe) {
                                    callback(err, tpopFreiwkontrListe);
                                }
                            );
                        },
                        tpopBerListe: function(callback) {
                            connection.query(
                                'SELECT TPopBerId, TPopId, TPopBerJahr, EntwicklungTxt, EntwicklungOrd FROM tblTeilPopBericht LEFT JOIN DomainTPopEntwicklung ON TPopBerEntwicklung = EntwicklungCode where TPopId in (' + tpopIds.join() + ') ORDER BY TPopBerJahr, EntwicklungOrd',
                                function(err, tpopBerListe) {
                                    callback(err, tpopBerListe);
                                }
                            );
                        },
                        tpopBeobZugeordnetListe: function(callback) {
                            connection.query(
                                'SELECT alexande_apflora.tblBeobZuordnung.NO_NOTE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen, alexande_apflora.tblBeobZuordnung.BeobBemerkungen, alexande_apflora.tblBeobZuordnung.BeobMutWann, alexande_apflora.tblBeobZuordnung.BeobMutWer, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, "evab" AS beobtyp FROM alexande_apflora.tblBeobZuordnung INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_apflora.tblBeobZuordnung.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET WHERE alexande_apflora.tblBeobZuordnung.TPopId=$TPopId AND (alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=0 OR alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen IS NULL) UNION SELECT alexande_apflora.tblBeobZuordnung.NO_NOTE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen, alexande_apflora.tblBeobZuordnung.BeobBemerkungen, alexande_apflora.tblBeobZuordnung.BeobMutWann, alexande_apflora.tblBeobZuordnung.BeobMutWer, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, "infospezies" AS beobtyp FROM alexande_apflora.tblBeobZuordnung INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_apflora.tblBeobZuordnung.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE WHERE alexande_apflora.tblBeobZuordnung.TPopId in (' + tpopIds.join() + ') AND (alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=0 OR alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen IS NULL) ORDER BY Datum',
                                function(err, tpopBeobZugeordnetListe) {
                                    callback(err, tpopBeobZugeordnetListe);
                                }
                            );
                        },
                        popBerListe: function(callback) {
                            connection.query(
                                'SELECT PopBerId, PopId, PopBerJahr, EntwicklungTxt, EntwicklungOrd FROM tblPopBericht LEFT JOIN DomainPopEntwicklung ON PopBerEntwicklung = EntwicklungId where PopId in (' + popIds.join() + ') ORDER BY PopBerJahr, EntwicklungOrd',
                                function(err, popBerListe) {
                                    callback(err, popBerListe);
                                }
                            );
                        },
                        popMassnBerListe: function(callback) {
                            connection.query(
                                'SELECT PopMassnBerId, PopId, PopMassnBerJahr, BeurteilTxt, BeurteilOrd FROM tblPopMassnBericht LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON PopMassnBerErfolgsbeurteilung = BeurteilId where PopId in (' + popIds.join() + ') ORDER BY PopMassnBerJahr, BeurteilOrd',
                                function(err, popMassnBerListe) {
                                    callback(err, popMassnBerListe);
                                }
                            );
                        }
                    }, function(err, results) {
                        var tpopMassnListe            = results.tpopMassnListe
                            , tpopMassnBerListe       = results.tpopMassnBerListe
                            , tpopFeldkontrListe      = results.tpopFeldkontrListe
                            , tpopFreiwkontrListe     = results.tpopFreiwkontrListe
                            , tpopBerListe            = results.tpopBerListe
                            , tpopBeobZugeordnetListe = results.tpopBeobZugeordnetListe
                            , popBerListe             = results.popBerListe
                            , popMassnBerListe        = results.popMassnBerListe
                            ;

                        var apziele,
                            zielbere,
                            popOrdnerNode = {},
                            popOrdnerNodeChildren,
                            popNode = {},
                            popNodeChildren = [],
                            apzielNode = {},
                            apzielNodeChildren = [],
                            apzielOrdnerNode = {},
                            apzielOrdnerNodeChildren = [],
                            zielberNode = {};

                        // node für ap_ordner_pop aufbauen
                        popOrdnerNode.data = 'Populationen (' + popListe.length + ')';
                        popOrdnerNode.attr = {
                            id: 'ap_ordner_pop' + apId,
                            typ: 'ap_ordner_pop'
                        };
                        popOrdnerNodeChildren = [];
                        popOrdnerNode.children = popOrdnerNodeChildren;

                        // in der apzielliste alls ZielJahr NULL mit '(kein Jahr)' ersetzen
                        _.each(popListe, function(apziel) {
                            if (!apziel.ZielJahr) apziel.ZielJahr = '(kein Jahr)';
                        });

                        _.each(popListe, function(pop) {
                            // nodes für pop aufbauen
                            var data,
                                popSort;
                            if (pop.PopName && pop.PopNr) {
                                data = pop.PopNr + ": " + pop.PopName;
                                popSort = pop.PopNr;
                            } else if (pop.PopNr) {
                                data = pop.PopNr + ": (kein Name)";
                                popSort = pop.PopNr;
                            } else if (pop.PopName) {
                                data = "(keine Nr): " + pop.PopName;
                                // pop ohne Nummern zuunterst sortieren
                                popSort = 1000;
                            } else {
                                data = "(keine Nr, kein Name)";
                                popSort = 1000;
                            }

                            popNode = {};
                            popNode.data = data;
                            popNode.attr = {
                                id: pop.PopId,
                                typ: 'pop',
                                sort: popSort
                            };
                            popNodeChildren = [];
                            // popNode.children ist ein Array, der enthält: pop_ordner_tpop, pop_ordner_popber, pop_ordner_massnber
                            popNode.children = popNodeChildren;
                            popOrdnerNodeChildren.push(popNode);

                            /*_.each(apziele, function(apziel) {
                             zielbere = _.filter(tpopListe, function(zielber) {
                             return zielber.ZielId === apziel.ZielId;
                             });
                             // node für apziele aufbauen
                             apzielNode = {};
                             apzielNode.data = apziel.ZielBezeichnung || '(Ziel nicht beschrieben)';
                             apzielNode.attr = {
                             id: apziel.ZielId,
                             typ: 'apziel'
                             };
                             apzielNodeChildren = [];
                             apzielNode.children = apzielNodeChildren;
                             popNodeChildren.push(apzielNode);

                             // ...und gleich seinen node für zielber-Ordner aufbauen
                             apzielOrdnerNode = {};
                             apzielOrdnerNode.data = 'Ziel-Berichte (' + zielbere.length + ')';
                             apzielOrdnerNode.attr = {
                             id: apziel.ZielId,
                             typ: 'zielber_ordner'
                             };
                             apzielOrdnerNodeChildren = [];
                             apzielOrdnerNode.children = apzielOrdnerNodeChildren;
                             apzielNodeChildren.push(apzielOrdnerNode);

                             _.each(zielbere, function(zielber) {
                             var data = '';
                             if (zielber.ZielBerJahr && zielber.ZielBerErreichung) {
                             data = zielber.ZielBerJahr + ': ' + zielber.ZielBerErreichung;
                             } else if (zielber.ZielBerJahr) {
                             data = zielber.ZielBerJahr + ': (keine Entwicklung)';
                             } else if (zielber.ZielBerErreichung) {
                             data = '(kein jahr): ' + zielber.ZielBerErreichung;
                             } else {
                             data = '(kein jahr): (keine Entwicklung)';
                             }
                             // nodes für zielbere aufbauen
                             zielberNode = {};
                             zielberNode.data = data;
                             zielberNode.attr = {
                             id: zielber.ZielBerId,
                             typ: 'zielber'
                             };
                             apzielOrdnerNodeChildren.push(zielberNode);
                             });
                             });*/
                        });
                        reply(null, popOrdnerNode);
                    });

                }
            );
        }
    );
};

module.exports = returnFunction;