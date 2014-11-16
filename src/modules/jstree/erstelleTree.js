/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    speichern                  = require('../speichern'),
    treeKontextmenu            = require('./treeKontextmenu'),
    melde                      = require('../melde'),
    initiiere_beob             = require('../initiiereBeob'),
    initiiereIdealbiotop       = require('../initiiereIdealbiotop'),
    initiiereAp                = require('../initiiereAp'),
    initiierePop               = require('../initiierePop'),
    initiiereApziel            = require('../initiiereApziel'),
    initiiereZielber           = require('../initiiereZielber'),
    initiiereErfkrit           = require('../initiiereErfkrit'),
    initiiereJber              = require('../initiiereJber'),
    initiiereJberUebersicht    = require('../initiiereJberUebersicht'),
    initiiereBer               = require('../initiiereBer'),
    initiiereAssozart          = require('../initiiereAssozart'),
    initiierePopMassnBer       = require('../initiierePopMassnBer'),
    initiiereTPop              = require('../initiiereTPop'),
    initiierePopBer            = require('../initiierePopBer'),
    initiiereTPopFeldkontr     = require('../initiiereTPopFeldkontr'),
    initiiereTPopMassn         = require('../initiiereTPopMassn'),
    initiiereTPopMassnBer      = require('../initiiereTPopMassnBer'),
    initiiereTPopBer           = require('../initiiereTPopBer'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId');

// übernimmt $ wegen jstree
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
            "items": window.apf.treeKontextmenu,
            "select_node": true
        },
        "crrm": {
            "move": {
                "default_position": "first",
                "check_move": function (m) {
                    // hier wird bestimmt, welche drag-drop-Kombinationen zulässig sind
                    if (m.o.attr("typ") === "pop") {
                        if (m.r.attr("typ") === "pop") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        }
                        return false;
                    }
                    if (m.o.attr("typ") === "tpop") {
                        switch (m.r.attr("typ")) {
                        case 'tpop':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'pop_ordner_tpop':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        default:
                            return false;
                        }
                    }
                    if (m.o.attr("typ") === "tpopmassn") {
                        switch (m.r.attr("typ")) {
                        case 'tpopmassn':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'tpop_ordner_massn':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        default:
                            return false;
                        }
                    }
                    if (m.o.attr("typ") === "tpopfeldkontr") {
                        switch (m.r.attr("typ")) {
                        case 'tpopfeldkontr':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'tpop_ordner_feldkontr':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        default:
                            return false;
                        }
                    }
                    if (m.o.attr("typ") === "tpopfreiwkontr") {
                        switch (m.r.attr("typ")) {
                        case 'tpopfreiwkontr':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'tpop_ordner_freiwkontr':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        default:
                            return false;
                        }
                    }
                    if (m.o.attr("typ") === "beob_zugeordnet") {
                        switch (m.r.attr("typ")) {
                        case 'beob_zugeordnet':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'tpop_ordner_beob_zugeordnet':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'ap_ordner_beob_nicht_beurteilt':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'beob_nicht_beurteilt':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'ap_ordner_beob_nicht_zuzuordnen':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'beob_nicht_zuzuordnen':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        default:
                            return false;
                        }
                    }
                    if (m.o.attr("typ") === "beob_nicht_beurteilt") {
                        switch (m.r.attr("typ")) {
                        case 'beob_zugeordnet':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'tpop_ordner_beob_zugeordnet':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'ap_ordner_beob_nicht_beurteilt':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'beob_nicht_beurteilt':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'ap_ordner_beob_nicht_zuzuordnen':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'beob_nicht_zuzuordnen':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        default:
                            return false;
                        }
                    }
                    if (m.o.attr("typ") === "beob_nicht_zuzuordnen") {
                        switch (m.r.attr("typ")) {
                        case 'beob_zugeordnet':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'tpop_ordner_beob_zugeordnet':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'ap_ordner_beob_nicht_beurteilt':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'beob_nicht_beurteilt':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        case 'ap_ordner_beob_nicht_zuzuordnen':
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        case 'beob_nicht_zuzuordnen':
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        default:
                            return false;
                        }
                    }
                    return false;
                }
            }
        },
        "types": {
            "type_attr": "typ",
            "max_children": -2,
            "max_depth": -2,
            "valid_children": ["ap_ordner_pop", "ap_ordner_apziel", "ap_ordner_erfkrit", "ap_ordner_jber", "ap_ordner_ber", "ap_ordner_beob_nicht_beurteilt", "ap_ordner_beob_nicht_zuzuordnen", "idealbiotop", "ap_ordner_assozarten"],
            "types": {
                "ap_ordner_pop": {
                    "valid_children": "pop"
                },
                "pop": {
                    "valid_children": ["pop_ordner_tpop", "pop_ordner_popber", "pop_ordner_massnber"],
                    "new_node": "neue Population"
                },
                "pop_ordner_tpop": {
                    "valid_children": "tpop"
                },
                "tpop": {
                    "valid_children": ["tpop_ordner_massn", "tpop_ordner_massnber", "tpop_ordner_feldkontr", "tpop_ordner_freiwkontr", "tpop_ordner_tpopber", "tpop_ordner_beob_zugeordnet"],
                    "new_node": "neue Teilpopulation"
                },
                "tpop_ordner_massn": {
                    "valid_children": "tpopmassn"
                },
                "tpopmassn": {
                    "valid_children": "none",
                    "new_node": "neue Massnahme"
                },
                "tpop_ordner_massnber": {
                    "valid_children": "tpopmassnber"
                },
                "tpopmassnber": {
                    "valid_children": "none",
                    "new_node": "neuer Massnahmen-Bericht"
                },
                "tpop_ordner_feldkontr": {
                    "valid_children": "tpopfeldkontr"
                },
                "tpopfeldkontr": {
                    "valid_children": "none",
                    "new_node": "neue Feldkontrolle"
                },
                "tpop_ordner_freiwkontr": {
                    "valid_children": "tpopfreiwkontr"
                },
                "tpopfreiwkontr": {
                    "valid_children": "none",
                    "new_node": "neue Freiwilligen-Kontrolle"
                },
                "tpop_ordner_tpopber": {
                    "valid_children": "tpopber"
                },
                "tpopber": {
                    "valid_children": "none",
                    "new_node": "neuer Teilpopulations-Bericht"
                },
                "tpop_ordner_beob_zugeordnet": {
                    "valid_children": "beob_zugeordnet"
                },
                "beob_zugeordnet": {
                    "valid_children": "none"
                },
                "pop_ordner_popber": {
                    "valid_children": "popber"
                },
                "popber": {
                    "valid_children": "none",
                    "new_node": "neuer Populations-Bericht"
                },
                "pop_ordner_massnber": {
                    "valid_children": "massnber"
                },
                "massnber": {
                    "valid_children": "none",
                    "new_node": "neuer Massnahmen-Bericht"
                },
                "ap_ordner_apziel": {
                    "valid_children": "apzieljahr"
                },
                "apzieljahr": {
                    "valid_children": "apziel"
                },
                "apziel": {
                    "valid_children": "zielber_ordner",
                    "new_node": "neues AP-Ziel"
                },
                "zielber_ordner": {
                    "valid_children": "zielber"
                },
                "zielber": {
                    "valid_children": "none",
                    "new_node": "neuer Ziel-Bericht"
                },
                "ap_ordner_erfkrit": {
                    "valid_children": "erfkrit"
                },
                "erfkrit": {
                    "valid_children": "none",
                    "new_node": "neues Erfolgskriterium"
                },
                "ap_ordner_jber": {
                    "valid_children": "jber"
                },
                "jber": {
                    "valid_children": "jber_uebersicht",
                    "new_node": "neuer AP-Bericht"
                },
                "jber_uebersicht": {
                    "valid_children": "none",
                    "new_node": "neue Übersicht zu allen Arten"
                },
                "ap_ordner_ber": {
                    "valid_children": "ber"
                },
                "ber": {
                    "valid_children": "none",
                    "new_node": "neuer Bericht"
                },
                "ap_ordner_beob_nicht_beurteilt": {
                    "valid_children": "beob_nicht_beurteilt"
                },
                "beob_nicht_beurteilt": {
                    "valid_children": "none"
                },
                "ap_ordner_beob_nicht_zuzuordnen": {
                    "valid_children": "beob_nicht_zuzuordnen"
                },
                "beob_nicht_zuzuordnen": {
                    "valid_children": "none"
                },
                "idealbiotop": {
                    "valid_children": "none"
                },
                "ap_ordner_assozarten": {
                    "valid_children": "assozarten"
                },
                "assozarten": {
                    "valid_children": "none",
                    "new_node": "neue assoziierte Art"
                }
            }
        },
        "plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "types"]
        //"plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "dnd", "types"]   // dnd ausgeschaltet, weil es Speichern verhindert im letzten Feld vor Klick in Baum
    }).show().bind("loaded.jstree", function (event, data) {
        jstreeErstellt.resolve();
        window.apf.setzeTreehoehe();
        $("#suchen").show();
        $("#exportieren_2").show();
        $("#exportieren_1").hide();
        $("#hilfe").show();
        if (window.apf.popZeigen) {
            $("#tree").jstree("select_node", "[typ='pop']#" + localStorage.popId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese Pop geöffnet wird
            delete window.apf.popZeigen;
        }
        if (window.apf.popberZeigen) {
            $("#tree").jstree("select_node", "[typ='popber']#" + localStorage.popberId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese Popber geöffnet wird
            delete window.apf.popberZeigen;
        }
        if (window.apf.popmassnberZeigen) {
            $("#tree").jstree("select_node", "[typ='popmassnber']#" + localStorage.popmassnberId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese popmassnber geöffnet wird
            delete window.apf.popmassnberZeigen;
        }
        if (window.apf.tpopZeigen) {
            $("#tree").jstree("select_node", "[typ='tpop']#" + localStorage.tpopId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese TPop geöffnet wird
            delete window.apf.tpopZeigen;
        }
        if (window.apf.tpopfeldkontrZeigen) {
            $("#tree").jstree("select_node", "[typ='tpopfeldkontr']#" + localStorage.tpopfeldkontrId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfeldkontr geöffnet wird
            delete window.apf.tpopfeldkontrZeigen;
        }
        if (window.apf.tpopfreiwkontrZeigen) {
            $("#tree").jstree("select_node", "[typ='tpopfreiwkontr']#" + localStorage.tpopfeldkontrId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfreiwkontr geöffnet wird
            delete window.apf.tpopfreiwkontrZeigen;
        }
        if (window.apf.tpopmassnZeigen) {
            $("#tree").jstree("select_node", "[typ='tpopmassn']#" + localStorage.tpopmassnId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassn geöffnet wird
            delete window.apf.tpopmassnZeigen;
        }
        if (window.apf.tpopberZeigen) {
            $("#tree").jstree("select_node", "[typ='tpopber']#" + localStorage.tpopberId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopber geöffnet wird
            delete window.apf.tpopberZeigen;
        }
        if (window.apf.beobZugeordnetZeigen) {
            $("#tree").jstree("select_node", "#beob" + localStorage.beobId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob_zugeordnet geöffnet wird
            delete window.apf.beobZugeordnetZeigen;
        }
        if (window.apf.tpopmassnberZeigen) {
            $("#tree").jstree("select_node", "[typ='tpopmassnber']#" + localStorage.tpopmassnberId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassnber geöffnet wird
            delete window.apf.tpopmassnberZeigen;
        }
        if (window.apf.apzielZeigen) {
            $("#tree").jstree("select_node", "[typ='apziel']#" + localStorage.apzielId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese apziel geöffnet wird
            delete window.apf.apzielZeigen;
        }
        if (window.apf.zielberZeigen) {
            $("#tree").jstree("select_node", "[typ='zielber']#" + localStorage.zielberId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese zielber geöffnet wird
            delete window.apf.zielberZeigen;
        }
        if (window.apf.erfkritZeigen) {
            $("#tree").jstree("select_node", "[typ='erfkrit']#" + localStorage.erfkritId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese erfkrit geöffnet wird
            delete window.apf.erfkritZeigen;
        }
        if (window.apf.jberZeigen) {
            $("#tree").jstree("select_node", "[typ='jber']#" + localStorage.jberId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber geöffnet wird
            delete window.apf.jberZeigen;
        }
        if (window.apf.jberUebersichtZeigen) {
            $("#tree").jstree("select_node", "[typ='jber_uebersicht']#" + localStorage.jberUebersichtId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber_uebersicht geöffnet wird
            delete window.apf.jberUebersichtZeigen;
        }
        if (window.apf.berZeigen) {
            $("#tree").jstree("select_node", "[typ='ber']#" + localStorage.berId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese ber geöffnet wird
            delete window.apf.berZeigen;
        }
        if (window.apf.idealbiotopZeigen) {
            $("#tree").jstree("select_node", "[typ='idealbiotop']#" + localStorage.idealbiotopId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese idealbiotop geöffnet wird
            delete window.apf.idealbiotopZeigen;
        }
        if (window.apf.assozartenZeigen) {
            $("#tree").jstree("select_node", "[typ='assozarten']#" + localStorage.assozartenId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese assozarten geöffnet wird
            delete window.apf.assozartenZeigen;
        }
        if (window.apf.beobNichtBeurteiltZeigen) {
            $("#tree").jstree("select_node", "#beob" + localStorage.beobId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
            delete window.apf.beobNichtBeurteiltZeigen;
        }
        if (window.apf.beobNichtZuzuordnenZeigen) {
            $("#tree").jstree("select_node", "#beob" + localStorage.beobId);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
            delete window.apf.beobNichtZuzuordnenZeigen;
        }
        if (window.apf.apZeigen) {
            initiiereAp(ApArtId);
            //localStorage.apId = ApArtId;
            //$('#ap_waehlen').trigger('change');
            // diese Markierung entfernen, damit das nächste mal nicht mehr dieser AP geöffnet wird
            delete window.apf.apZeigen;
        }
    }).hammer().bind("hold doubletap", function (event) {
        // auch auf Mobilgeräten soll das Kontextmenü zugänglich sein!
        // auf PC's verhindern: Menu erscheint sonst beim Scrollen
        if ($(window).width() < 1000) {
            setTimeout(function () {
                $("#tree").jstree('get_selected').children('a').trigger('contextmenu');
            }, 500);
        }
    }).bind("select_node.jstree", function (e, data) {
        var node,
            nodeTyp,
            nodeId;

        delete localStorage.tpopfreiwkontr;    // Erinnerung an letzten Klick im Baum löschen
        node = data.rslt.obj;
        nodeTyp = node.attr("typ");
        // in der ID des Nodes enthaltene Texte müssen entfernt werden
        nodeId = erstelleIdAusDomAttributId(node.attr("id"));
        // node öffnen
        $.jstree._reference(node).open_node(node);
        // richtiges Formular initiieren
        if (nodeTyp.slice(0, 3) === "ap_" || nodeTyp === "apzieljahr") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#ap").is(':visible') || localStorage.apId !== nodeId) {
                localStorage.apId = nodeId;
                delete localStorage.popId;
                initiiereAp(nodeId);
            }
        } else if (nodeTyp === "pop" || nodeTyp.slice(0, 4) === "pop_") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#pop").is(':visible') || localStorage.popId !== nodeId) {
                localStorage.popId = nodeId;
                initiierePop(ApArtId, nodeId);
            }
        } else if (nodeTyp === "apziel" || nodeTyp === "zielber_ordner") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#apziel").is(':visible') || localStorage.apzielId !== nodeId) {
                localStorage.apzielId = nodeId;
                initiiereApziel();
            }
        } else if (nodeTyp === "zielber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#zielber").is(':visible') || localStorage.zielberId !== nodeId) {
                localStorage.zielberId = nodeId;
                initiiereZielber();
            }
        } else if (nodeTyp === "erfkrit") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#erfkrit").is(':visible') || localStorage.erfkritId !== nodeId) {
                localStorage.erfkritId = nodeId;
                initiiereErfkrit();
            }
        } else if (nodeTyp === "jber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#jber").is(':visible') || localStorage.jberId !== nodeId) {
                localStorage.jberId = nodeId;
                initiiereJber();
            }
        } else if (nodeTyp === "jber_uebersicht") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#jber_uebersicht").is(':visible') || localStorage.jberUebersichtId !== nodeId) {
                localStorage.jberUebersichtId = nodeId;
                initiiereJberUebersicht();
            }
        } else if (nodeTyp === "ber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#ber").is(':visible') || localStorage.berId !== nodeId) {
                localStorage.berId = nodeId;
                initiiereBer();
            }
        } else if (nodeTyp === "idealbiotop") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#idealbiotop").is(':visible')) {
                // eigene id nicht nötig
                // 1:1 mit ap verbunden, gleich id
                // wenn noch kein Datensatz existiert erstellt ihn initiiereIdealbiotop
                initiiereIdealbiotop();
            }
        } else if (nodeTyp === "assozarten") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#assozarten").is(':visible') || localStorage.assozartenId !== nodeId) {
                localStorage.assozartenId = nodeId;
                initiiereAssozart(localStorage.apId, nodeId);
            }
        } else if (nodeTyp === "popber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#popber").is(':visible') || localStorage.popberId !== nodeId) {
                localStorage.popberId = nodeId;
                initiierePopBer();
            }
        } else if (nodeTyp === "popmassnber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#popmassnber").is(':visible') || localStorage.popmassnberId !== nodeId) {
                localStorage.popmassnberId = nodeId;
                initiierePopMassnBer();
            }
        } else if (nodeTyp === "tpop" || nodeTyp.slice(0, 5) === "tpop_") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpop").is(':visible') || localStorage.tpopId !== nodeId) {
                localStorage.tpopId = nodeId;
                initiiereTPop();
            }
        } else if (nodeTyp === "tpopfeldkontr") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontrId !== nodeId) {
                localStorage.tpopfeldkontrId = nodeId;
                initiiereTPopFeldkontr();
            }
        } else if (nodeTyp === "tpopfreiwkontr") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontrId !== nodeId) {
                localStorage.tpopfeldkontrId = nodeId;
                localStorage.tpopfreiwkontr = true;
                initiiereTPopFeldkontr();
            }
        } else if (nodeTyp === "tpopmassn") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopmassn").is(':visible') || localStorage.tpopmassnId !== nodeId) {
                localStorage.tpopmassnId = nodeId;
                initiiereTPopMassn();
            }
        } else if (nodeTyp === "tpopber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopber").is(':visible') || localStorage.tpopberId !== nodeId) {
                localStorage.tpopberId = nodeId;
                initiiereTPopBer();
            }
        } else if (nodeTyp === "beob_zugeordnet") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#beob").is(':visible') || localStorage.beobId !== nodeId || localStorage.beobStatus !== "zugeordnet") {
                localStorage.beobId = nodeId;
                localStorage.beobtyp = node.attr("beobtyp");
                initiiere_beob(node.attr("beobtyp"), nodeId, "zugeordnet");
            }
        } else if (nodeTyp === "beob_nicht_beurteilt") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#beob").is(':visible') || localStorage.beobId !== nodeId || localStorage.beobStatus !== "nicht_beurteilt") {
                localStorage.beobId = nodeId;
                localStorage.beobtyp = node.attr("beobtyp");
                // den Beobtyp mitgeben
                initiiere_beob(node.attr("beobtyp"), nodeId, "nicht_beurteilt");
            }
        } else if (nodeTyp === "beob_nicht_zuzuordnen") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#beob").is(':visible') || localStorage.beobId !== nodeId || localStorage.beobStatus !== "nicht_zuzuordnen") {
                localStorage.beobId = nodeId;
                localStorage.beobtyp = node.attr("beobtyp");
                // den Beobtyp mitgeben
                initiiere_beob(node.attr("beobtyp"), nodeId, "nicht_zuzuordnen");
            }
        } else if (nodeTyp === "tpopmassnber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopmassnber").is(':visible') || localStorage.tpopmassnberId !== nodeId) {
                localStorage.tpopmassnberId = nodeId;
                initiiereTPopMassnBer();
            }
        }
    }).bind("after_open.jstree", function () {
        window.apf.setzeTreehoehe();
    }).bind("after_close.jstree", function () {
        window.apf.setzeTreehoehe();
    }).bind("prepare_move.jstree", function (e, data) {
        // herkunft_parent_node muss vor dem move ermittelt werden - danach ist der parent ein anderer!
        window.apf.herkunftParentNode = $.jstree._reference(data.rslt.o)._get_parent(data.rslt.o);
    }).bind("create_node.jstree", function (e, data) {
        if (data.rslt.parent[0].attributes.typ.value === "apzieljahr") {
            var Objekt = {};
            Objekt.name = "ZielJahr";
            Objekt.formular = "apziel";
            speichern(Objekt);
            $("#ZielJahr")
                .val(data.rslt.parent[0].innerText.slice(1, 5))
                .focus();
        }
    })bind("move_node.jstree", function (e, data) {
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