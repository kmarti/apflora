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
    insertAusgeschnittenePop                  = require('./insertAusgeschnittenePop'),
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
    schneideFeldkontrAus                      = require('./schneideFeldkontrAus'),
    kopiereFeldkontr                          = require('./kopiereFeldkontr'),
    insertKopierteFeldkontr                   = require('./insertKopierteFeldkontr'),
    insertNeueFreiwkontrolle                  = require('./insertNeueFreiwkontrolle'),
    insertKopierteFreiwkontr                  = require('./insertKopierteFreiwkontr'),
    loescheFreiwkontrolle                     = require('./loescheFreiwkontrolle'),
    schneideFreiwkontrAus                     = require('./schneideFreiwkontrAus'),
    kopiereFreiwkontr                         = require('./kopiereFreiwkontr'),
    insertNeueTpopmassnn                      = require('./insertNeueTpopmassnn'),
    kopiereTpopmassn                          = require('./kopiereTpopmassn'),
    insertKopierteTpopmassn                   = require('./insertKopierteTpopmassn'),
    insertNeuenTpopber                        = require('./insertNeuenTpopber'),
    loescheTpopber                            = require('./loescheTpopber'),
    insertNeuenTpopmassnber                   = require('./insertNeuenTpopmassnber'),
    loescheTpopmassnber                       = require('./loescheTpopmassnber'),
    zeigeTpopbeobZugeordnetAufGmap            = require('./zeigeTpopbeobZugeordnetAufGmap'),
    loescheTpopmassn                          = require('./loescheTpopmassn'),
    schneideTpopmassnAus                      = require('./schneideTpopmassnAus'),
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
    verorteTpopAufGmap                        = require('./verorteTpopAufGmap'),
    zeigeTpopUndBeobAufGmap                   = require('./zeigeTpopUndBeobAufGmap'),
    zeigeTpopbeobNichtBeurteiltAufGmap        = require('./zeigeTpopbeobNichtBeurteiltAufGmap'),
    zeigeTpopbeobNichtBeurteiltUndTpopAufGmap = require('./zeigeTpopbeobNichtBeurteiltUndTpopAufGmap'),
    schneideBeobZugeordnetAus                 = require('./schneideBeobZugeordnetAus');

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
                    insertAusgeschnittenePop($(aktiverNode).attr("id"));
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
                    insertAusgeschnittenePop($(parentNode).attr("id"));
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
                    insertKopierteFeldkontr(aktiverNode, parentNode, $(aktiverNode).attr("id"));
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
                    schneideFeldkontrAus(aktiverNode);
                }
            };
        }
        if (!window.apf.tpopfeldkontrNodeAusgeschnitten) {
            items.kopieren = {
                "label":            "kopieren",
                "separator_before": true,
                "icon":             "style/images/kopieren.png",
                "action": function () {
                    kopiereFeldkontr(aktiverNode);
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
                    insertKopierteFeldkontr(aktiverNode, parentNode, $(parentNode).attr("id"));
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
                    insertNeueFreiwkontrolle(aktiverNode, parentNode, $(aktiverNode).attr("id"));
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
                    insertKopierteFreiwkontr(aktiverNode, parentNode, $(aktiverNode).attr("id"));
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
                    insertNeueFreiwkontrolle(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheFreiwkontrolle(aktiverNode, parentNode);
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
                    schneideFreiwkontrAus(aktiverNode);
                }
            };
        }
        if (!window.apf.tpopfreiwkontrNodeAusgeschnitten) {
            items.kopieren = {
                "label":            "kopieren",
                "separator_before": true,
                "icon":             "style/images/kopieren.png",
                "action": function () {
                    kopiereFreiwkontr(aktiverNode);
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
                    insertKopierteFreiwkontr(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            };
        }
        return items;
    case "tpopOrdnerMassn":
        items = {
            "neu": {
                "label": "neue Massnahme",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeueTpopmassnn(aktiverNode, parentNode, $(aktiverNode).attr("id"));
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
                    insertKopierteTpopmassn(aktiverNode, parentNode, $(aktiverNode).attr("id"));
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
                    insertNeueTpopmassnn(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheTpopmassn(aktiverNode, parentNode);
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
                    schneideTpopmassnAus(aktiverNode);
                }
            };
        }
        if (!window.apf.tpopmassnNodeAusgeschnitten) {
            items.kopieren = {
                "label":            "kopieren",
                "separator_before": true,
                "icon":             "style/images/kopieren.png",
                "action": function () {
                    kopiereTpopmassn(aktiverNode);
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
                    insertKopierteTpopmassn(aktiverNode, parentNode, $(parentNode).attr("id"));
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
                    insertNeuenTpopber(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
    case "tpopber":
        return {
            "neu": {
                "label": "neuer Teilpopulations-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenTpopber(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheTpopber(aktiverNode, parentNode);
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
                    zeigeTpopbeobZugeordnetAufGmap($(aktiverNode).attr("id"));
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
                    zeigeTpopbeobZugeordnetAufGmap(null, $(aktiverNode).attr("id"));
                }
            },
            "GoogleMapsMitTPopTPopBeob": {
                "label":            "auf Luftbild einer neuen<br>&nbsp;&nbsp;&nbsp;Teilpopulation zuordnen",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    zeigeTpopUndBeobAufGmap($(aktiverNode).attr("id"));
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
                    schneideBeobZugeordnetAus(aktiverNode);
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
                    insertNeuenTpopmassnber(aktiverNode, parentNode, $(aktiverNode).attr("id"));
                }
            }
        };
    case "tpopmassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon":  "style/images/neu.png",
                "action": function () {
                    insertNeuenTpopmassnber(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label":            "löschen",
                "separator_before": true,
                "icon":             "style/images/loeschen.png",
                "action": function () {
                    loescheTpopmassnber(aktiverNode, parentNode);
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
                    zeigeTpopbeobNichtBeurteiltAufGmap($(aktiverNode).attr("id"));
                }
            },
            "GoogleMapsMitTPop": {
                "label": "auf Luftbild Teilpopulationen<br>&nbsp;&nbsp;&nbsp;zuordnen<br>&nbsp;&nbsp;&nbsp;Tipp: Beobachtungen auf<br>&nbsp;&nbsp;&nbsp;Teilpopulationen ziehen!",
                "separator_before": true,
                "icon":             "style/images/flora_icon_violett.png",
                "action": function () {
                    zeigeTpopbeobNichtBeurteiltUndTpopAufGmap($(aktiverNode).attr("id"));
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