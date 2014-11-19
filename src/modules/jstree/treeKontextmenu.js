/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                                         = require('underscore'),
    $                                         = require('jquery'),
    zeigeTPopAufGmap                          = require('../gmap/zeigeTPop'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    frageObUndeleteDatensatz                  = require('../frageObUndeleteDatensatz'),
    melde                                     = require('../melde'),
    zeigeBeobKoordinatenImGisBrowser          = require('../zeigeBeobKoordinatenImGisBrowser'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuePop                             = require('./insertNeuePop'),
    loeschePop                                = require('./loeschePop'),
    schneidePopAus                            = require('./schneidePopAus'),
    fuegeAusgeschnittenePopEin                = require('./fuegeAusgeschnittenePopEin'),
    insertNeuenPopber                         = require('./insertNeuenPopber'),
    loeschePopber                             = require('./loeschePopber'),
    insertNeuenPopmassnber                    = require('./insertNeuenPopmassnber'),
    loeschePopmassnber                        = require('./loeschePopmassnber'),
    insertNeueTpop                            = require('./insertNeueTpop'),
    loescheTpop                               = require('./loescheTpop'),
    schneideTpopAus                           = require('./schneideTpopAus'),
    kopiereTpop                               = require('./kopiereTpop'),
    insertKopierteTpop                        = require('./insertKopierteTpop'),
    insertNeueFeldkontrolle                   = require('./insertNeueFeldkontrolle'),
    loescheFeldkontrolle                      = require('./loescheFeldkontrolle'),
    kopiereFeldkontrBiotop                    = require('./kopiereFeldkontrBiotop'),
    insertKopiertesFeldkontrBiotop            = require('./insertKopiertesFeldkontrBiotop'),
    insertNeuesApziel                         = require('./insertNeuesApziel'),
    loescheApziel                             = require('./loescheApziel'),
    insertNeuenZielber                        = require('./insertNeuenZielber'),
    loescheZielber                            = require('./loescheZielber'),
    insertNeuesErfkrit                        = require('./insertNeuesErfkrit'),
    loescheErfkrit                            = require('./loescheErfkrit'),
    insertNeuenBer                            = require('./insertNeuenBer'),
    loescheBer                                = require('./loescheBer'),
    insertNeuenJber                           = require('./insertNeuenJber'),
    loescheJber                               = require('./loescheJber'),
    insertNeuenJberuebersicht                 = require('./insertNeuenJberuebersicht'),
    loescheJberuebersicht                     = require('./loescheJberuebersicht'),
    insertNeueAssozart                        = require('./insertNeueAssozart'),
    loescheAssozart                           = require('./loescheAssozart'),
    zeigePopsAufOlmap                         = require('./zeigePopsAufOlmap'),
    zeigePopsAufGmap                          = require('./zeigePopsAufGmap'),
    zeigePopAufOlmap                          = require('./zeigePopAufOlmap'),
    zeigePopAufGmap                           = require('./zeigePopAufGmap'),
    zeigeTpopsAufOlmap                        = require('./zeigeTpopsAufOlmap'),
    zeigeTpopAufOlmap                         = require('./zeigeTpopAufOlmap'),
    verorteTpopAufOlmap                       = require('./verorteTpopAufOlmap'),
    zeigeTpopAufGmap                          = require('./zeigeTpopAufGmap'),
    verorteTpopAufGmap                        = require('./verorteTpopAufGmap');

module.exports = function (node) {
    var items,
        aktiverNode,
        aktiverNodeText,
        parentNode,
        parentNodeText,
        grandparentNode,
        label;

    // relevante nodes zwischenspeichern
    aktiverNode     = node;
    aktiverNodeText = $.jstree._reference(aktiverNode).get_text(aktiverNode);
    // parent nur ermitteln, wenn parents exisiteren - sonst gibt es einen Fehler
    if ($(aktiverNode).attr("typ").slice(0, 8) !== "apOrdner" && $(aktiverNode).attr("typ") !== "idealbiotop") {
        parentNode     = $.jstree._reference(aktiverNode)._get_parent(aktiverNode);
        parentNodeText = $.jstree._reference(parentNode).get_text(parentNode);
    }
    switch ($(aktiverNode).attr("typ")) {
    case "apOrdnerPop":
        items = {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon":  "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neue Population",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuePop(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            },
            "GeoAdminMaps": {
                "label":            "auf CH-Karten zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_gelb.png",
                "action": function () {
                    zeigePopsAufOlmap($(aktiverNode).attr("id"));
                }
            },
            "GoogleMaps": {
                "label":            "auf Google-Karten zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon.png",
                "action": function () {
                    zeigePopsAufGmap($(aktiverNode).attr("id"));
                }
            }
        };
        if (window.apf.popZumVerschiebenGemerkt) {
            items.einfuegen = {
                "label":            "'" + window.apf.popBezeichnung + "' einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    fuegeAusgeschnittenePopEin($(aktiverNode).attr("id"));
                }
            };
        }
        return items;
    case "apOrdnerApziel":
        return {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon":  "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neues Ziel",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuesApziel(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
    case "apzieljahr":
        return {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon":  "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neues Ziel",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuesApziel(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            }
        };
    case "apziel":
        return {
            "neu": {
                "label": "neues Ziel",
                "icon":  "style/images/neu.png",
                "action": function () {
                    grandparentNode = $.jstree._reference(parentNode)._get_parent(parentNode);
                    insertNeuesApziel(aktiverNode, parentNode, $(grandparentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheApziel(aktiverNode, parentNode);
                }
            }
        };
    case "zielberOrdner":
        return {
            "neu": {
                "label": "neuer Ziel-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenZielber(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
    case "zielber":
        return {
            "neu": {
                "label": "neuer Ziel-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenZielber(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheZielber(aktiverNode, parentNode);
                }
            }
        };
    case "apOrdnerErfkrit":
        return {
            "neu": {
                "label": "neues Erfolgskriterium",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuesErfkrit(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
    case "erfkrit":
        return {
            "neu": {
                "label": "neues Erfolgskriterium",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuesErfkrit(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheErfkrit(aktiverNode, parentNode);
                }
            }
        };
    case "apOrdnerJber":
        return {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon":  "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neuer AP-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenJber(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
    case "jber":
        items = {
            "neu": {
                "label": "neuer AP-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenJber(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheJber(aktiverNode, parentNode);
                }
            }
        };
        // Wenn noch keine existiert und ein Jahr erfasst wurde, kann einen neue Übersicht zu allen Arten erstellt werden
        if ($.jstree._reference(aktiverNode)._get_children(aktiverNode).length === 0 && !isNaN($.jstree._reference(aktiverNode).get_text(aktiverNode))) {
            items.neuJberUebersicht = {
                "label":            "neue Übersicht zu allen Arten",
                "separator_before": true,
                "icon":             "style/images/neu.png",
                "action": function () {
                    var jahr = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    insertNeuenJberuebersicht(aktiverNode, parentNode, jahr);
                }
            };
        }
        return items;
    case "jberUebersicht":
        return {
            "loeschen": {
                "label": "lösche Übersicht zu allen Arten",
                "icon":  "style/images/loeschen.png",
                "action": function () {
                    loescheJberuebersicht(aktiverNode);
                }
            }
        };
    case "apOrdnerBer":
        return {
            "neu": {
                "label": "neuer Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenBer(aktiverNode, parentNode, erstelleIdAusDomAttributId($(aktiverNode).attr("id")));
                }
            }
        };
    case "ber":
        return {
            "neu": {
                "label": "neuer Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenBer(aktiverNode, parentNode, erstelleIdAusDomAttributId($(parentNode).attr("id")));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheBer(aktiverNode, parentNode);
                }
            }
        };
    case "apOrdnerAssozarten":
        return {
            "neu": {
                "label": "neue assoziierte Art",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeueAssozart(aktiverNode, parentNode, erstelleIdAusDomAttributId($(aktiverNode).attr("id")));
                }
            }
        };
    case "assozarten":
        return {
            "neu": {
                "label": "neue assoziierte Art",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeueAssozart(aktiverNode, parentNode, erstelleIdAusDomAttributId($(parentNode).attr("id")));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheAssozart(aktiverNode, parentNode);
                }
            }
        };
    case "pop":
        items = {
            "neu": {
                "label": "neue Population",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuePop(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loeschePop(aktiverNode, parentNode);
                }
            },
            "GeoAdminMaps": {
                "label":            "auf CH-Karten zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_gelb.png",
                "action": function () {
                    zeigePopAufOlmap($(aktiverNode).attr("id"));
                }
            },
            "GoogleMaps": {
                "label":            "auf Google-Karten zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon.png",
                "action": function () {
                    zeigePopAufGmap($(aktiverNode).attr("id"));
                }
            }
        };
        if (!window.apf.popZumVerschiebenGemerkt) {
            items.ausschneiden = {
                "label":            "zum Verschieben merken",
                "separator_before": true,
                "icon":             "style/images/ausschneiden.png",
                "action": function () {
                    schneidePopAus(aktiverNode);
                }
            };
        }
        if (window.apf.popZumVerschiebenGemerkt) {
            items.einfuegen = {
                "label":            "'" + window.apf.popBezeichnung + "' einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    fuegeAusgeschnittenePopEin($(parentNode).attr("id"));
                }
            };
        }
        return items;
    case "popOrdnerTpop":
        items = {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon":  "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neue Teilpopulation",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeueTpop(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            },
            "GeoAdminMaps": {
                "label":            "auf CH-Karten zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_gelb.png",
                "action": function () {
                    zeigeTpopsAufOlmap($(aktiverNode).attr("id"));
                }
            },
            "GoogleMaps": {
                "label":            "auf Google-Karten zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon.png",
                "action": function () {
                    var getPopKarte_2 = $.ajax({
                        type: 'get',
                        url: 'api/v1/popKarte/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    });
                    getPopKarte_2.done(function (data) {
                        if (data && data.length > 0) {
                            zeigeTPopAufGmap(data);
                        } else {
                            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                        }
                    });
                    getPopKarte_2.fail(function () {
                        melde("Fehler: Keine Teilpopulationen erhalten");
                    });
                }
            }
        };
        if (window.apf.tpopNodeAusgeschnitten) {
            items.einfuegen = {
                "label":            $.jstree._reference(window.apf.tpopNodeAusgeschnitten).get_text(window.apf.tpopNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopNodeKopiert) {
            label = window.apf.tpopObjektKopiert.TPopNr || "(keine Nr.)";
            label += ": ";
            label += (window.apf.tpopObjektKopiert.TPopFlurname || "(kein Flurname)");
            label += " einfügen";
            items.einfuegen = {
                //"label": $.jstree._reference(window.apf.tpopNodeKopiert).get_text(window.apf.tpopNodeKopiert) + " einfügen",
                "label":            label,
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    insertKopierteTpop(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            };
        }
        return items;
    case "tpop":
        items = {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon":  "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neue Teilpopulation",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeueTpop(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheTpop(aktiverNode, parentNode);
                }
            },
            "GeoAdminMaps": {
                "label":            "auf CH-Karten zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_gelb.png",
                "action": function () {
                    zeigeTpopAufOlmap($(aktiverNode).attr("id"));
                }
            },
            "verortenGeoAdmin": {
                "label":            "auf CH-Karten verorten",
                "separator_before": true,
                "icon":             "style/images/flora_icon_rot.png",
                "action": function () {
                    verorteTpopAufOlmap($(aktiverNode).attr("id"));
                }
            },
            "GoogleMaps": {
                "label":            "auf Google-Karten zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon.png",
                "action": function () {
                    zeigeTpopAufGmap($(aktiverNode).attr("id"));
                }
            },
            "verorten": {
                "label":            "auf Google-Karten verorten",
                "separator_before": true,
                "icon":             "style/images/flora_icon_rot.png",
                "action": function () {
                    verorteTpopAufGmap($(aktiverNode).attr("id"));
                }
            },
            "GisBrowser": {
                "label":            "im GIS-Browser zeigen",
                "separator_before": true,
                "icon":             "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.tpopNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label":            "ausschneiden",
                "separator_before": true,
                "icon":             "style/images/ausschneiden.png",
                "action": function () {
                    schneideTpopAus(aktiverNode);
                }
            };
        }
        if (!window.apf.tpopNodeAusgeschnitten) {
            items.kopieren = {
                "label":            "kopieren",
                "separator_before": true,
                "icon":             "style/images/kopieren.png",
                "action": function () {
                    kopiereTpop(aktiverNode);
                }
            };
        }
        if (window.apf.tpopNodeKopiert) {
            label = window.apf.tpopObjektKopiert.TPopNr || "(keine Nr.)";
            label += ": ";
            label += (window.apf.tpopObjektKopiert.TPopFlurname || "(kein Flurname)");
            label += " einfügen";
            items.einfuegen = {
                "label":            label,
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    insertKopierteTpop(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            };
        }
        if (window.apf.tpopNodeAusgeschnitten) {
            items.einfuegen = {
                "label":            $.jstree._reference(window.apf.tpopNodeAusgeschnitten).get_text(window.apf.tpopNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopNodeAusgeschnitten, parentNode, "first", false);
                }
            };
        }
        return items;
    case "popOrdnerPopber":
        return {
            "neu": {
                "label": "neuer Populations-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenPopber(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
    case "popber":
        return {
            "neu": {
                "label": "neuer Populations-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenPopber(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loeschePopber(aktiverNode, parentNode);
                }
            }
        };
    case "popOrdnerMassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenPopmassnber(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
    case "popmassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenPopmassnber(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loeschePopmassnber(aktiverNode, parentNode);
                }
            }
        };
    case "tpopOrdnerFeldkontr":
        items = {
            "neu": {
                "label": "neue Feldkontrolle",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeueFeldkontrolle(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
        if (window.apf.tpopfeldkontrNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontrNodeAusgeschnitten).get_text(window.apf.tpopfeldkontrNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopfeldkontrNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopfeldkontrNodeKopiert) {
            items.einfuegen = {
                "label":            $.jstree._reference(window.apf.tpopfeldkontrNodeKopiert).get_text(window.apf.tpopfeldkontrNodeKopiert) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontrNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = window.apf.erstelleLabelFuerFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopfeldkontr":
        items = {
            "neu": {
                "label": "neue Feldkontrolle",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeueFeldkontrolle(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheFeldkontrolle(aktiverNode, parentNode);
                }
            },
            "biotop_kopieren": {
                "label":            "Biotop kopieren",
                "separator_before": true,
                "icon":             "style/images/kopieren.png",
                "action": function () {
                    kopiereFeldkontrBiotop();
                }
            }
        };
        if (window.apf.feldkontrBiotop) {
            items.biotopEinfuegen = {
                "label":            "Biotop einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    insertKopiertesFeldkontrBiotop($(aktiverNode).attr("id"));
                }
            };
        }
        if (!window.apf.tpopfeldkontrNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "Feldkontrolle ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label":            "ausschneiden",
                "separator_before": true,
                "icon":             "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfeldkontrNodeAusgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopfeldkontrNodeKopiert;
                    delete window.apf.tpopfeldkontr_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopfeldkontrNodeAusgeschnitten) {
            items.kopieren = {
                "label":            "kopieren",
                "separator_before": true,
                "icon":             "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfeldkontrNodeKopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopFeldkontr_2 = $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontrNodeKopiert).attr("id"))
                    });
                    getTPopFeldkontr_2.done(function (data) {
                        window.apf.tpopfeldkontr_objekt_kopiert = data[0];
                    });
                    getTPopFeldkontr_2.fail(function () {
                        melde("Fehler: Die Feldkontrolle wurde nicht kopiert");
                    });
                }
            };
        }
        if (window.apf.tpopfeldkontrNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontrNodeAusgeschnitten).get_text(window.apf.tpopfeldkontrNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopfeldkontrNodeAusgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.tpopfeldkontrNodeKopiert) {
            items.einfuegen = {
                "label":            $.jstree._reference(window.apf.tpopfeldkontrNodeKopiert).get_text(window.apf.tpopfeldkontrNodeKopiert) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontrNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = window.apf.erstelleLabelFuerFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopOrdnerFreiwkontr":
        items = {
            "neu": {
                "label": "neue Freiwilligen-Kontrolle",
                "icon":  "style/images/neu.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrtyp=tpopfreiwkontr/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp  = "tpopfreiwkontr",
                            beschriftung = "neue Freiwilligen-Kontrolle";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
                    });
                }
            }
        };
        if (window.apf.tpopfreiwkontrNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontrNodeAusgeschnitten).get_text(window.apf.tpopfreiwkontrNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopfreiwkontrNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopfreiwkontrNodeKopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontrNodeKopiert).get_text(window.apf.tpopfreiwkontrNodeKopiert) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontrNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp = "tpopfreiwkontr",
                            beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopfreiwkontr":
        items = {
            "neu": {
                "label": "neue Freiwilligen-Kontrolle",
                "icon":  "style/images/neu.png",
                "action": function () {
                    var insertTPopFeldKontr_4 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrtyp=tpopfreiwkontr/user=' + sessionStorage.user
                    });
                    insertTPopFeldKontr_4.done(function (id) {
                        var strukturtyp = "tpopfreiwkontr",
                            beschriftung = "neue Freiwilligen-Kontrolle";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopFeldKontr_4.fail(function () {
                        melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
                    });
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:    'auto',
                        width:     400,
                        modal:     true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted     = window.apf.tpopfeldkontr;
                                window.apf.deleted.typ = "tpopfreiwkontr";
                                $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/tabelleIdFeld=TPopKontrId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                }).done(function () {
                                    delete localStorage.tpopfeldkontrId;
                                    delete localStorage.tpopfreiwkontr;
                                    delete window.apf.tpopfeldkontr;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerTpopfreiwkontr(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wurde gelöscht.");
                                }).fail(function () {
                                    melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
        if (!window.apf.tpopfreiwkontrNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label":            "ausschneiden",
                "separator_before": true,
                "icon":             "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfreiwkontrNodeAusgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopfreiwkontrNodeKopiert;
                    delete window.apf.tpopfreiwkontr_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopfreiwkontrNodeAusgeschnitten) {
            items.kopieren = {
                "label":            "kopieren",
                "separator_before": true,
                "icon":             "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfreiwkontrNodeKopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopFeldkontr_3 = $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontrNodeKopiert).attr("id"))
                    });
                    getTPopFeldkontr_3.done(function (data) {
                        window.apf.tpopfreiwkontr_objekt_kopiert = data[0];
                    });
                    getTPopFeldkontr_3.fail(function () {
                        melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert");
                    });
                }
            };
        }
        if (window.apf.tpopfreiwkontrNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontrNodeAusgeschnitten).get_text(window.apf.tpopfreiwkontrNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopfreiwkontrNodeAusgeschnitten, parentNode, "first", false);
                    localStorage.tpopfreiwkontr = true;
                }
            };
        }
        if (window.apf.tpopfreiwkontrNodeKopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontrNodeKopiert).get_text(window.apf.tpopfreiwkontrNodeKopiert) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontrNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp = "tpopfreiwkontr",
                            beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopOrdnerMassn":
        items = {
            "neu": {
                "label": "neue Massnahme",
                "icon":              "style/images/neu.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnahme/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp  = "tpopmassn",
                            beschriftung = "neue Massnahme";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Keine neue Massnahme erstellt");
                    });
                }
            }
        };
        if (window.apf.tpopmassnNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassnNodeAusgeschnitten).get_text(window.apf.tpopmassnNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopmassnNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopmassnNodeKopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassnNodeKopiert).get_text(window.apf.tpopmassnNodeKopiert) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    var insertTPopMassnKopie = $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassnNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopMassnKopie.done(function (id) {
                        var strukturtyp  = "tpopmassn",
                            beschriftung = window.apf.erstelleLabelFuerMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassnKopie.fail(function () {
                        melde("Fehler: Die Massnahme wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopmassn":
        items = {
            "neu": {
                "label": "neue Massnahme",
                "icon":  "style/images/neu.png",
                "action": function () {
                    var insertTPopMassn_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnahme/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopMassn_2.done(function (id) {
                        var strukturtyp = "tpopmassn",
                            beschriftung = "neue Massnahme";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassn_2.fail(function () {
                        melde("Fehler: Keine neue Massnahme erstellt");
                    });
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Massnahme '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:    'auto',
                        width:     400,
                        modal:     true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted     = window.apf.tpopmassn;
                                window.apf.deleted.typ = "tpopmassn";
                                $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/tabelleIdFeld=TPopMassnId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                }).done(function () {
                                    delete localStorage.tpopmassnId;
                                    delete window.apf.tpopmassn;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerTpopmassn(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die Massnahme '" + bezeichnung + "' wurde gelöscht.");
                                }).fail(function () {
                                    melde("Fehler: Die Massnahme wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
        if (!window.apf.tpopmassnNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label":            "ausschneiden",
                "separator_before": true,
                "icon":             "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopmassnNodeAusgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopmassnNodeKopiert;
                    delete window.apf.tpopmassn_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopmassnNodeAusgeschnitten) {
            items.kopieren = {
                "label":            "kopieren",
                "separator_before": true,
                "icon":             "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopmassnNodeKopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopMassn_2 = $.ajax({
                            type: 'get',
                            url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/feld=TPopMassnId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopmassnNodeKopiert).attr("id"))
                        }),
                        $TPopMassnTypChecked = $("#TPopMassnTyp option:checked");
                    getTPopMassn_2.done(function (data) {
                        if (data && data[0]) {
                            window.apf.tpopmassn_objekt_kopiert = data[0];
                            // den Beurteilungstext holen - ist nur mühsam aus der DB zu holen
                            window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = "";
                            if ($TPopMassnTypChecked.text()) {
                                window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = $TPopMassnTypChecked.text();
                            }
                        }
                    });
                    getTPopMassn_2.fail(function () {
                        melde("Fehler: Die Massnahme wurde nicht kopiert");
                    });
                }
            };
        }
        if (window.apf.tpopmassnNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassnNodeAusgeschnitten).get_text(window.apf.tpopmassnNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopmassnNodeAusgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.tpopmassnNodeKopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassnNodeKopiert).get_text(window.apf.tpopmassnNodeKopiert) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    var insertTPopMassnKopie_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassnNodeKopiert).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopMassnKopie_2.done(function (id) {
                        var strukturtyp = "tpopmassn",
                            beschriftung = window.apf.erstelleLabelFuerMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassnKopie_2.fail(function () {
                        melde("Fehler: Die Massnahme wurde nicht erstellt");
                    });
                }
            };
        }
        return items;
    case "tpopOrdnerTpopber":
        return {
            "neu": {
                "label": "neuer Teilpopulations-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp  = "tpopber",
                            beschriftung = "neuer Teilpopulations-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
                    });
                }
            }
        };
    case "tpopber":
        return {
            "neu": {
                "label": "neuer Teilpopulations-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    var insertTPopBer_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopBer_2.done(function (id) {
                        var strukturtyp = "tpopber",
                            beschriftung = "neuer Teilpopulations-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopBer_2.fail(function () {
                        melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Teilpopulations-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:    'auto',
                        width:     400,
                        modal:     true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted     = window.apf.tpopber;
                                window.apf.deleted.typ = "tpopber";
                                $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopBericht/tabelleIdFeld=TPopBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                }).done(function () {
                                    delete localStorage.tpopberId;
                                    delete window.apf.tpopber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerTpopber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Teilpopulations-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                }).fail(function () {
                                    melde("Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "tpopOrdnerBeobZugeordnet":
        items = {
            "GoogleMaps": {
                "label":            "auf Luftbild zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon.png",
                "action": function () {
                    var zeigeTPopBeob = require('../gmap/zeigeTPopBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/beobId=/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data) {
                            zeigeTPopBeob(data);
                        } else {
                            melde("Es gibt keine Beobachtungen mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            }
        };
        if (window.apf.beobZugeordnetNodeAusgeschnitten) {
            items = {};
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beobZugeordnetNodeAusgeschnitten).get_text(window.apf.beobZugeordnetNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.beobZugeordnetNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.beobNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beobNodeAusgeschnitten).get_text(window.apf.beobNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobNodeAusgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beobZugeordnet":
        items = {
            "GoogleMaps": {
                "label":            "auf Luftbild zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon.png",
                "action": function () {
                    var zeigeTPopBeob = require('../gmap/zeigeTPopBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data) {
                            zeigeTPopBeob(data);
                        } else {
                            melde("Die Beobachtung hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GoogleMapsMitTPopTPopBeob": {
                "label":            "auf Luftbild einer neuen<br>&nbsp;&nbsp;&nbsp;Teilpopulation zuordnen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeobUndTPop = require('../gmap/zeigeBeobUndTPop'),
                        zeigeBeob        = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (beob) {
                        if (beob && beob[0]) {
                            // Array belassen -zeigeBeob benötigt einen Array
                            $.ajax({
                                type: 'get',
                                url: 'api/v1/apKarte/apId=' + localStorage.apId
                            }).done(function (tpop) {
                                if (tpop && tpop.length > 0) {
                                    zeigeBeobUndTPop(beob, tpop);
                                } else {
                                    zeigeBeob(beob);
                                }
                            });
                        } else {
                            melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GisBrowser": {
                "label":            "im GIS-Browser zeigen",
                "separator_before": true,
                "icon":             "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beobZugeordnetNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label":            "ausschneiden",
                "separator_before": true,
                "icon":             "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.beobZugeordnetNodeAusgeschnitten = aktiverNode;
                }
            };
        }
        if (window.apf.beobZugeordnetNodeAusgeschnitten) {
            items.einfuegen_beob_zugeordnet = {
                "label": $.jstree._reference(window.apf.beobZugeordnetNodeAusgeschnitten).get_text(window.apf.beobZugeordnetNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.beobZugeordnetNodeAusgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.beobNodeAusgeschnitten) {
            items.einfuegen_beob = {
                "label": $.jstree._reference(window.apf.beobNodeAusgeschnitten).get_text(window.apf.beobNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.beobNodeAusgeschnitten, parentNode, "first", false);
                }
            };
        }
        return items;
    case "tpopOrdnerMassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp =  "tpopmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
                    });
                }
            }
        };
    case "tpopmassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    var insertTPopMassBer_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopMassBer_2.done(function (id) {
                        var strukturtyp = "tpopmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassBer_2.fail(function () {
                        melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:    'auto',
                        width:     400,
                        modal:     true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted     = window.apf.tpopmassnber;
                                window.apf.deleted.typ = "tpopmassnber";
                                $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopMassnBericht/tabelleIdFeld=TPopMassnBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                }).done(function () {
                                    delete localStorage.tpopmassnberId;
                                    delete window.apf.tpopmassnber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerPopmassnber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                }).fail(function () {
                                    melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        };
    case "apOrdnerBeobNichtBeurteilt":
        items = {
            "GoogleMaps": {
                "label":            "auf Luftbild zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeob = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeBeob(data);
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GoogleMapsMitTPop": {
                "label": "auf Luftbild Teilpopulationen<br>&nbsp;&nbsp;&nbsp;zuordnen<br>&nbsp;&nbsp;&nbsp;Tipp: Beobachtungen auf<br>&nbsp;&nbsp;&nbsp;Teilpopulationen ziehen!",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeobUndTPop = require('../gmap/zeigeBeobUndTPop'),
                        zeigeBeob        = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen='
                    }).done(function (beob) {
                        if (beob.length > 0) {
                            $.ajax({
                                type: 'get',
                                url: 'api/v1/apKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                            }).done(function (tpop) {
                                if (tpop && tpop.length > 0) {
                                    zeigeBeobUndTPop(beob, tpop);
                                } else {
                                    zeigeBeob(beob);
                                }
                            });
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            }
        };
        if (window.apf.beobZugeordnetNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beobZugeordnetNodeAusgeschnitten).get_text(window.apf.beobZugeordnetNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobZugeordnetNodeAusgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beobNichtBeurteilt":
        items = {
            "GoogleMaps": {
                "label":            "auf Luftbild zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeob = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data && data[0]) {
                            // zeigeBeob erwartet einen Array von Beob
                            zeigeBeob(data);
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GoogleMapsMitTPopBeob": {
                "label":            "auf Luftbild einer Teilpopulation<br>&nbsp;&nbsp;&nbsp;zuordnen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeobUndTPop = require('../gmap/zeigeBeobUndTPop'),
                        zeigeBeob        = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (beob) {
                        if (beob && beob[0]) {
                            // zeigeBeob erwartet einen Array, daher diesen belassen
                            $.ajax({
                                type: 'get',
                                url: 'api/v1/apKarte/apId=' + erstelleIdAusDomAttributId($(parentNode).attr("id"))
                            }).done(function (tpop) {
                                if (tpop && tpop.length > 0) {
                                    zeigeBeobUndTPop(beob, tpop);
                                } else {
                                    zeigeBeob(beob);
                                }
                            });
                        } else {
                            melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GisBrowser": {
                "label":            "im GIS-Browser zeigen",
                "separator_before": true,
                "icon":             "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beobNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label":            "ausschneiden",
                "separator_before": true,
                "icon":             "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.beobNodeAusgeschnitten = aktiverNode;
                }
            };
        }
        if (window.apf.beobZugeordnetNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beobZugeordnetNodeAusgeschnitten).get_text(window.apf.beobZugeordnetNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobZugeordnetNodeAusgeschnitten, parentNode, "first");
                }
            };
        }
        return items;
    case "apOrdnerBeobNichtZuzuordnen":
        items = {
            "GoogleMaps": {
                "label":            "auf Luftbild zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeob = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen=1'
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeBeob(data);
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            }
        };
        if (window.apf.beobZugeordnetNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beobZugeordnetNodeAusgeschnitten).get_text(window.apf.beobZugeordnetNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobZugeordnetNodeAusgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beobNichtZuzuordnen":
        items = {
            "GoogleMaps": {
                "label":            "auf Luftbild zeigen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    var zeigeBeob = require('../gmap/zeigeBeob');
                    $.ajax({
                        type: 'get',
                        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/nichtZuzuordnen='
                    }).done(function (data) {
                        if (data && data[0]) {
                            // zeigeBeob erwaret einen Array, daher diesen belassen
                            zeigeBeob(data);
                        } else {
                            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GisBrowser": {
                "label":            "im GIS-Browser zeigen",
                "separator_before": true,
                "icon":             "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beobNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label":            "ausschneiden",
                "separator_before": true,
                "icon":             "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.beobNodeAusgeschnitten = aktiverNode;
                }
            };
        }
        if (window.apf.beobZugeordnetNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beobZugeordnetNodeAusgeschnitten).get_text(window.apf.beobZugeordnetNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon":             "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobZugeordnetNodeAusgeschnitten, parentNode, "first");
                }
            };
        }
        return items;
    }
};