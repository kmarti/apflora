/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $               = require('jquery'),
    speichern       = require('../speichern'),
    treeKontextmenu = require('./treeKontextmenu'),
    melde           = require('../melde');

require('jquery-ui');
$.jstree = require('jquery.jstree');

// übernimmt $ wegen jstree
var returnFunction = function (ApArtId) {
    var jstree_erstellt = $.Deferred();
    localStorage.ap_id = ApArtId;
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
    })
    .show()
    .bind("loaded.jstree", function (event, data) {
        var initiiereAp = require('../initiiereAp');
        jstree_erstellt.resolve();
        window.apf.setzeTreehöhe();
        $("#suchen").show();
        $("#exportieren_2").show();
        $("#exportieren_1").hide();
        $("#hilfe").show();
        if (window.apf.pop_zeigen) {
            $("#tree").jstree("select_node", "[typ='pop']#" + localStorage.pop_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese Pop geöffnet wird
            delete window.apf.pop_zeigen;
        }
        if (window.apf.popber_zeigen) {
            $("#tree").jstree("select_node", "[typ='popber']#" + localStorage.popber_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese Popber geöffnet wird
            delete window.apf.popber_zeigen;
        }
        if (window.apf.popmassnber_zeigen) {
            $("#tree").jstree("select_node", "[typ='popmassnber']#" + localStorage.popmassnber_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese popmassnber geöffnet wird
            delete window.apf.popmassnber_zeigen;
        }
        if (window.apf.tpop_zeigen) {
            $("#tree").jstree("select_node", "[typ='tpop']#" + localStorage.tpop_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese TPop geöffnet wird
            delete window.apf.tpop_zeigen;
        }
        if (window.apf.tpopfeldkontr_zeigen) {
            $("#tree").jstree("select_node", "[typ='tpopfeldkontr']#" + localStorage.tpopfeldkontr_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfeldkontr geöffnet wird
            delete window.apf.tpopfeldkontr_zeigen;
        }
        if (window.apf.tpopfreiwkontr_zeigen) {
            $("#tree").jstree("select_node", "[typ='tpopfreiwkontr']#" + localStorage.tpopfeldkontr_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfreiwkontr geöffnet wird
            delete window.apf.tpopfreiwkontr_zeigen;
        }
        if (window.apf.tpopmassn_zeigen) {
            $("#tree").jstree("select_node", "[typ='tpopmassn']#" + localStorage.tpopmassn_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassn geöffnet wird
            delete window.apf.tpopmassn_zeigen;
        }
        if (window.apf.tpopber_zeigen) {
            $("#tree").jstree("select_node", "[typ='tpopber']#" + localStorage.tpopber_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopber geöffnet wird
            delete window.apf.tpopber_zeigen;
        }
        if (window.apf.beob_zugeordnet_zeigen) {
            $("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob_zugeordnet geöffnet wird
            delete window.apf.beob_zugeordnet_zeigen;
        }
        if (window.apf.tpopmassnber_zeigen) {
            $("#tree").jstree("select_node", "[typ='tpopmassnber']#" + localStorage.tpopmassnber_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassnber geöffnet wird
            delete window.apf.tpopmassnber_zeigen;
        }
        if (window.apf.apziel_zeigen) {
            $("#tree").jstree("select_node", "[typ='apziel']#" + localStorage.apziel_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese apziel geöffnet wird
            delete window.apf.apziel_zeigen;
        }
        if (window.apf.zielber_zeigen) {
            $("#tree").jstree("select_node", "[typ='zielber']#" + localStorage.zielber_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese zielber geöffnet wird
            delete window.apf.zielber_zeigen;
        }
        if (window.apf.erfkrit_zeigen) {
            $("#tree").jstree("select_node", "[typ='erfkrit']#" + localStorage.erfkrit_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese erfkrit geöffnet wird
            delete window.apf.erfkrit_zeigen;
        }
        if (window.apf.jber_zeigen) {
            $("#tree").jstree("select_node", "[typ='jber']#" + localStorage.jber_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber geöffnet wird
            delete window.apf.jber_zeigen;
        }
        if (window.apf.jber_übersicht_zeigen) {
            $("#tree").jstree("select_node", "[typ='jber_uebersicht']#" + localStorage.jber_uebersicht_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber_uebersicht geöffnet wird
            delete window.apf.jber_übersicht_zeigen;
        }
        if (window.apf.ber_zeigen) {
            $("#tree").jstree("select_node", "[typ='ber']#" + localStorage.ber_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese ber geöffnet wird
            delete window.apf.ber_zeigen;
        }
        if (window.apf.idealbiotop_zeigen) {
            $("#tree").jstree("select_node", "[typ='idealbiotop']#" + localStorage.idealbiotop_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese idealbiotop geöffnet wird
            delete window.apf.idealbiotop_zeigen;
        }
        if (window.apf.assozarten_zeigen) {
            $("#tree").jstree("select_node", "[typ='assozarten']#" + localStorage.assozarten_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese assozarten geöffnet wird
            delete window.apf.assozarten_zeigen;
        }
        if (window.apf.beob_nicht_beurteilt_zeigen) {
            $("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
            delete window.apf.beob_nicht_beurteilt_zeigen;
        }
        if (window.apf.beob_nicht_zuzuordnen_zeigen) {
            $("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
            // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
            delete window.apf.beob_nicht_zuzuordnen_zeigen;
        }
        if (window.apf.ap_zeigen) {
            initiiereAp(ApArtId);
            //localStorage.ap_id = ApArtId;
            //$('#ap_waehlen').trigger('change');
            // diese Markierung entfernen, damit das nächste mal nicht mehr dieser AP geöffnet wird
            delete window.apf.ap_zeigen;
        }
    })
    // auch auf Mobilgeräten soll das Kontextmenü zugänglich sein!
    .hammer().bind("hold doubletap", function (event) {
        // auf PC's verhindern: Menu erscheint sonst beim Scrollen
        if ($(window).width() < 1000) {
            setTimeout(function () {
                $("#tree").jstree('get_selected').children('a').trigger('contextmenu');
            }, 500);
        }
    })
    .bind("select_node.jstree", function (e, data) {
        var node,
            initiiere_beob          = require('../initiiereBeob'),
            initiiereIdealbiotop    = require('../initiiereIdealbiotop'),
            initiiereAp             = require('../initiiereAp'),
            initiierePop            = require('../initiierePop'),
            initiiereApziel         = require('../initiiereApziel'),
            initiiereZielber        = require('../initiiereZielber'),
            initiiereErfkrit        = require('../initiiereErfkrit'),
            initiiereJber           = require('../initiiereJber'),
            initiiereJberUebersicht = require('../initiiereJberUebersicht'),
            initiiereBer            = require('../initiiereBer'),
            initiiereAssozart       = require('../initiiereAssozart'),
            initiierePopMassnBer    = require('../initiierePopMassnBer'),
            initiiereTPop           = require('../initiiereTPop'),
            initiierePopBer         = require('../initiierePopBer'),
            initiiereTPopFeldkontr  = require('../initiiereTPopFeldkontr'),
            initiiereTPopMassn      = require('../initiiereTPopMassn'),
            initiiereTPopMassnBer   = require('../initiiereTPopMassnBer'),
            initiiereTPopBer        = require('../initiiereTPopBer');

        delete localStorage.tpopfreiwkontr;    // Erinnerung an letzten Klick im Baum löschen
        node = data.rslt.obj;
        var node_typ = node.attr("typ");
        // in der ID des Nodes enthaltene Texte müssen entfernt werden
        var node_id = window.apf.erstelleIdAusDomAttributId(node.attr("id"));
        // node öffnen
        $.jstree._reference(node).open_node(node);
        // richtiges Formular initiieren
        if (node_typ.slice(0, 3) === "ap_" || node_typ === "apzieljahr") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#ap").is(':visible') || localStorage.ap_id !== node_id) {
                localStorage.ap_id = node_id;
                delete localStorage.pop_id;
                initiiereAp(node_id);
            }
        } else if (node_typ === "pop" || node_typ.slice(0, 4) === "pop_") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#pop").is(':visible') || localStorage.pop_id !== node_id) {
                localStorage.pop_id = node_id;
                initiierePop(ApArtId, node_id);
            }
        } else if (node_typ === "apziel" || node_typ === "zielber_ordner") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#apziel").is(':visible') || localStorage.apziel_id !== node_id) {
                localStorage.apziel_id = node_id;
                initiiereApziel();
            }
        } else if (node_typ === "zielber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#zielber").is(':visible') || localStorage.zielber_id !== node_id) {
                localStorage.zielber_id = node_id;
                initiiereZielber();
            }
        } else if (node_typ === "erfkrit") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#erfkrit").is(':visible') || localStorage.erfkrit_id !== node_id) {
                localStorage.erfkrit_id = node_id;
                initiiereErfkrit();
            }
        } else if (node_typ === "jber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#jber").is(':visible') || localStorage.jber_id !== node_id) {
                localStorage.jber_id = node_id;
                initiiereJber();
            }
        } else if (node_typ === "jber_uebersicht") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#jber_uebersicht").is(':visible') || localStorage.jber_uebersicht_id !== node_id) {
                localStorage.jber_uebersicht_id = node_id;
                initiiereJberUebersicht();
            }
        } else if (node_typ === "ber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#ber").is(':visible') || localStorage.ber_id !== node_id) {
                localStorage.ber_id = node_id;
                initiiereBer();
            }
        } else if (node_typ === "idealbiotop") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#idealbiotop").is(':visible')) {
                // eigene id nicht nötig
                // 1:1 mit ap verbunden, gleich id
                // wenn noch kein Datensatz existiert erstellt ihn initiiereIdealbiotop
                initiiereIdealbiotop();
            }
        } else if (node_typ === "assozarten") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#assozarten").is(':visible') || localStorage.assozarten_id !== node_id) {
                localStorage.assozarten_id = node_id;
                initiiereAssozart(localStorage.ap_id, node_id);
            }
        } else if (node_typ === "popber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#popber").is(':visible') || localStorage.popber_id !== node_id) {
                localStorage.popber_id = node_id;
                initiierePopBer();
            }
        } else if (node_typ === "popmassnber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#popmassnber").is(':visible') || localStorage.popmassnber_id !== node_id) {
                localStorage.popmassnber_id = node_id;
                initiierePopMassnBer();
            }
        } else if (node_typ === "tpop" || node_typ.slice(0, 5) === "tpop_") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpop").is(':visible') || localStorage.tpop_id !== node_id) {
                localStorage.tpop_id = node_id;
                initiiereTPop();
            }
        } else if (node_typ === "tpopfeldkontr") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontr_id !== node_id) {
                localStorage.tpopfeldkontr_id = node_id;
                initiiereTPopFeldkontr();
            }
        } else if (node_typ === "tpopfreiwkontr") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontr_id !== node_id) {
                localStorage.tpopfeldkontr_id = node_id;
                localStorage.tpopfreiwkontr = true;
                initiiereTPopFeldkontr();
            }
        } else if (node_typ === "tpopmassn") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopmassn").is(':visible') || localStorage.tpopmassn_id !== node_id) {
                localStorage.tpopmassn_id = node_id;
                initiiereTPopMassn();
            }
        } else if (node_typ === "tpopber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopber").is(':visible') || localStorage.tpopber_id !== node_id) {
                localStorage.tpopber_id = node_id;
                initiiereTPopBer();
            }
        } else if (node_typ === "beob_zugeordnet") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "zugeordnet") {
                localStorage.beob_id = node_id;
                localStorage.beobtyp = node.attr("beobtyp");
                initiiere_beob(node.attr("beobtyp"), node_id, "zugeordnet");
            }
        } else if (node_typ === "beob_nicht_beurteilt") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "nicht_beurteilt") {
                localStorage.beob_id = node_id;
                localStorage.beobtyp = node.attr("beobtyp");
                // den Beobtyp mitgeben
                initiiere_beob(node.attr("beobtyp"), node_id, "nicht_beurteilt");
            }
        } else if (node_typ === "beob_nicht_zuzuordnen") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "nicht_zuzuordnen") {
                localStorage.beob_id = node_id;
                localStorage.beobtyp = node.attr("beobtyp");
                // den Beobtyp mitgeben
                initiiere_beob(node.attr("beobtyp"), node_id, "nicht_zuzuordnen");
            }
        } else if (node_typ === "tpopmassnber") {
            // verhindern, dass bereits offene Seiten nochmals geöffnet werden
            if (!$("#tpopmassnber").is(':visible') || localStorage.tpopmassnber_id !== node_id) {
                localStorage.tpopmassnber_id = node_id;
                initiiereTPopMassnBer();
            }
        }
    })
    .bind("after_open.jstree", function () {
        window.apf.setzeTreehöhe();
    })
    .bind("after_close.jstree", function () {
        window.apf.setzeTreehöhe();
    })
    .bind("prepare_move.jstree", function (e, data) {
        // herkunft_parent_node muss vor dem move ermittelt werden - danach ist der parent ein anderer!
        window.apf.herkunft_parent_node = $.jstree._reference(data.rslt.o)._get_parent(data.rslt.o);
    })
    .bind("create_node.jstree", function (e, data) {
        if (data.rslt.parent[0].attributes.typ.nodeValue === "apzieljahr") {
            var Objekt = {};
            Objekt.name = "ZielJahr";
            Objekt.formular = "apziel";
            speichern(Objekt);
            $("#ZielJahr")
                .val(data.rslt.parent[0].innerText.slice(1, 5))
                .focus();
        }
    })
    .bind("move_node.jstree", function (e, data) {
        var herkunft_node,
            herkunft_node_id,
            herkunft_node_typ,
            ziel_node,
            ziel_node_id,
            ziel_node_typ,
            ziel_parent_node,
            ziel_parent_node_id;
        
        // nur aktualisieren, wenn Schreibrechte bestehen
        if (!window.apf.prüfeSchreibvoraussetzungen()) {
            return;
        }

        // Variablen setzen
        herkunft_node = data.rslt.o;
        herkunft_node_id = window.apf.erstelleIdAusDomAttributId($(herkunft_node).attr("id"));
        herkunft_node_typ = herkunft_node.attr("typ");
        ziel_node = data.rslt.r;
        ziel_node_id = window.apf.erstelleIdAusDomAttributId($(ziel_node).attr("id"));
        ziel_node_typ = ziel_node.attr("typ");
        ziel_parent_node = $.jstree._reference(data.rslt.r)._get_parent(data.rslt.r);
        if ($(ziel_parent_node).attr("id")) {
            ziel_parent_node_id = window.apf.erstelleIdAusDomAttributId($(ziel_parent_node).attr("id"));
        }

        if (herkunft_node_typ === "pop") {
            if (ziel_node_typ === "pop") {
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + ziel_node_id + '/feld=ApArtId/wert=' + ziel_parent_node_id + '/user=' + sessionStorage.User
                }).done(function () {
                    var initiierePop = require('../initiierePop');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_pop(ziel_parent_node);
                    window.apf.beschrifte_ordner_pop(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(ziel_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.pop_id = herkunft_node_id;
                    delete window.apf.pop;
                    delete window.apf.herkunft_parent_node;
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
                    var initiiereTPop = require('../initiiereTPop');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpop(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpop(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(ziel_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpop_id = herkunft_node_id;
                    delete window.apf.tpop;
                    delete window.apf.tpop_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                    var initiiereTPop = require('../initiiereTPop');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpop(ziel_node);
                    window.apf.beschrifte_ordner_tpop(window.apf.herkunft_parent_node);
                    // select steuern
                    $.jstree._reference(ziel_node).deselect_all();
                    $.jstree._reference(ziel_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpop_id = herkunft_node_id;
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
                    var initiiereTPop = require('../initiiereTPop');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpop(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpop(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(ziel_parent_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpop_id = herkunft_node_id;
                    delete window.apf.tpop;
                    delete window.apf.tpop_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                    var initiiereTPop = require('../initiiereTPop');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpop(ziel_node);
                    window.apf.beschrifte_ordner_tpop(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpop_id = herkunft_node_id;
                    delete window.apf.tpop;
                    delete window.apf.tpop_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                    var initiiereTPopMassn = require('../initiiereTPopMassn');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopmassn(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpopmassn(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(ziel_parent_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopmassn_id = herkunft_node_id;
                    delete window.apf.tpopmassn;
                    delete window.apf.tpopmassn_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                    var initiiereTPopMassn = require('../initiiereTPopMassn');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopmassn(ziel_node);
                    window.apf.beschrifte_ordner_tpopmassn(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopmassn_id = herkunft_node_id;
                    delete window.apf.tpopmassn;
                    delete window.apf.tpopmassn_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                    var initiiereTPopFeldkontr  = require('../initiiereTPopFeldkontr');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopfeldkontr(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpopfeldkontr(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontr_id = herkunft_node_id;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfeldkontr_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                    var initiiereTPopFeldkontr  = require('../initiiereTPopFeldkontr');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopfeldkontr(ziel_node);
                    window.apf.beschrifte_ordner_tpopfeldkontr(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontr_id = herkunft_node_id;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfeldkontr_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                    var initiiereTPopFeldkontr  = require('../initiiereTPopFeldkontr');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopfreiwkontr(ziel_parent_node);
                    window.apf.beschrifte_ordner_tpopfreiwkontr(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontr_id = herkunft_node_id;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfreiwkontr_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
                    localStorage.tpopfreiwkontr = true;
                    initiiereTPopFeldkontr();
                }).fail(function () {
                    melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
                });
            }
            if (ziel_node_typ === "tpop_ordner_freiwkontr") {
                var fügeTPopFeldkontrEin_4 = $.ajax({
                    type: 'post',
                    url: 'api/v1/insert/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopId/wert=' + ziel_node_id + '/user=' + sessionStorage.User
                });
                fügeTPopFeldkontrEin_4.done(function () {
                    var initiiereTPopFeldkontr  = require('../initiiereTPopFeldkontr');
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    window.apf.beschrifte_ordner_tpopfreiwkontr(ziel_node);
                    window.apf.beschrifte_ordner_tpopfreiwkontr(window.apf.herkunft_parent_node);
                    // selection steuern
                    $.jstree._reference(herkunft_node).deselect_all();
                    $.jstree._reference(herkunft_node).select_node(herkunft_node);
                    // Variablen aufräumen
                    localStorage.tpopfeldkontr_id = herkunft_node_id;
                    delete window.apf.tpopfeldkontr;
                    delete window.apf.tpopfreiwkontr_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
                    localStorage.tpopfreiwkontr = true;
                    initiiereTPopFeldkontr();
                });
                fügeTPopFeldkontrEin_4.fail(function () {
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
                    window.apf.beschrifte_ordner_beob_zugeordnet(window.apf.herkunft_parent_node);

                    // Variablen aufräumen
                    delete window.apf.beob_zugeordnet_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
                });
            }
            if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                // zugeordnet > zugeordnet
                neue_tpop_id = (ziel_node_typ === "tpop_ordner_beob_zugeordnet" ? ziel_node_id : ziel_parent_node_id);

                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=tblBeobZuordnung/tabelleIdFeld=NO_NOTE/tabelleId=' + localStorage.beob_id + '/feld=TPopId/wert=' + neue_tpop_id + '/user=' + sessionStorage.User
                }).done(function () {
                    // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                    if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                        window.apf.beschrifte_ordner_beob_zugeordnet(ziel_node);
                    } else {
                        window.apf.beschrifte_ordner_beob_zugeordnet(ziel_parent_node);
                    }
                    window.apf.beschrifte_ordner_beob_zugeordnet(window.apf.herkunft_parent_node);

                    // selection steuern
                    if (localStorage.karte_fokussieren) {
                        delete localStorage.karte_fokussieren;
                    }

                    // Variablen aufräumen
                    delete window.apf.beob_zugeordnet_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                            window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(ziel_node);
                        } else {
                            window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(ziel_parent_node);
                        }
                        window.apf.beschrifte_ordner_beob_zugeordnet(window.apf.herkunft_parent_node);

                        // Variablen aufräumen
                        delete window.apf.beob_node_ausgeschnitten;
                        delete window.apf.herkunft_parent_node;
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
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(window.apf.herkunft_parent_node);
                        if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                            window.apf.beschrifte_ordner_beob_zugeordnet(ziel_node);
                        } else {
                            window.apf.beschrifte_ordner_beob_zugeordnet(ziel_parent_node);
                        }

                        // Nicht beurteilt: Deaktivieren
                        $('#BeobNichtBeurteilt').prop('checked', false);

                        // selection steuern
                        if (localStorage.karte_fokussieren) {
                            delete localStorage.karte_fokussieren;
                        }

                        // Variablen aufräumen
                        delete window.apf.beob_node_ausgeschnitten;
                        delete window.apf.herkunft_parent_node;
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
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(window.apf.herkunft_parent_node);
                        if (ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
                            window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(ziel_node);
                        } else {
                            window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(ziel_parent_node);
                        }

                        // Nicht beurteilt: Deaktivieren
                        $('#BeobNichtBeurteilt').prop('checked', false);

                        // Variablen aufräumen
                        delete window.apf.beob_node_ausgeschnitten;
                        delete window.apf.herkunft_parent_node;
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
                    window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(window.apf.herkunft_parent_node);
                    if (ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_node);
                    } else {
                        window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_parent_node);
                    }

                    // nicht zuzuordnen deaktivieren
                    $('#BeobNichtZuordnen').prop('checked', false);

                    // Variablen aufräumen
                    delete window.apf.beob_node_ausgeschnitten;
                    delete window.apf.herkunft_parent_node;
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
                        window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(window.apf.herkunft_parent_node);
                        if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                            window.apf.beschrifte_ordner_beob_zugeordnet(ziel_node);
                        } else {
                            window.apf.beschrifte_ordner_beob_zugeordnet(ziel_parent_node);
                        }

                        // nicht zuzuordnen deaktivieren
                        $('#BeobNichtZuordnen').prop('checked', false);

                        // Variablen aufräumen
                        delete window.apf.beob_node_ausgeschnitten;
                        delete window.apf.herkunft_parent_node;
                    }).fail(function () {
                        melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                    });
                }).fail(function () {
                    melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                });
            }
        }
    });
    return jstree_erstellt.promise();
};

module.exports = returnFunction;