'use strict';

var $ = require('jquery'),
    treeKontextmenu = require('./treeKontextmenu');

var erstelleTree = function($tree_jstree, ApArtId) {
    var jstree_erstellt = $.Deferred();
    $tree_jstree({
        "json_data": {
            "ajax": {
                "url": "api/tree/ap=" + ApArtId,
                "progressive_render": true
            }
        },
        "core": {
            "open_parents": true,	// wird ein node programmatisch geöffnet, öffnen sich alle parents
            "strings": {	// Deutsche Übersetzungen
                "loading": "hole Daten...",
                "new_node": "neuer Knoten"
            }
        },
        "ui": {
            "select_limit": 1,	// nur ein Datensatz kann aufs mal gewählt werden
            "selected_parent_open": true,	// wenn Code einen node wählt, werden alle parents geöffnet
            "select_prev_on_delete": true
        },
        "search": {
            "case_insensitive": true
        },
        "sort": function(a, b) {
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
                "check_move": function(m) {
                    // hier wird bestimmt, welche drag-drop-Kombinationen zulässig sind
                    if (m.o.attr("typ") === "pop") {
                        if (m.r.attr("typ") === "pop") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else {
                            return false;
                        }
                    } else if (m.o.attr("typ") === "tpop") {
                        if (m.r.attr("typ") === "tpop") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "pop_ordner_tpop") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else {
                            return false;
                        }
                    } else if (m.o.attr("typ") === "tpopmassn") {
                        if (m.r.attr("typ") === "tpopmassn") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "tpop_ordner_massn") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else {
                            return false;
                        }
                    } else if (m.o.attr("typ") === "tpopfeldkontr") {
                        if (m.r.attr("typ") === "tpopfeldkontr") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "tpop_ordner_feldkontr") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else {
                            return false;
                        }
                    } else if (m.o.attr("typ") === "tpopfreiwkontr") {
                        if (m.r.attr("typ") === "tpopfreiwkontr") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "tpop_ordner_freiwkontr") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else {
                            return false;
                        }
                    } else if (m.o.attr("typ") === "beob_zugeordnet") {
                        if (m.r.attr("typ") === "beob_zugeordnet") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "tpop_ordner_beob_zugeordnet") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "ap_ordner_beob_nicht_beurteilt") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "beob_nicht_beurteilt") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "ap_ordner_beob_nicht_zuzuordnen") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "beob_nicht_zuzuordnen") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else {
                            return false;
                        }
                    } else if (m.o.attr("typ") === "beob_nicht_beurteilt") {
                        if (m.r.attr("typ") === "beob_zugeordnet") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "tpop_ordner_beob_zugeordnet") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "ap_ordner_beob_nicht_beurteilt") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "beob_nicht_beurteilt") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "ap_ordner_beob_nicht_zuzuordnen") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "beob_nicht_zuzuordnen") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else {
                            return false;
                        }
                    } else if (m.o.attr("typ") === "beob_nicht_zuzuordnen") {
                        if (m.r.attr("typ") === "beob_zugeordnet") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "tpop_ordner_beob_zugeordnet") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "ap_ordner_beob_nicht_beurteilt") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "beob_nicht_beurteilt") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else if (m.r.attr("typ") === "ap_ordner_beob_nicht_zuzuordnen") {
                            return {
                                after: false,
                                before: false,
                                inside: true
                            };
                        } else if (m.r.attr("typ") === "beob_nicht_zuzuordnen") {
                            return {
                                after: true,
                                before: true,
                                inside: false
                            };
                        } else {
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
        .bind("loaded.jstree", function(event, data) {
            var initiiereAp = require('./initiiereAp');
            jstree_erstellt.resolve();
            window.apf.setzeTreehöhe();
            $("#suchen").show();
            $("#exportieren_2").show();
            $("#exportieren_1").hide();
            $("#hilfe").show();
            if (window.apf.pop_zeigen) {
                $tree_jstree("select_node", "[typ='pop']#" + localStorage.pop_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese Pop geöffnet wird
                delete window.apf.pop_zeigen;
            }
            if (window.apf.popber_zeigen) {
                $tree_jstree("select_node", "[typ='popber']#" + localStorage.popber_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese Popber geöffnet wird
                delete window.apf.popber_zeigen;
            }
            if (window.apf.popmassnber_zeigen) {
                $tree_jstree("select_node", "[typ='popmassnber']#" + localStorage.popmassnber_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese popmassnber geöffnet wird
                delete window.apf.popmassnber_zeigen;
            }
            if (window.apf.tpop_zeigen) {
                $tree_jstree("select_node", "[typ='tpop']#" + localStorage.tpop_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese TPop geöffnet wird
                delete window.apf.tpop_zeigen;
            }
            if (window.apf.tpopfeldkontr_zeigen) {
                $tree_jstree("select_node", "[typ='tpopfeldkontr']#" + localStorage.tpopfeldkontr_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfeldkontr geöffnet wird
                delete window.apf.tpopfeldkontr_zeigen;
            }
            if (window.apf.tpopfreiwkontr_zeigen) {
                $tree_jstree("select_node", "[typ='tpopfreiwkontr']#" + localStorage.tpopfeldkontr_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfreiwkontr geöffnet wird
                delete window.apf.tpopfreiwkontr_zeigen;
            }
            if (window.apf.tpopmassn_zeigen) {
                $tree_jstree("select_node", "[typ='tpopmassn']#" + localStorage.tpopmassn_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassn geöffnet wird
                delete window.apf.tpopmassn_zeigen;
            }
            if (window.apf.tpopber_zeigen) {
                $tree_jstree("select_node", "[typ='tpopber']#" + localStorage.tpopber_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopber geöffnet wird
                delete window.apf.tpopber_zeigen;
            }
            if (window.apf.beob_zugeordnet_zeigen) {
                $tree_jstree("select_node", "#beob" + localStorage.beob_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob_zugeordnet geöffnet wird
                delete window.apf.beob_zugeordnet_zeigen;
            }
            if (window.apf.tpopmassnber_zeigen) {
                $tree_jstree("select_node", "[typ='tpopmassnber']#" + localStorage.tpopmassnber_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassnber geöffnet wird
                delete window.apf.tpopmassnber_zeigen;
            }
            if (window.apf.apziel_zeigen) {
                $tree_jstree("select_node", "[typ='apziel']#" + localStorage.apziel_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese apziel geöffnet wird
                delete window.apf.apziel_zeigen;
            }
            if (window.apf.zielber_zeigen) {
                $tree_jstree("select_node", "[typ='zielber']#" + localStorage.zielber_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese zielber geöffnet wird
                delete window.apf.zielber_zeigen;
            }
            if (window.apf.erfkrit_zeigen) {
                $tree_jstree("select_node", "[typ='erfkrit']#" + localStorage.erfkrit_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese erfkrit geöffnet wird
                delete window.apf.erfkrit_zeigen;
            }
            if (window.apf.jber_zeigen) {
                $tree_jstree("select_node", "[typ='jber']#" + localStorage.jber_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber geöffnet wird
                delete window.apf.jber_zeigen;
            }
            if (window.apf.jber_übersicht_zeigen) {
                $tree_jstree("select_node", "[typ='jber_uebersicht']#" + localStorage.jber_uebersicht_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber_uebersicht geöffnet wird
                delete window.apf.jber_übersicht_zeigen;
            }
            if (window.apf.ber_zeigen) {
                $tree_jstree("select_node", "[typ='ber']#" + localStorage.ber_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese ber geöffnet wird
                delete window.apf.ber_zeigen;
            }
            if (window.apf.idealbiotop_zeigen) {
                $tree_jstree("select_node", "[typ='idealbiotop']#" + localStorage.idealbiotop_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese idealbiotop geöffnet wird
                delete window.apf.idealbiotop_zeigen;
            }
            if (window.apf.assozarten_zeigen) {
                $tree_jstree("select_node", "[typ='assozarten']#" + localStorage.assozarten_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese assozarten geöffnet wird
                delete window.apf.assozarten_zeigen;
            }
            if (window.apf.beob_nicht_beurteilt_zeigen) {
                $tree_jstree("select_node", "#beob" + localStorage.beob_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
                delete window.apf.beob_nicht_beurteilt_zeigen;
            }
            if (window.apf.beob_nicht_zuzuordnen_zeigen) {
                $tree_jstree("select_node", "#beob" + localStorage.beob_id);
                // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
                delete window.apf.beob_nicht_zuzuordnen_zeigen;
            }
            if (window.apf.ap_zeigen) {
                initiiereAp();
                // diese Markierung entfernen, damit das nächste mal nicht mehr dieser AP geöffnet wird
                delete window.apf.ap_zeigen;
            }
        })
        // auch auf Mobilgeräten soll das Kontextmenü zugänglich sein!
        .hammer().bind("hold doubletap", function(event) {
            // auf PC's verhindern: Menu erscheint sonst beim Scrollen
            if ($(window).width() < 1000) {
                setTimeout(function() {
                    $tree_jstree('get_selected').children('a').trigger('contextmenu');
                }, 500);
            }
        })
        .bind("select_node.jstree", function(e, data) {
            var node,
                initiiere_beob          = require('./initiiereBeob'),
                initiiere_idealbiotop   = require('./initiiereIdealbiotop'),
                initiiereAp             = require('./initiiereAp'),
                initiierePop            = require('./initiiereBeob'),
                initiiereApziel         = require('./initiiereApziel'),
                initiiereZielber        = require('./initiiereZielber'),
                initiiereErfkrit        = require('./initiiereErfkrit'),
                initiiereJber           = require('./initiiereJber'),
                initiiereJberUebersicht = require('./initiiereJberUebersicht'),
                initiiereBer            = require('./initiiereBer'),
                initiiereAssozarten     = require('./initiiereAssozarten'),
                initiierePopMassnBer    = require('./initiierePopMassnBer'),
                initiiereTPop           = require('./initiiereTPop'),
                initiierePopBer         = require('./initiierePopBer'),
                initiiereTPopFeldkontr  = require('./initiiereTPopFeldkontr'),
                initiiereTPopMassn      = require('./initiiereTPopMassn'),
                initiiereTPopMassnBer   = require('./initiiereTPopMassnBer'),
                initiiereTPopBer        = require('./initiiereTPopBer');
            delete localStorage.tpopfreiwkontr;	// Erinnerung an letzten Klick im Baum löschen
            node = data.rslt.obj;
            var node_typ = node.attr("typ");
            // in der ID des Nodes enthaltene Texte müssen entfernt werden
            var node_id = window.apf.erstelleIdAusDomAttributId(node.attr("id"));
            $.jstree._reference(node).open_node(node);
            if (node_typ.slice(0, 3) === "ap_" || node_typ === "apzieljahr") {
                // verhindern, dass bereits offene Seiten nochmals geöffnet werden
                if (!$("#ap").is(':visible') || localStorage.ap_id !== node_id) {
                    localStorage.ap_id = node_id;
                    delete localStorage.pop_id;
                    initiiereAp();
                }
            } else if (node_typ === "pop" || node_typ.slice(0, 4) === "pop_") {
                // verhindern, dass bereits offene Seiten nochmals geöffnet werden
                if (!$("#pop").is(':visible') || localStorage.pop_id !== node_id) {
                    localStorage.pop_id = node_id;
                    initiierePop();
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
                    // wenn noch kein Datensatz existiert erstellt ihn initiiere_idealbiotop
                    initiiere_idealbiotop();
                }
            } else if (node_typ === "assozarten") {
                // verhindern, dass bereits offene Seiten nochmals geöffnet werden
                if (!$("#assozarten").is(':visible') || localStorage.assozarten_id !== node_id) {
                    localStorage.assozarten_id = node_id;
                    initiiereAssozarten();
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
        .bind("after_open.jstree", function(e, data) {
            window.apf.setzeTreehöhe();
        })
        .bind("after_close.jstree", function(e, data) {
            window.apf.setzeTreehöhe();
        })
        .bind("prepare_move.jstree", function(e, data) {
            // herkunft_parent_node muss vor dem move ermittelt werden - danach ist der parent ein anderer!
            window.apf.herkunft_parent_node = $.jstree._reference(data.rslt.o)._get_parent(data.rslt.o);
        })
        .bind("create_node.jstree", function(e, data) {
            if (data.rslt.parent[0].attributes.typ.nodeValue === "apzieljahr") {
                var Objekt = {};
                Objekt.name = "ZielJahr";
                Objekt.formular = "apziel";
                window.apf.speichern(Objekt);
                $("#ZielJahr")
                    .val(data.rslt.parent[0].innerText.slice(1, 5))
                    .focus();
            }
        })
        .bind("move_node.jstree", function(e, data) {
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
                    var fügePopEin = $.ajax({
                        type: 'post',
                        url: 'php/pop_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "ap_art_id": ziel_parent_node_id,
                            "pop_id": ziel_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügePopEin.always(function() {
                        var initiierePop = require('./initiierePop');
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
                    });
                    fügePopEin.fail(function(data) {
                        //window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                        console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
                    });
                }
                if (ziel_node_typ === "tpop") {
                    var fügeTPopEin = $.ajax({
                        type: 'post',
                        url: 'php/tpop_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "pop_id": ziel_parent_node_id,
                            "tpop_id": ziel_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopEin.always(function() {
                        var initiiereTPop = require('./initiiereTPop');
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
                    });
                    fügeTPopEin.fail(function(data) {
                        //window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                        console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
                    });
                }
                if (ziel_node_typ === "pop_ordner_tpop") {
                    var fügeTPopEin_2 = $.ajax({
                        type: 'post',
                        url: 'php/tpop_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "pop_id": ziel_node_id,
                            "tpop_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopEin_2.always(function() {
                        var initiiereTPop = require('./initiiereTPop');
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
                    });
                    fügeTPopEin_2.fail(function(data) {
                        //window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                        console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
                    });
                }
            }
            if (herkunft_node_typ === "tpop") {
                if (ziel_node_typ === "tpop") {
                    var fügeTPopEin_3 = $.ajax({
                        type: 'post',
                        url: 'php/tpop_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "pop_id": ziel_parent_node_id,
                            "tpop_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopEin_3.always(function() {
                        var initiiereTPop = require('./initiiereTPop');
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
                    });
                    fügeTPopEin_3.fail(function(data) {
                        //window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                        console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
                    });
                }
                if (ziel_node_typ === "pop_ordner_tpop") {
                    var fügeTPopEin_4 = $.ajax({
                        type: 'post',
                        url: 'php/tpop_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "pop_id": ziel_node_id,
                            "tpop_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopEin_4.always(function() {
                        var initiiereTPop = require('./initiiereTPop');
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
                    });
                    fügeTPopEin_4.fail(function(data) {
                        //window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
                        console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
                    });
                }
            }
            if (herkunft_node_typ === "tpopmassn") {
                if (ziel_node_typ === "tpopmassn") {
                    var fügeTPopMassnEin = $.ajax({
                        type: 'post',
                        url: 'php/tpopmassn_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "tpop_id": ziel_parent_node_id,
                            "tpopmassn_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopMassnEin.always(function() {
                        var initiiereTPopMassn = require('./initiiereTPopMassn');
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
                    });
                    fügeTPopMassnEin.fail(function(data) {
                        //window.apf.melde("Fehler: Die Massnahme wurde nicht verschoben");
                        console.log("Fehler: Die Massnahme wurde nicht verschoben");
                    });
                }
                if (ziel_node_typ === "tpop_ordner_massn") {
                    var fügeTPopMassnEin_2 = $.ajax({
                        type: 'post',
                        url: 'php/tpopmassn_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "tpop_id": ziel_node_id,
                            "tpopmassn_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopMassnEin_2.always(function() {
                        var initiiereTPopMassn = require('./initiiereTPopMassn');
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
                    });
                    fügeTPopMassnEin_2.fail(function(data) {
                        //window.apf.melde("Fehler: Die Massnahme wurde nicht verschoben");
                        console.log("Fehler: Die Massnahme wurde nicht verschoben");
                    });
                }
            }
            if (herkunft_node_typ === "tpopfeldkontr") {
                if (ziel_node_typ === "tpopfeldkontr") {
                    var fügeTPopFeldkontrEin = $.ajax({
                        type: 'post',
                        url: 'php/tpopfeldkontr_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "tpop_id": ziel_parent_node_id,
                            "tpopfeldkontr_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopFeldkontrEin.always(function() {
                        var initiiereTPopFeldkontr  = require('./initiiereTPopFeldkontr');
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
                    });
                    fügeTPopFeldkontrEin.fail(function(data) {
                        //window.apf.melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
                        console.log('Fehler: Die Feldkontrolle wurde nicht verschoben');
                    });
                }
                if (ziel_node_typ === "tpop_ordner_feldkontr") {
                    var fügeTPopFeldkontrEin_2 = $.ajax({
                        type: 'post',
                        url: 'php/tpopfeldkontr_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "tpop_id": ziel_node_id,
                            "tpopfeldkontr_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopFeldkontrEin_2.always(function() {
                        var initiiereTPopFeldkontr  = require('./initiiereTPopFeldkontr');
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
                    });
                    fügeTPopFeldkontrEin_2.fail(function() {
                        //window.apf.melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
                        console.log('Fehler: Die Feldkontrolle wurde nicht verschoben');
                    });
                }
            }
            if (herkunft_node_typ === "tpopfreiwkontr") {
                if (ziel_node_typ === "tpopfreiwkontr") {
                    var fügeTPopFeldkontrEin_3 = $.ajax({
                        type: 'post',
                        url: 'php/tpopfeldkontr_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "tpop_id": ziel_parent_node_id,
                            "tpopfeldkontr_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopFeldkontrEin_3.always(function() {
                        var initiiereTPopFeldkontr  = require('./initiiereTPopFeldkontr');
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
                    });
                    fügeTPopFeldkontrEin_3.fail(function() {
                        //window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
                        console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben');
                    });
                }
                if (ziel_node_typ === "tpop_ordner_freiwkontr") {
                    var fügeTPopFeldkontrEin_4 = $.ajax({
                        type: 'post',
                        url: 'php/tpopfeldkontr_einfuegen.php',
                        dataType: 'json',
                        data: {
                            "tpop_id": ziel_node_id,
                            "tpopfeldkontr_id": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    fügeTPopFeldkontrEin_4.always(function() {
                        var initiiereTPopFeldkontr  = require('./initiiereTPopFeldkontr');
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
                    fügeTPopFeldkontrEin_4.fail(function() {
                        //window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
                        console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben');
                    });
                }
            }
            if (herkunft_node_typ === "beob_zugeordnet") {
                // zugeordnet
                if (ziel_node_typ === "beob_nicht_beurteilt" || ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
                    // zugeordnet > nicht beurteilt
                    var ordneBeobachtungZu = $.ajax({
                        type: 'post',
                        url: 'php/beob_zuordnung_delete.php',
                        dataType: 'json',
                        data: {
                            "id": herkunft_node_id
                        }
                    });
                    ordneBeobachtungZu.always(function() {
                        var initiiere_beob = require('./initiiereBeob');
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
                        // beob initiieren
                        initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_beurteilt");
                        // Variablen aufräumen
                        delete window.apf.beob_zugeordnet_node_ausgeschnitten;
                        delete window.apf.herkunft_parent_node;
                    });
                    ordneBeobachtungZu.fail(function() {
                        //window.apf.melde("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
                        console.log("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
                    });
                }
                if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                    // zugeordnet > zugeordnet
                    if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                        neue_tpop_id = ziel_node_id;
                    } else {
                        neue_tpop_id = ziel_parent_node_id;
                    }
                    var ordneBeobachtungZu_2 = $.ajax({
                        type: 'post',
                        url: 'php/beob_update.php',
                        dataType: 'json',
                        data: {
                            "id": localStorage.beob_id,
                            "Feld": "TPopId",
                            "Wert": neue_tpop_id,
                            "user": sessionStorage.User
                        }
                    });
                    ordneBeobachtungZu_2.always(function() {
                        var initiiere_beob = require('./initiiereBeob');
                        // Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
                        if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                            window.apf.beschrifte_ordner_beob_zugeordnet(ziel_node);
                        } else {
                            window.apf.beschrifte_ordner_beob_zugeordnet(ziel_parent_node);
                        }
                        window.apf.beschrifte_ordner_beob_zugeordnet(window.apf.herkunft_parent_node);
                        // selection steuern
                        if (!localStorage.karte_fokussieren) {
                            initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
                        } else {
                            delete localStorage.karte_fokussieren;
                        }
                        // Variablen aufräumen
                        delete window.apf.beob_zugeordnet_node_ausgeschnitten;
                        delete window.apf.herkunft_parent_node;
                    });
                    ordneBeobachtungZu_2.fail(function() {
                        //window.apf.melde("Fehler: Die Beobachtung wurde nicht verschoben");
                        console.log('Fehler: Die Beobachtung wurde nicht verschoben');
                    });
                }
                if (ziel_node_typ === "beob_nicht_zuzuordnen" || ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
                    // zugeordnet > nicht zuzuordnen
                    var ordneBeobachtungZu_3 = $.ajax({
                        type: 'post',
                        url: 'php/beob_update.php',
                        dataType: 'json',
                        data: {
                            "id": herkunft_node_id,
                            "Feld": "BeobNichtZuordnen",
                            "Wert": 1,
                            "user": sessionStorage.User
                        }
                    });
                    ordneBeobachtungZu_3.always(function() {
                        // TPopId null setzen
                        var setzeTpopid = $.ajax({
                            type: 'post',
                            url: 'php/beob_update.php',
                            dataType: 'json',
                            data: {
                                "id": herkunft_node_id,
                                "Feld": "TPopId",
                                "Wert": "",
                                "user": sessionStorage.User
                            }
                        });
                        setzeTpopid.always(function() {
                            var initiiere_beob = require('./initiiereBeob');
                            // aus unerfindlichen Gründen läuft der success callback nicht, darum done
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
                            // Beob initiieren
                            initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_zuzuordnen");
                            // Variablen aufräumen
                            delete window.apf.beob_node_ausgeschnitten;
                            delete window.apf.herkunft_parent_node;
                        });
                        setzeTpopid.fail(function() {
                            console.log("fehler beim Leeren von TPopId");
                        });
                    });
                    ordneBeobachtungZu_3.fail(function() {
                        //window.apf.melde("Fehler: Die Beobachtung wurde nicht verschoben");
                        console.log('Fehler: Die Beobachtung wurde nicht verschoben');
                    });
                }
            }
            if (herkunft_node_typ === "beob_nicht_beurteilt") {
                // nicht beurteilt
                if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                    // nicht beurteilt > zugeordnet
                    if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                        neue_tpop_id = ziel_node_id;
                    } else {
                        neue_tpop_id = ziel_parent_node_id;
                    }
                    // Zuerst eine neue Zuordnung erstellen
                    var insertZuordnung = $.ajax({
                        type: 'post',
                        url: 'php/beob_zuordnung_insert.php',
                        dataType: 'json',
                        data: {
                            "no_note": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    insertZuordnung.always(function() {
                        // jetzt aktualisieren
                        var updateBeob = $.ajax({
                            type: 'post',
                            url: 'php/beob_update.php',
                            dataType: 'json',
                            data: {
                                "id": herkunft_node_id,
                                "Feld": "TPopId",
                                "Wert": neue_tpop_id,
                                "user": sessionStorage.User
                            }
                        });
                        updateBeob.always(function() {
                            var initiiere_beob = require('./initiiereBeob');
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
                            // selection steuern
                            if (!localStorage.karte_fokussieren) {
                                initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
                            } else {
                                delete localStorage.karte_fokussieren;
                            }
                            // Variablen aufräumen
                            delete window.apf.beob_node_ausgeschnitten;
                            delete window.apf.herkunft_parent_node;
                        });
                        updateBeob.fail(function() {
                            //window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                            console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
                        });
                    });
                    insertZuordnung.fail(function() {
                        //window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                        console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
                    });
                }
                if (ziel_node_typ === "beob_nicht_zuzuordnen" || ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
                    // nicht beurteilt > nicht zuordnen
                    var insertZuordnung_2 = $.ajax({
                        type: 'post',
                        url: 'php/beob_zuordnung_insert.php',
                        dataType: 'json',
                        data: {
                            "no_note": herkunft_node_id,
                            "user": sessionStorage.User
                        }
                    });
                    insertZuordnung_2.always(function() {
                        // jetzt aktualisieren
                        var updateBeob_2 = $.ajax({
                            type: 'post',
                            url: 'php/beob_update.php',
                            dataType: 'json',
                            data: {
                                "id": herkunft_node_id,
                                "Feld": "BeobNichtZuordnen",
                                "Wert": 1,
                                "user": sessionStorage.User
                            }
                        });
                        updateBeob_2.always(function() {
                            var initiiere_beob = require('./initiiereBeob');
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
                            // Beob initiieren
                            initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_zuzuordnen");
                            // Variablen aufräumen
                            delete window.apf.beob_node_ausgeschnitten;
                            delete window.apf.herkunft_parent_node;
                        });
                        updateBeob_2.fail(function() {
                            console.log("Fehler: Die Beobachtung wurde nicht zugeordnet");
                        });
                    });
                    insertZuordnung_2.fail(function() {
                        //window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                        console.log("Fehler: Die Beobachtung wurde nicht zugeordnet");
                    });
                }
            }
            if (herkunft_node_typ === "beob_nicht_zuzuordnen") {
                // nicht zuzuordnen
                if (ziel_node_typ === "beob_nicht_beurteilt" || ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
                    // nicht zuzuordnen > nicht beurteilt
                    var deleteZuordnung = $.ajax({
                        type: 'post',
                        url: 'php/beob_zuordnung_delete.php',
                        dataType: 'json',
                        data: {
                            "id": herkunft_node_id
                        }
                    });
                    deleteZuordnung.always(function() {
                        var initiiere_beob = require('./initiiereBeob');
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
                        // selektieren
                        initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_beurteilt");
                        // Variablen aufräumen
                        delete window.apf.beob_node_ausgeschnitten;
                        delete window.apf.herkunft_parent_node;
                    });
                    deleteZuordnung.fail(function() {
                        //window.apf.melde("Fehler: Die Zuordnung der Beobachtung wurde nicht entfernt");
                        console.log('Fehler: Die Zuordnung der Beobachtung wurde nicht entfernt');
                    });
                }
                if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                    // nicht zuzuordnen > zugeordnet
                    var neue_tpop_id;
                    if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
                        neue_tpop_id = ziel_node_id;
                    } else {
                        neue_tpop_id = ziel_parent_node_id;
                    }
                    var updateBeob_3 = $.ajax({
                        type: 'post',
                        url: 'php/beob_update.php',
                        dataType: 'json',
                        data: {
                            "id": herkunft_node_id,
                            "Feld": "BeobNichtZuordnen",
                            "Wert": "",
                            "user": sessionStorage.User
                        }
                    });
                    updateBeob_3.always(function() {
                        var updateBeob_4 = $.ajax({
                            type: 'post',
                            url: 'php/beob_update.php',
                            dataType: 'json',
                            data: {
                                "id": herkunft_node_id,
                                "Feld": "TPopId",
                                "Wert": neue_tpop_id,
                                "user": sessionStorage.User
                            }
                        });
                        updateBeob_4.always(function() {
                            var initiiere_beob = require('./initiiereBeob');
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
                            // selection steuern
                            initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
                            // Variablen aufräumen
                            delete window.apf.beob_node_ausgeschnitten;
                            delete window.apf.herkunft_parent_node;
                        });
                        updateBeob_4.fail(function() {
                            //window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                            console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
                        });
                    });
                    updateBeob_3.fail(function() {
                        //window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
                        console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
                    });
                }
            }
        });
    return jstree_erstellt.promise();
};

module.exports = erstelleTree;