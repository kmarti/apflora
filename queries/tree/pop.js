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
    , erstelleTpopMassn          = require('./tpopMassn')
    , erstelleTpopMassnBer       = require('./tpopMassnBer')
    , erstelleTpopFeldkontr      = require('./tpopFeldkontr')
    , erstelleTpopFreiwkontr     = require('./tpopFreiwkontr')
    , erstelleTpopBer            = require('./tpopBer')
    , erstelleTpopBeobZugeordnet = require('./tpopBeobZugeordnet')
    ;

var returnFunction = function(request, reply) {
    apId = decodeURIComponent(request.params.apId);

    // zuerst die popliste holen
    async.waterfall([
        function(callback) {
            connection.query(
                'SELECT PopNr, PopName, PopId, ApArtId FROM tblPopulation where ApArtId = ' + apId + ' ORDER BY PopNr, PopName',
                function (err, result) {
                    if (err) reply(err);
                    var popListe = result,
                        popIds = _.pluck(popListe, 'PopId');
                    callback(err, popIds, popListe);
                }
            );
        },
        function(popIds, popListe, callback) {
            connection.query(
                    'SELECT TPopNr, TPopFlurname, TPopId, PopId FROM tblTeilpopulation where PopId in (' + popIds.join() + ') ORDER BY TPopNr, TPopFlurname',
                function (err, result) {
                    if (err) reply(err);
                    var tpopListe = result,
                        tpopIds = _.pluck(tpopListe, 'TPopId');
                    callback(err, [popIds, tpopIds, popListe, tpopListe]);
                }
            );
        }
    ], function(err, result) {
        var popIds = result[0],
            tpopIds = result[1],
            popListe = result[2],
            tpopListe = result[3];
            
        // jetzt parallel alle übrigen Daten aus dem pop-baum
        async.parallel({
            tpopMassnListe: function(callback) {
                connection.query(
                    'SELECT TPopMassnId, TPopId, TPopMassnJahr, TPopMassnDatum, MassnTypTxt FROM tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON TPopMassnTyp = MassnTypCode where TPopId in (' + tpopIds.join() + ') ORDER BY TPopMassnJahr, TPopMassnDatum, MassnTypTxt',
                    function(err, data) {
                        callback(err, data);
                    }
                );
            },
            tpopMassnBerListe: function(callback) {
                connection.query(
                    'SELECT TPopMassnBerId, TPopId, TPopMassnBerJahr, BeurteilTxt FROM tblTeilPopMassnBericht LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON TPopMassnBerErfolgsbeurteilung = BeurteilId where TPopId in (' + tpopIds.join() + ') ORDER BY TPopMassnBerJahr, BeurteilTxt',
                    function(err, data) {
                        callback(err, data);
                    }
                );
            },
            tpopFeldkontrListe: function(callback) {
                connection.query(
                    'SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tblTeilPopFeldkontrolle where (TPopId in (' + tpopIds.join() + ')) AND (TPopKontrTyp<>"Freiwilligen-Erfolgskontrolle" OR TPopKontrTyp IS NULL) ORDER BY TPopKontrJahr, TPopKontrTyp',
                    function(err, data) {
                        callback(err, data);
                    }
                );
            },
            tpopFreiwkontrListe : function(callback) {
                connection.query(
                    'SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tblTeilPopFeldkontrolle where (TPopId in (' + tpopIds.join() + ')) AND (TPopKontrTyp="Freiwilligen-Erfolgskontrolle") ORDER BY TPopKontrJahr, TPopKontrTyp',
                    function(err, data) {
                        callback(err, data);
                    }
                );
            },
            tpopBerListe: function(callback) {
                connection.query(
                    'SELECT TPopBerId, TPopId, TPopBerJahr, EntwicklungTxt, EntwicklungOrd FROM tblTeilPopBericht LEFT JOIN DomainTPopEntwicklung ON TPopBerEntwicklung = EntwicklungCode where TPopId in (' + tpopIds.join() + ') ORDER BY TPopBerJahr, EntwicklungOrd',
                    function(err, data) {
                        callback(err, data);
                    }
                );
            },
            tpopBeobZugeordnetListe: function(callback) {
                connection.query(
                    'SELECT alexande_apflora.tblBeobZuordnung.NO_NOTE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen, alexande_apflora.tblBeobZuordnung.BeobBemerkungen, alexande_apflora.tblBeobZuordnung.BeobMutWann, alexande_apflora.tblBeobZuordnung.BeobMutWer, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, "evab" AS beobtyp FROM alexande_apflora.tblBeobZuordnung INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_apflora.tblBeobZuordnung.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET WHERE alexande_apflora.tblBeobZuordnung.TPopId in (' + tpopIds.join() + ') AND (alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=0 OR alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen IS NULL) UNION SELECT alexande_apflora.tblBeobZuordnung.NO_NOTE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen, alexande_apflora.tblBeobZuordnung.BeobBemerkungen, alexande_apflora.tblBeobZuordnung.BeobMutWann, alexande_apflora.tblBeobZuordnung.BeobMutWer, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, "infospezies" AS beobtyp FROM alexande_apflora.tblBeobZuordnung INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_apflora.tblBeobZuordnung.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE WHERE alexande_apflora.tblBeobZuordnung.TPopId in (' + tpopIds.join() + ') AND (alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=0 OR alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen IS NULL) ORDER BY Datum',
                    function(err, data) {
                        callback(err, data);
                    }
                );
            },
            popBerListe: function(callback) {
                connection.query(
                    'SELECT PopBerId, PopId, PopBerJahr, EntwicklungTxt, EntwicklungOrd FROM tblPopBericht LEFT JOIN DomainPopEntwicklung ON PopBerEntwicklung = EntwicklungId where PopId in (' + popIds.join() + ') ORDER BY PopBerJahr, EntwicklungOrd',
                    function(err, data) {
                        callback(err, data);
                    }
                );
            },
            popMassnBerListe: function(callback) {
                connection.query(
                    'SELECT PopMassnBerId, PopId, PopMassnBerJahr, BeurteilTxt, BeurteilOrd FROM tblPopMassnBericht LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON PopMassnBerErfolgsbeurteilung = BeurteilId where PopId in (' + popIds.join() + ') ORDER BY PopMassnBerJahr, BeurteilOrd',
                    function(err, data) {
                        callback(err, data);
                    }
                );
            }
        }, function(err, results) {
            var tpopMassnListe            = results.tpopMassnListe || []
                , tpopMassnBerListe       = results.tpopMassnBerListe || []
                , tpopFeldkontrListe      = results.tpopFeldkontrListe || []
                , tpopFreiwkontrListe     = results.tpopFreiwkontrListe || []
                , tpopBerListe            = results.tpopBerListe || []
                , tpopBeobZugeordnetListe = results.tpopBeobZugeordnetListe || []
                , popBerListe             = results.popBerListe || []
                , popMassnBerListe        = results.popMassnBerListe || []
                ;

            var popOrdnerNode = {},
                popOrdnerNodeChildren;

            // node für ap_ordner_pop aufbauen
            popOrdnerNode.data = 'Populationen (' + popListe.length + ')';
            popOrdnerNode.attr = {
                id: 'ap_ordner_pop' + apId,
                typ: 'ap_ordner_pop'
            };
            popOrdnerNodeChildren = [];
            popOrdnerNode.children = popOrdnerNodeChildren;

            // PopNr: Je nach Anzahl Stellen der maximalen PopNr bei denjenigen mit weniger Nullen
            // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
            var popNrMax = _.max(popListe, function(pop) {
                return pop.PopNr;
            }).PopNr;

            _.each(popListe, function(pop) {
                var popNode = {},
                    popNodeChildren = [],
                    popNodeTpopOrdner = {},
                    popNodePopberOrdner = {},
                    popNodeMassnberOrdner = {},
                    popNodeTpopOrdnerChildren = [],
                    popNodePopberOrdnerChildren = [],
                    popNodeMassnberOrdnerChildren = [],
                    tpopVonPop = [],
                    popberVonPop = [],
                    massnberVonPop = [];

                pop.PopNr = ergänzePopNrUmFührendeNullen(popNrMax, pop.PopNr);

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
                // popNode.children ist ein Array, der enthält: pop_ordner_tpop, pop_ordner_popber, pop_ordner_massnber
                popNodeChildren = [];

                // Listen der nächsten Ebene erstellen
                tpopVonPop = _.filter(tpopListe, function(tpop) {
                    return tpop.PopId === pop.PopId;
                });
                popberVonPop = _.filter(popBerListe, function(popBer) {
                    return popBer.PopId === pop.PopId;
                });
                massnberVonPop = _.filter(popMassnBerListe, function(popMassnBer) {
                    return popMassnBer.PopId === pop.PopId;
                });

                // tpopOrdner aufbauen
                popNodeTpopOrdner.data = 'Teilpopulationen (' + tpopVonPop.length + ')';
                popNodeTpopOrdner.attr = {
                    id: pop.PopId,
                    typ: 'pop_ordner_tpop'
                };
                popNodeTpopOrdner.children = popNodeTpopOrdnerChildren;
                popNodeChildren.push(popNodeTpopOrdner);

                // PopberOrdner aufbauen
                popNodePopberOrdner.data = 'Populations-Berichte (' + popberVonPop.length + ')';
                popNodePopberOrdner.attr = {
                    id: pop.PopId,
                    typ: 'pop_ordner_popber'
                };
                popNodePopberOrdner.children = popNodePopberOrdnerChildren;
                popNodeChildren.push(popNodePopberOrdner);

                // popber aufbauen
                _.each(popberVonPop, function(popber) {
                    var node  = {},
                        nodeText;
                    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
                    if (popber.PopBerJahr && popber.EntwicklungTxt) {
                        nodeText = popber.PopBerJahr + ": " + popber.EntwicklungTxt;
                    } else if (popber.PopBerJahr) {
                        nodeText = popber.PopBerJahr + ": (nicht beurteilt)";
                    } else if (popber.EntwicklungTxt) {
                        nodeText = "(kein Jahr): " + popber.EntwicklungTxt;
                    } else {
                        nodeText = "(kein Jahr): (nicht beurteilt)";
                    }
                    node.data = nodeText;
                    node.attr = {
                        id: popber.PopBerId,
                        typ: 'popber'
                    };
                    popNodePopberOrdnerChildren.push(node);
                });

                // MassnberOrdner aufbauen
                popNodeMassnberOrdner.data = 'Massnahmen-Berichte (' + massnberVonPop.length + ')';
                popNodeMassnberOrdner.attr = {
                    id: pop.PopId,
                    typ: 'pop_ordner_massnber'
                };
                popNodeMassnberOrdner.children = popNodeMassnberOrdnerChildren;
                popNodeChildren.push(popNodeMassnberOrdner);

                // massnber aufbauen
                _.each(massnberVonPop, function(massnber) {
                    var node  = {},
                        nodeText;
                    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
                    if (massnber.PopMassnBerJahr && massnber.BeurteilTxt) {
                        nodeText = massnber.PopMassnBerJahr + ": " + massnber.BeurteilTxt;
                    } else if (massnber.PopMassnBerJahr) {
                        nodeText = massnber.PopMassnBerJahr + ": (nicht beurteilt)";
                    } else if (massnber.BeurteilTxt) {
                        nodeText = "(kein Jahr): " + massnber.BeurteilTxt;
                    } else {
                        nodeText = "(kein Jahr): (nicht beurteilt)";
                    }
                    node.data = nodeText;
                    node.attr = {
                        id: massnber.PopMassnBerId,
                        typ: 'popmassnber'
                    };
                    popNodeMassnberOrdnerChildren.push(node);
                });
                
                popNode.children = popNodeChildren;
                popOrdnerNodeChildren.push(popNode);

                // tpop aufbauen
                _.each(tpopVonPop, function(tpop) {
                    var tpopNode  = {},
                        tpopNodeText,
                        tpopSort,
                        tpopNodeChildren = [],
                        massnVonTpop,
                        massnberVonTpop,
                        feldkontrVonTpop,
                        freiwkontrVonTpop,
                        tpopberVonTpop,
                        tpopbeobzugeordnetVonTpop,
                        tpopNodeMassnBerOrdner = {},
                        tpopNodeFeldkontrOrdner = {},
                        tpopNodeFreiwkontrOrdner = {},
                        tpopNodeTpopberOrdner = {},
                        tpopNodeTpopBeobZugeordnetOrdner = {},
                        tpopNodeMassnBerOrdnerChildren = [],
                        tpopNodeFeldkontrOrdnerChildren = [],
                        tpopNodeFreiwkontrOrdnerChildren = [],
                        tpopNodeTpopberOrdnerChildren = [],
                        tpopNodeTpopBeobZugeordnetOrdnerChildren = [];

                    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
                    if (tpop.TPopNr && tpop.TPopFlurname) {
                        tpopNodeText = tpop.TPopNr + ": " + tpop.TPopFlurname;
                        tpopSort = tpop.TPopNr;
                    } else if (tpop.PopBerJahr) {
                        tpopNodeText = tpop.TPopNr + ": (kein Flurname)";
                        tpopSort = tpop.TPopNr;
                    } else if (tpop.TPopFlurname) {
                        tpopNodeText = "(keine Nr): " + tpop.TPopFlurname;
                        tpopSort = 1000;
                    } else {
                        tpopNodeText = "(keine Nr): (kein Flurname)";
                        tpopSort = 1000;
                    }
                    tpopNode.data = tpopNodeText;
                    tpopNode.attr = {
                        id: tpop.TPopId,
                        typ: 'tpop',
                        sort: tpopSort
                    };
                    tpopNode.children = tpopNodeChildren;
                    popNodeTpopOrdnerChildren.push(tpopNode);

                    // tpopOrdnerMassnahmen aufbauen
                    tpopNodeChildren.push(erstelleTpopMassn(tpopMassnListe, tpop));
                    // tpopOrdnerMassnBer aufbauen
                    tpopNodeChildren.push(erstelleTpopMassnBer(tpopMassnBerListe, tpop));
                    // tpopOrdnerFeldkontr aufbauen
                    tpopNodeChildren.push(erstelleTpopFeldkontr(tpopFeldkontrListe, tpop));
                    // tpopOrdnerFreiwkontr aufbauen
                    tpopNodeChildren.push(erstelleTpopFreiwkontr(tpopFreiwkontrListe, tpop));
                    // tpopOrdnerTpopber aufbauen
                    tpopNodeChildren.push(erstelleTpopBer(tpopBerListe, tpop));
                    // tpopOrdnerBeobZugeordnet aufbauen
                    tpopNodeChildren.push(erstelleTpopBeobZugeordnet(tpopBeobZugeordnetListe, tpop));
                });
            });
            reply(null, popOrdnerNode);
        });
    });
};

module.exports = returnFunction;

// erhält die höchste PopNr der Liste und die aktuelle
// stellt der aktuellen PopNr soviele Nullen voran, dass
// alle Nummern dieselbe Anzahl stellen haben
function ergänzePopNrUmFührendeNullen(popNrMax, popNr) {
    if (!popNr && popNr !== 0) return null;
    if (!popNrMax && popNrMax !== 0) return null;
    // Nummern in Strings umwandeln
    popNrMax = popNrMax.toString();
    popNr = popNr.toString();
    var stellendifferenz = popNrMax.length - popNr.length;
    // Voranzustellende Nullen generieren
    while (stellendifferenz > 0) {
        popNr = '0' + popNr;
        stellendifferenz--;
    }
    return popNr;
}