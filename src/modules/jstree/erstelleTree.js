/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    speichern                  = require('../speichern'),
    treeKontextmenu            = require('./treeKontextmenu'),
    melde                      = require('../melde'),
    initiierePop               = require('../initiierePop'),
    initiiereTPop              = require('../initiiereTPop'),
    initiiereTPopFeldkontr     = require('../initiiereTPopFeldkontr'),
    initiiereTPopMassn         = require('../initiiereTPopMassn'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    crrmCheckMove              = require('./crrmCheckMove'),
    types                      = require('./types.json'),
    loaded                     = require('./loaded'),
    select_node                = require('./select_node');

module.exports = function (ApArtId) {
    var jstreeErstellt = $.Deferred(),
        neueTpopId;

    localStorage.apId = ApArtId;
    $("#tree").jstree({
        "json_data": {
            "ajax": {
                "url": "api/v1/tree/apId=" + ApArtId,
                "progressive_render": true
            }
        },
        "core": {
            "open_parents": true,    // wird ein node programmatisch geöffnet, öffnen sich alle parents
            "strings": {    // Deutsche Übersetzungen
                "loading": "hole Daten...",
                "new_node": "neuer Knoten"
            }
        },
        "ui": {
            "select_limit": 1,    // nur ein Datensatz kann aufs mal gewählt werden
            "selected_parent_open": true,    // wenn Code einen node wählt, werden alle parents geöffnet
            "select_prev_on_delete": true
        },
        "search": {
            "case_insensitive": true
        },
        "sort": function (a, b) {
            if ($(a).attr("sort") && $(b).attr("sort")) {
                return parseInt($(a).attr("sort"), 10) > parseInt($(b).attr("sort"), 10) ? 1 : -1;
            }
        },
        "themes": {
            "icons": false
        },
        "contextmenu": {
            "items": treeKontextmenu,
            "select_node": true
        },
        "crrm": {
            "move": {
                "default_position": "first",
                "check_move": function (m) {
                    // hier wird bestimmt, welche drag-drop-Kombinationen zulässig sind
                    return crrmCheckMove(m);
                }
            }
        },
        "types": types,
        "plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "types"]
        // dnd ausgeschaltet, weil es Speichern verhindert im letzten Feld vor Klick in Baum
        //"plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "dnd", "types"]
    }).show().bind("loaded.jstree", function () {
        // function erhält event und data
        // bisher nicht benötigt
        jstreeErstellt.resolve();
        loaded(ApArtId);
    }).hammer().bind("hold doubletap", function () {
        // bind erhält event. Momentan nicht benötigt
        // auch auf Mobilgeräten soll das Kontextmenü zugänglich sein!
        // auf PC's verhindern: Menu erscheint sonst beim Scrollen
        if ($(window).width() < 1000) {
            setTimeout(function () {
                $("#tree").jstree('get_selected').children('a').trigger('contextmenu');
            }, 500);
        }
    }).bind("select_node.jstree", function (event, data) {
        select_node(event, data, ApArtId);
    }).bind("after_open.jstree", function () {
        window.apf.setzeTreehoehe();
    }).bind("after_close.jstree", function () {
        window.apf.setzeTreehoehe();
    }).bind("prepare_move.jstree", function (event, data) {
        // herkunft_parent_node muss vor dem move ermittelt werden - danach ist der parent ein anderer!
        window.apf.herkunftParentNode = $.jstree._reference(data.rslt.o)._get_parent(data.rslt.o);
    }).bind("create_node.jstree", function (event, data) {
        if (data.rslt.parent[0].attributes.typ.value === "apzieljahr") {
            var Objekt = {};
            Objekt.name = "ZielJahr";
            Objekt.formular = "apziel";
            speichern(Objekt);
            $("#ZielJahr")
                .val(data.rslt.parent[0].innerText.slice(1, 5))
                .focus();
        }
    }).bind("move_node.jstree", function (e, data) {
        var herkunftNode,
            herkunftNodeId,
            herkunftNodeTyp,
            zielNode,
            zielNodeId,
            zielNodeTyp,
            zielParentNode,
            zielParentNodeId;

        // nur aktualisieren, wenn Schreibrechte bestehen
        if (!window.apf.pruefeSchreibvoraussetzungen()) {
            return;
        }

        // Variablen setzen
        herkunftNode    = data.rslt.o;
        herkunftNodeId  = erstelleIdAusDomAttributId($(herkunftNode).attr("id"));
        herkunftNodeTyp = herkunftNode.attr("typ");
        zielNode        = data.rslt.r;
        zielNodeId      = erstelleIdAusDomAttributId($(zielNode).attr("id"));
        zielNodeTyp     = zielNode.attr("typ");
        zielParentNode  = $.jstree._reference(data.rslt.r)._get_parent(data.rslt.r);
        if ($(zielParentNode).attr("id")) {
            zielParentNodeId = erstelleIdAusDomAttributId($(zielParentNode).attr("id"));
        }

        if (herkunftNodeTyp === "pop") {
            if (zielNodeTyp === "pop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + zielNodeId + '/feld=ApArtId/wert=' + zielParentNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerPop(zielParentNode);
                    window.apf.beschrifteOrdnerPop(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(zielNode).deselect_all();
                    $.jstree._reference(herkunftNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.popId = herkunftNodeId;
                    delete window.apf.pop;
                    delete window.apf.herkunftParentNode;
                    initiierePop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
            if (zielNodeTyp === "tpop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=PopId/tabelleId=' + zielParentNodeId + '/feld=TPopId/wert=' + zielNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpop(zielParentNode);
                    window.apf.beschrifteOrdnerTpop(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(zielNode).deselect_all();
                    $.jstree._reference(herkunftNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopId = herkunftNodeId;
                    delete window.apf.tpop;
                    delete window.apf.tpopNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
            if (zielNodeTyp === "popOrdnerTpop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=PopId/tabelleId=' + zielNodeId + '/feld=TPopId/wert=' + herkunftNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpop(zielNode);
                    window.apf.beschrifteOrdnerTpop(window.apf.herkunftParentNode);
                    // select steuern
                    $.jstree._reference(zielNode).deselect_all();
                    $.jstree._reference(zielNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopId = herkunftNodeId;
                    delete window.apf.tpop;
                    delete window.apf.tpopNodeAusgeschnitten;
                    initiiereTPop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
        }
        if (herkunftNodeTyp === "tpop") {
            if (zielNodeTyp === "tpop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + herkunftNodeId + '/feld=PopId/wert=' + zielParentNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpop(zielParentNode);
                    window.apf.beschrifteOrdnerTpop(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunftNode).deselect_all();
                    $.jstree._reference(zielParentNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopId = herkunftNodeId;
                    delete window.apf.tpop;
                    delete window.apf.tpopNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
            if (zielNodeTyp === "popOrdnerTpop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + herkunftNodeId + '/feld=PopId/wert=' + zielNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpop(zielNode);
                    window.apf.beschrifteOrdnerTpop(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunftNode).deselect_all();
                    $.jstree._reference(herkunftNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopId = herkunftNodeId;
                    delete window.apf.tpop;
                    delete window.apf.tpopNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
        }
        if (herkunftNodeTyp === "tpopmassn") {
            if (zielNodeTyp === "tpopmassn") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilPopMassnahme/tabelleIdFeld=TPopId/tabelleId=' + zielParentNodeId + '/feld=TPopMassnId/wert=' + herkunftNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpopmassn(zielParentNode);
                    window.apf.beschrifteOrdnerTpopmassn(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunftNode).deselect_all();
                    $.jstree._reference(zielParentNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopmassnId = herkunftNodeId;
                    delete window.apf.tpopmassn;
                    delete window.apf.tpopmassnNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPopMassn();
                }).fail(function () {
                    melde("Fehler: Die Massnahme wurde nicht verschoben");
                });
            }
            if (zielNodeTyp === "tpopOrdnerMassn") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilPopMassnahme/tabelleIdFeld=TPopId/tabelleId=' + zielNodeId + '/feld=TPopMassnId/wert=' + herkunftNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpopmassn(zielNode);
                    window.apf.beschrifteOrdnerTpopmassn(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunftNode).deselect_all();
                    $.jstree._reference(herkunftNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopmassnId = herkunftNodeId;
                    delete window.apf.tpopmassn;
                    delete window.apf.tpopmassnNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPopMassn();
                }).fail(function () {
                    melde("Fehler: Die Massnahme wurde nicht verschoben");
                });
            }
        }
        if (herkunftNodeTyp === "tpopfeldkontr") {
            if (zielNodeTyp === "tpopfeldkontr") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + zielParentNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpopfeldkontr(zielParentNode);
                    window.apf.beschrifteOrdnerTpopfeldkontr(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunftNode).deselect_all();
                    $.jstree._reference(herkunftNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontrId = herkunftNodeId;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfeldkontrNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
                });
            }
            if (zielNodeTyp === "tpopOrdnerFeldkontr") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + zielNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpopfeldkontr(zielNode);
                    window.apf.beschrifteOrdnerTpopfeldkontr(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunftNode).deselect_all();
                    $.jstree._reference(herkunftNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontrId = herkunftNodeId;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfeldkontrNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
                });
            }
        }
        if (herkunftNodeTyp === "tpopfreiwkontr") {
            if (zielNodeTyp === "tpopfreiwkontr") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + zielParentNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpopfreiwkontr(zielParentNode);
                    window.apf.beschrifteOrdnerTpopfreiwkontr(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunftNode).deselect_all();
                    $.jstree._reference(herkunftNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontrId = herkunftNodeId;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfreiwkontrNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    localStorage.tpopfreiwkontr = true;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
                });
            }
            if (zielNodeTyp === "tpopOrdnerFreiwkontr") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + zielNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifteOrdnerTpopfreiwkontr(zielNode);
                    window.apf.beschrifteOrdnerTpopfreiwkontr(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunftNode).deselect_all();
                    $.jstree._reference(herkunftNode).select_node(herkunftNode);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontrId = herkunftNodeId;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfreiwkontrNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                    localStorage.tpopfreiwkontr = true;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
                });
            }
        }
        if (herkunftNodeTyp === "beobZugeordnet") {
            // zugeordnet
            if (zielNodeTyp === "beobNichtBeurteilt" || zielNodeTyp === "apOrdnerBeobNichtBeurteilt") {
                // zugeordnet > nicht beurteilt
                $.ajax({
                    type: 'delete',
                    url: 'api/v1/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunftNodeId
                }).done(function () {
                    // Zuordnung entfernen
                    $('[name="DistZuTPop"]').each(function () {
                        if ($(this).prop('checked') === true) $(this).prop('checked', false);
                    });

                    // typ des nodes anpassen
                    herkunftNode.attr("typ", "beobNichtBeurteilt");
                    localStorage.beobtyp = "beobNichtBeurteilt";

                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    if (zielNodeTyp === "beobNichtBeurteilt") {
                        window.apf.beschrifteOrdnerBeobNichtBeurteilt(zielParentNode);
                    } else {
                        window.apf.beschrifteOrdnerBeobNichtBeurteilt(zielNode);
                    }
                    window.apf.beschrifteOrdnerBeobZugeordnet(window.apf.herkunftParentNode);

                    // Variablen aufräumen
                    delete window.apf.beobNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
                });
            }
            if (zielNodeTyp === "beobZugeordnet" || zielNodeTyp === "tpopOrdnerBeobZugeordnet") {
                // zugeordnet > zugeordnet
                neueTpopId = (zielNodeTyp === "tpopOrdnerBeobZugeordnet" ? zielNodeId : zielParentNodeId);

                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + localStorage.beobId + '/feld=TPopId/wert=' + neueTpopId + '/user=' + sessionStorage.user
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    if (zielNodeTyp === "tpopOrdnerBeobZugeordnet") {
                        window.apf.beschrifteOrdnerBeobZugeordnet(zielNode);
                    } else {
                        window.apf.beschrifteOrdnerBeobZugeordnet(zielParentNode);
                    }
                    window.apf.beschrifteOrdnerBeobZugeordnet(window.apf.herkunftParentNode);

                    // selection steuern
                    if (localStorage.karteFokussieren) {
                        delete localStorage.karteFokussieren;
                    }

                    // Variablen aufräumen
                    delete window.apf.beobNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht verschoben");
                });
            }
            if (zielNodeTyp === "beobNichtZuzuordnen" || zielNodeTyp === "apOrdnerBeobNichtZuzuordnen") {
                // zugeordnet > nicht zuzuordnen
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunftNodeId + '/feld=BeobNichtZuordnen/wert=1/user=' + sessionStorage.user
                }).done(function () {
                    // TPopId null setzen
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunftNodeId + '/feld=TPopId/wert=/user=' + sessionStorage.user
                    }).done(function () {
                        // Zuordnung entfernen
                        $('[name="DistZuTPop"]').each(function () {
                            if ($(this).prop('checked') === true) $(this).prop('checked', false);
                        });

                        // typ des nodes anpassen
                        herkunftNode.attr("typ", "beobNichtZuzuordnen");
                        localStorage.beobtyp = "beobNichtZuzuordnen";

                        // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                        if (zielNodeTyp === "apOrdnerBeobNichtZuzuordnen") {
                            window.apf.beschrifteOrdnerBeobNichtNuzuordnen(zielNode);
                        } else {
                            window.apf.beschrifteOrdnerBeobNichtNuzuordnen(zielParentNode);
                        }
                        window.apf.beschrifteOrdnerBeobZugeordnet(window.apf.herkunftParentNode);

                        // Variablen aufräumen
                        delete window.apf.beobNodeAusgeschnitten;
                        delete window.apf.herkunftParentNode;
                    }).fail(function () {
                        console.log("fehler beim Leeren von TPopId");
                    });
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht verschoben");
                });
            }
        }
        if (herkunftNodeTyp === "beobNichtBeurteilt") {
            // nicht beurteilt
            if (zielNodeTyp === "beobZugeordnet" || zielNodeTyp === "tpopOrdnerBeobZugeordnet") {
                // nicht beurteilt > zugeordnet
                neueTpopId = (zielNodeTyp === "tpopOrdnerBeobZugeordnet" ? zielNodeId : zielParentNodeId);
                // Zuerst eine neue Zuordnung erstellen
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblBeobZuordnung/feld=NO_NOTE/wert=' + herkunftNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // jetzt aktualisieren
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunftNodeId + '/feld=TPopId/wert=' + neueTpopId + '/user=' + sessionStorage.user
                    }).done(function () {
                        // typ des nodes anpassen
                        herkunftNode.attr("typ", "beobZugeordnet");
                        localStorage.beobtyp = "beobZugeordnet";

                        // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
                        window.apf.beschrifteOrdnerBeobNichtBeurteilt(window.apf.herkunftParentNode);
                        if (zielNodeTyp === "tpopOrdnerBeobZugeordnet") {
                            window.apf.beschrifteOrdnerBeobZugeordnet(zielNode);
                        } else {
                            window.apf.beschrifteOrdnerBeobZugeordnet(zielParentNode);
                        }

                        // Nicht beurteilt: Deaktivieren
                        $('#BeobNichtBeurteilt').prop('checked', false);

                        // selection steuern
                        if (localStorage.karteFokussieren) {
                            delete localStorage.karteFokussieren;
                        }

                        // Variablen aufräumen
                        delete window.apf.beobNodeAusgeschnitten;
                        delete window.apf.herkunftParentNode;
                    }).fail(function () {
                        melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                    });
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                });
            }
            if (zielNodeTyp === "beobNichtZuzuordnen" || zielNodeTyp === "apOrdnerBeobNichtZuzuordnen") {
                // nicht beurteilt > nicht zuordnen
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblBeobZuordnung/feld=NO_NOTE/wert=' + herkunftNodeId + '/user=' + sessionStorage.user
                }).done(function () {
                    // jetzt aktualisieren
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunftNodeId + '/feld=BeobNichtZuordnen/wert=1/user=' + sessionStorage.user
                    }).done(function () {
                        // typ des nodes anpassen
                        $(herkunftNode).attr("typ", "beobNichtZuzuordnen");
                        localStorage.beobtyp = "beobNichtZuzuordnen";

                        // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
                        window.apf.beschrifteOrdnerBeobNichtBeurteilt(window.apf.herkunftParentNode);
                        if (zielNodeTyp === "apOrdnerBeobNichtZuzuordnen") {
                            window.apf.beschrifteOrdnerBeobNichtNuzuordnen(zielNode);
                        } else {
                            window.apf.beschrifteOrdnerBeobNichtNuzuordnen(zielParentNode);
                        }

                        // Nicht beurteilt: Deaktivieren
                        $('#BeobNichtBeurteilt').prop('checked', false);

                        // Variablen aufräumen
                        delete window.apf.beobNodeAusgeschnitten;
                        delete window.apf.herkunftParentNode;
                    }).fail(function () {
                        console.log("Fehler: Die Beobachtung wurde nicht zugeordnet");
                    });
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                });
            }
        }
        if (herkunftNodeTyp === "beobNichtZuzuordnen") {
            // nicht zuzuordnen
            if (zielNodeTyp === "beobNichtBeurteilt" || zielNodeTyp === "apOrdnerBeobNichtBeurteilt") {
                // nicht zuzuordnen > nicht beurteilt
                $.ajax({
                    type: 'delete',
                    url: 'api/v1/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunftNodeId
                }).done(function () {
                    // typ des nodes anpassen
                    $(herkunftNode).attr("typ", "beobNichtBeurteilt");
                    localStorage.beobtyp = "beobNichtBeurteilt";

                    // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
                    window.apf.beschrifteOrdnerBeobNichtNuzuordnen(window.apf.herkunftParentNode);
                    if (zielNodeTyp === "apOrdnerBeobNichtBeurteilt") {
                        window.apf.beschrifteOrdnerBeobNichtBeurteilt(zielNode);
                    } else {
                        window.apf.beschrifteOrdnerBeobNichtBeurteilt(zielParentNode);
                    }

                    // nicht zuzuordnen deaktivieren
                    $('#BeobNichtZuordnen').prop('checked', false);

                    // Variablen aufräumen
                    delete window.apf.beobNodeAusgeschnitten;
                    delete window.apf.herkunftParentNode;
                }).fail(function () {
                    melde("Fehler: Die Zuordnung der Beobachtung wurde nicht entfernt");
                });
            }
            if (zielNodeTyp === "beobZugeordnet" || zielNodeTyp === "tpopOrdnerBeobZugeordnet") {
                // nicht zuzuordnen > zugeordnet
                neueTpopId = (zielNodeTyp === "tpopOrdnerBeobZugeordnet" ? zielNodeId : zielParentNodeId);
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunftNodeId + '/feld=BeobNichtZuordnen/wert=/user=' + sessionStorage.user
                }).done(function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunftNodeId + '/feld=TPopId/wert=' + neueTpopId + '/user=' + sessionStorage.user
                    }).done(function () {
                        // typ des nodes anpassen
                        $(herkunftNode).attr("typ", "beobZugeordnet");
                        localStorage.beobtyp = "beobZugeordnet";

                        // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
                        window.apf.beschrifteOrdnerBeobNichtNuzuordnen(window.apf.herkunftParentNode);
                        if (zielNodeTyp === "tpopOrdnerBeobZugeordnet") {
                            window.apf.beschrifteOrdnerBeobZugeordnet(zielNode);
                        } else {
                            window.apf.beschrifteOrdnerBeobZugeordnet(zielParentNode);
                        }

                        // nicht zuzuordnen deaktivieren
                        $('#BeobNichtZuordnen').prop('checked', false);

                        // Variablen aufräumen
                        delete window.apf.beobNodeAusgeschnitten;
                        delete window.apf.herkunftParentNode;
                    }).fail(function () {
                        melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                    });
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                });
            }
        }
    });
    return jstreeErstellt.promise();
};