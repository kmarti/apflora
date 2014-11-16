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
    var jstreeErstellt = $.Deferred();

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
        var herkunft_node,
            herkunft_node_id,
            herkunft_node_typ,
            ziel_node,
            ziel_node_id,
            ziel_node_typ,
            ziel_parent_node,
            ziel_parent_node_id;

        // nur aktualisieren, wenn Schreibrechte bestehen
        if (!window.apf.pruefeSchreibvoraussetzungen()) {
            return;
        }

        // Variablen setzen
        herkunft_node     = data.rslt.o;
        herkunft_node_id  = erstelleIdAusDomAttributId($(herkunft_node).attr("id"));
        herkunft_node_typ = herkunft_node.attr("typ");
        ziel_node         = data.rslt.r;
        ziel_node_id      = erstelleIdAusDomAttributId($(ziel_node).attr("id"));
        ziel_node_typ     = ziel_node.attr("typ");
        ziel_parent_node  = $.jstree._reference(data.rslt.r)._get_parent(data.rslt.r);
        if ($(ziel_parent_node).attr("id")) {
            ziel_parent_node_id = erstelleIdAusDomAttributId($(ziel_parent_node).attr("id"));
        }

        if (herkunft_node_typ === "pop") {
            if (ziel_node_typ === "pop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + ziel_node_id + '/feld=ApArtId/wert=' + ziel_parent_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_pop(ziel_parent_node);
                    window.apf.beschrifte_ordner_pop(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(ziel_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.popId = herkunft_node_id;
                    delete window.apf.pop;
                    delete window.apf.herkunftParentNode;
                    initiierePop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
            if (ziel_node_typ === "tpop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=PopId/tabelleId=' + ziel_parent_node_id + '/feld=TPopId/wert=' + ziel_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpop(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpop(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(ziel_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopId = herkunft_node_id;
                    delete window.apf.tpop;
                    delete window.apf.tpop_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
            if (ziel_node_typ === "pop_ordner_tpop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=PopId/tabelleId=' + ziel_node_id + '/feld=TPopId/wert=' + herkunft_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpop(ziel_node);
                    window.apf.beschrifte_ordner_tpop(window.apf.herkunftParentNode);
                    // select steuern
                    $.jstree._reference(ziel_node).deselect_all();
                    $.jstree._reference(ziel_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopId = herkunft_node_id;
                    delete window.apf.tpop;
                    delete window.apf.tpop_node_ausgeschnitten;
                    initiiereTPop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
        }
        if (herkunft_node_typ === "tpop") {
            if (ziel_node_typ === "tpop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=PopId/tabelleId=' + ziel_parent_node_id + '/feld=TPopId/wert=' + herkunft_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpop(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpop(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(ziel_parent_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopId = herkunft_node_id;
                    delete window.apf.tpop;
                    delete window.apf.tpop_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
            if (ziel_node_typ === "pop_ordner_tpop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=PopId/tabelleId=' + ziel_node_id + '/feld=TPopId/wert=' + herkunft_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpop(ziel_node);
                    window.apf.beschrifte_ordner_tpop(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopId = herkunft_node_id;
                    delete window.apf.tpop;
                    delete window.apf.tpop_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPop();
                }).fail(function () {
                    melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                });
            }
        }
        if (herkunft_node_typ === "tpopmassn") {
            if (ziel_node_typ === "tpopmassn") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilPopMassnahme/tabelleIdFeld=TPopId/tabelleId=' + ziel_parent_node_id + '/feld=TPopMassnId/wert=' + herkunft_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopmassn(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpopmassn(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(ziel_parent_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopmassnId = herkunft_node_id;
                    delete window.apf.tpopmassn;
                    delete window.apf.tpopmassn_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPopMassn();
                }).fail(function () {
                    melde("Fehler: Die Massnahme wurde nicht verschoben");
                });
            }
            if (ziel_node_typ === "tpop_ordner_massn") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblTeilPopMassnahme/tabelleIdFeld=TPopId/tabelleId=' + ziel_node_id + '/feld=TPopMassnId/wert=' + herkunft_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopmassn(ziel_node);
                    window.apf.beschrifte_ordner_tpopmassn(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopmassnId = herkunft_node_id;
                    delete window.apf.tpopmassn;
                    delete window.apf.tpopmassn_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPopMassn();
                }).fail(function () {
                    melde("Fehler: Die Massnahme wurde nicht verschoben");
                });
            }
        }
        if (herkunft_node_typ === "tpopfeldkontr") {
            if (ziel_node_typ === "tpopfeldkontr") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + ziel_parent_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopfeldkontr(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpopfeldkontr(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontrId = herkunft_node_id;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfeldkontr_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
                });
            }
            if (ziel_node_typ === "tpop_ordner_feldkontr") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + ziel_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopfeldkontr(ziel_node);
                    window.apf.beschrifte_ordner_tpopfeldkontr(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontrId = herkunft_node_id;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfeldkontr_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
                });
            }
        }
        if (herkunft_node_typ === "tpopfreiwkontr") {
            if (ziel_node_typ === "tpopfreiwkontr") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + ziel_parent_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopfreiwkontr(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpopfreiwkontr(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontrId = herkunft_node_id;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfreiwkontr_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    localStorage.tpopfreiwkontr = true;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
                });
            }
            if (ziel_node_typ === "tpop_ordner_freiwkontr") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + ziel_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopfreiwkontr(ziel_node);
                    window.apf.beschrifte_ordner_tpopfreiwkontr(window.apf.herkunftParentNode);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontrId = herkunft_node_id;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfreiwkontr_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                    localStorage.tpopfreiwkontr = true;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
                });
            }
        }
        if (herkunft_node_typ === "beob_zugeordnet") {
            // zugeordnet
            if (ziel_node_typ === "beob_nicht_beurteilt" || ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
                // zugeordnet > nicht beurteilt
                $.ajax({
                    type: 'delete',
                    url: 'api/v1/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunft_node_id
                }).done(function () {
                    // Zuordnung entfernen
                    $('[name="DistZuTPop"]').each(function () {
                        if ($(this).prop('checked') === true) $(this).prop('checked', false);
                    });

                    // typ des nodes anpassen
                    herkunft_node.attr("typ", "beob_nicht_beurteilt");
                    localStorage.beobtyp = "beob_nicht_beurteilt";

                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    if (ziel_node_typ === "beob_nicht_beurteilt") {
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_parent_node);
                    } else {
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_node);
                    }
                    window.apf.beschrifteOrdnerBeobZugeordnet(window.apf.herkunftParentNode);

                    // Variablen aufräumen
                    delete window.apf.beob_zugeordnet_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
                });
            }
            if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                // zugeordnet > zugeordnet
                neue_tpop_id = (ziel_node_typ === "tpop_ordner_beob_zugeordnet" ? ziel_node_id : ziel_parent_node_id);

                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + localStorage.beobId + '/feld=TPopId/wert=' + neue_tpop_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                        window.apf.beschrifteOrdnerBeobZugeordnet(ziel_node);
                    } else {
                        window.apf.beschrifteOrdnerBeobZugeordnet(ziel_parent_node);
                    }
                    window.apf.beschrifteOrdnerBeobZugeordnet(window.apf.herkunftParentNode);

                    // selection steuern
                    if (localStorage.karte_fokussieren) {
                        delete localStorage.karte_fokussieren;
                    }

                    // Variablen aufräumen
                    delete window.apf.beob_zugeordnet_node_ausgeschnitten;
                    delete window.apf.herkunftParentNode;
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht verschoben");
                });
            }
            if (ziel_node_typ === "beob_nicht_zuzuordnen" || ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
                // zugeordnet > nicht zuzuordnen
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunft_node_id + '/feld=BeobNichtZuordnen/wert=1/user=' + sessionStorage.User
                }).done(function () {
                    // TPopId null setzen
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunft_node_id + '/feld=TPopId/wert=/user=' + sessionStorage.User
                    }).done(function () {
                        // Zuordnung entfernen
                        $('[name="DistZuTPop"]').each(function () {
                            if ($(this).prop('checked') === true) $(this).prop('checked', false);
                        });

                        // typ des nodes anpassen
                        herkunft_node.attr("typ", "beob_nicht_zuzuordnen");
                        localStorage.beobtyp = "beob_nicht_zuzuordnen";

                        // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                        if (ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
                            window.apf.beschrifteOrdnerBeobNichtNuzuordnen(ziel_node);
                        } else {
                            window.apf.beschrifteOrdnerBeobNichtNuzuordnen(ziel_parent_node);
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
        if (herkunft_node_typ === "beob_nicht_beurteilt") {
            // nicht beurteilt
            if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                // nicht beurteilt > zugeordnet
                neue_tpop_id = (ziel_node_typ === "tpop_ordner_beob_zugeordnet" ? ziel_node_id : ziel_parent_node_id);
                // Zuerst eine neue Zuordnung erstellen
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblBeobZuordnung/feld=NO_NOTE/wert=' + herkunft_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // jetzt aktualisieren
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunft_node_id + '/feld=TPopId/wert=' + neue_tpop_id + '/user=' + sessionStorage.User
                    }).done(function () {
                        // typ des nodes anpassen
                        herkunft_node.attr("typ", "beob_zugeordnet");
                        localStorage.beobtyp = "beob_zugeordnet";

                        // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(window.apf.herkunftParentNode);
                        if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                            window.apf.beschrifteOrdnerBeobZugeordnet(ziel_node);
                        } else {
                            window.apf.beschrifteOrdnerBeobZugeordnet(ziel_parent_node);
                        }

                        // Nicht beurteilt: Deaktivieren
                        $('#BeobNichtBeurteilt').prop('checked', false);

                        // selection steuern
                        if (localStorage.karte_fokussieren) {
                            delete localStorage.karte_fokussieren;
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
            if (ziel_node_typ === "beob_nicht_zuzuordnen" || ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
                // nicht beurteilt > nicht zuordnen
                $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblBeobZuordnung/feld=NO_NOTE/wert=' + herkunft_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // jetzt aktualisieren
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunft_node_id + '/feld=BeobNichtZuordnen/wert=1/user=' + sessionStorage.User
                    }).done(function () {
                        // typ des nodes anpassen
                        $(herkunft_node).attr("typ", "beob_nicht_zuzuordnen");
                        localStorage.beobtyp = "beob_nicht_zuzuordnen";

                        // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(window.apf.herkunftParentNode);
                        if (ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
                            window.apf.beschrifteOrdnerBeobNichtNuzuordnen(ziel_node);
                        } else {
                            window.apf.beschrifteOrdnerBeobNichtNuzuordnen(ziel_parent_node);
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
        if (herkunft_node_typ === "beob_nicht_zuzuordnen") {
            // nicht zuzuordnen
            if (ziel_node_typ === "beob_nicht_beurteilt" || ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
                // nicht zuzuordnen > nicht beurteilt
                $.ajax({
                    type: 'delete',
                    url: 'api/v1/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunft_node_id
                }).done(function () {
                    // typ des nodes anpassen
                    $(herkunft_node).attr("typ", "beob_nicht_beurteilt");
                    localStorage.beobtyp = "beob_nicht_beurteilt";

                    // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
                    window.apf.beschrifteOrdnerBeobNichtNuzuordnen(window.apf.herkunftParentNode);
                    if (ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_node);
                    } else {
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_parent_node);
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
            if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                // nicht zuzuordnen > zugeordnet
                var neue_tpop_id = (ziel_node_typ === "tpop_ordner_beob_zugeordnet" ? ziel_node_id : ziel_parent_node_id);
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunft_node_id + '/feld=BeobNichtZuordnen/wert=/user=' + sessionStorage.User
                }).done(function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + herkunft_node_id + '/feld=TPopId/wert=' + neue_tpop_id + '/user=' + sessionStorage.User
                    }).done(function () {
                        // typ des nodes anpassen
                        $(herkunft_node).attr("typ", "beob_zugeordnet");
                        localStorage.beobtyp = "beob_zugeordnet";

                        // Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
                        window.apf.beschrifteOrdnerBeobNichtNuzuordnen(window.apf.herkunftParentNode);
                        if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                            window.apf.beschrifteOrdnerBeobZugeordnet(ziel_node);
                        } else {
                            window.apf.beschrifteOrdnerBeobZugeordnet(ziel_parent_node);
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