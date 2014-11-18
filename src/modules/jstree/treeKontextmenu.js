/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                                         = require('underscore'),
    $                                         = require('jquery'),
    zeigeTPopAufGmap                          = require('../gmap/zeigeTPop'),
    zeigeTPopAufOlmap                         = require('../olmap/zeigeTPop'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    frageObUndeleteDatensatz                  = require('../frageObUndeleteDatensatz'),
    melde                                     = require('../melde'),
    zeigeBeobKoordinatenImGisBrowser          = require('../zeigeBeobKoordinatenImGisBrowser'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    zeigePop                                  = require('../olmap/zeigePop'),
    insertNeuePop                             = require('./insertNeuePop'),
    insertNeuesApziel                         = require('./insertNeuesApziel'),
    loescheApziel                             = require('./loescheApziel'),
    insertNeuenZielber                        = require('./insertNeuenZielber'),
    loescheZielber                            = require('./loescheZielber'),
    insertNeuesErfkrit                        = require('./insertNeuesErfkrit'),
    loescheErfkrit                            = require('./loescheErfkrit'),
    fuegeAusgeschnittenePopEin                = require('./fuegeAusgeschnittenePopEin'),
    zeigePopsAufOlmap                         = require('./zeigePopsAufOlmap'),
    zeigePopsAufGmap                          = require('./zeigePopsAufGmap');

var returnFunction = function (node) {
    var items,
        aktiverNode,
        aktiverNodeText,
        parentNode,
        parentNodeText,
        grandparentNode;

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
                "icon": "style/images/neu.png",
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
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
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
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    loescheErfkrit(aktiverNode, parentNode);
                }
            }
        };
    case "apOrdnerJber":
        return {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neuer AP-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertJber = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblJBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertJber.done(function (id) {
                        var strukturtyp = "jber",
                            beschriftung = "neuer AP-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertJber.fail(function () {
                        melde("Fehler: Keinen neuen AP-Bericht erstellt");
                    });
                }
            }
        };
    case "jber":
        items = {
            "neu": {
                "label": "neuer AP-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertJber_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblJBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertJber_2.done(function (id) {
                        var strukturtyp = "jber",
                            beschriftung = "neuer AP-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertJber_2.fail(function () {
                        melde("Fehler: Keinen neuen AP-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der AP-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.jber;
                                window.apf.deleted.typ = "jber";
                                var deleteJber = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblJBer/tabelleIdFeld=JBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteJber.done(function () {
                                    delete localStorage.jberId;
                                    delete window.apf.jber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerJber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der AP-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteJber.fail(function () {
                                    melde("Fehler: Der AP-Bericht wurde nicht gelöscht");
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
        // Wenn noch keine existiert, kann einen neue Übersicht zu allen Arten erstellt werden
        if ($.jstree._reference(aktiverNode)._get_children(aktiverNode).length === 0) {
            items.neu_jber_uebersicht = {
                "label": "neue Übersicht zu allen Arten",
                "separator_before": true,
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertJberUebersicht = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblJBerUebersicht/feld=JbuJahr/wert=' + $.jstree._reference(aktiverNode).get_text(aktiverNode) + '/user=' + sessionStorage.user
                    });
                    insertJberUebersicht.done(function () {
                        var strukturtyp = "jberUebersicht",
                            dsId = $.jstree._reference(aktiverNode).get_text(aktiverNode),
                            beschriftung = "neue Übersicht zu allen Arten";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, dsId, beschriftung);
                    });
                    insertJberUebersicht.fail(function () {
                        melde("Fehler: Keine Übersicht zu allen Arten erstellt");
                    });
                }
            };
        }
        return items;
    case "jberUebersicht":
        return {
            "loeschen": {
                "label": "lösche Übersicht zu allen Arten",
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Übersicht zu allen Arten wird gelöscht");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.jberUebersicht;
                                window.apf.deleted.typ = "jberUebersicht";
                                var deleteJberUebersicht = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblJBerUebersicht/tabelleIdFeld=JbuJahr/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteJberUebersicht.done(function () {
                                    delete localStorage.jberUebersichtId;
                                    delete window.apf.jberUebersicht;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz('Die Übersicht für den AP-Bericht des Jahrs "' + window.apf.deleted.JbuJahr + '" wurde gelöscht.');
                                });
                                deleteJberUebersicht.fail(function () {
                                    melde("Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht");
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
    case "apOrdnerBer":
        return {
            "neu": {
                "label": "neuer Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertBer = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) +'/user=' + sessionStorage.user
                    });
                    insertBer.done(function (id) {
                        var strukturtyp = "ber",
                            beschriftung = "neuer Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertBer.fail(function () {
                        melde("Fehler: Keinen neuen Bericht erstellt");
                    });
                }
            }
        };
    case "ber":
        return {
            "neu": {
                "label": "Neuer Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertBer_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) +'/user=' + sessionStorage.user
                    });
                    insertBer_2.done(function (id) {
                        var strukturtyp = "ber",
                            beschriftung = "neuer Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertBer_2.fail(function () {
                        melde("Fehler: Keinen neuen Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.ber;
                                window.apf.deleted.typ = "ber";
                                var deleteBer = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblBer/tabelleIdFeld=BerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteBer.done(function () {
                                    delete localStorage.berId;
                                    delete window.apf.ber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerBer(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteBer.fail(function () {
                                    melde("Fehler: Der Bericht wurde nicht gelöscht");
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
    case "apOrdnerAssozarten":
        return {
            "neu": {
                "label": "neue assoziierte Art",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertAssozarten = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblAssozArten/feld=AaApArtId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertAssozarten.done(function (id) {
                        var strukturtyp = "assozarten",
                            beschriftung = "neue assoziierte Art";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertAssozarten.fail(function () {
                        melde("Fehler: keine assoziierte Art erstellt");
                    });
                }
            }
        };
    case "assozarten":
        return {
            "neu": {
                "label": "neue assoziierte Art",
                "icon": "style/images/neu.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblAssozArten/feld=AaApArtId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp = "assozarten",
                            beschriftung = "neue assoziierte Art";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Keine assoziierte Art erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die assoziierte Art '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.assozarten;
                                window.apf.deleted.typ = "assozarten";
                                var deleteAssozarten = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblAssozArten/tabelleIdFeld=AaId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteAssozarten.done(function () {
                                    delete localStorage.assozartenId;
                                    delete window.apf.assozarten;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerAssozarten(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die assoziierte Art '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteAssozarten.fail(function () {
                                    melde("Fehler: Die assoziierte Art wurde nicht gelöscht");
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
    case "pop":
        items = {
            "neu": {
                "label": "neue Population",
                "icon":  "style/images/neu.png",
                "action": function () {
                    console.log('aktiverNode: ', aktiverNode);
                    insertNeuePop(aktiverNode, parentNode, $(parentNode).attr("id"));
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Population '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.pop;
                                window.apf.deleted.typ = "pop";
                                var deletePop = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deletePop.done(function () {
                                    delete localStorage.popId;
                                    delete window.apf.pop;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerPop(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Population '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deletePop.fail(function () {
                                    melde("Fehler: Die Population wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            },
            "GeoAdminMaps": {
                "label": "auf CH-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_gelb.png",
                "action": function () {
                    var zeigePop = require('../olmap/zeigePop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/popChKarte/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data && data.length > 0) {
                            zeigePop(data);
                        } else {
                            melde("Die Population hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Populationen erhalten");
                    });
                }
            },
            "GoogleMaps": {
                "label": "auf Google-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
                "action": function () {
                    var getPopKarte = $.ajax({
                        type: 'get',
                        url: 'api/v1/popKarte/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    });
                    getPopKarte.done(function (data) {
                        if (data && data.length > 0) {
                            zeigeTPopAufGmap(data);
                        } else {
                            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                        }
                    });
                    getPopKarte.fail(function () {
                        melde("Fehler: Keine Teilpopulationen erhalten");
                    });
                }
            }
        };
        if (!window.apf.popZumVerschiebenGemerkt) {
            items.ausschneiden = {
                "label": "zum Verschieben merken",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // Jetzt die PopId merken - ihr muss danach eine andere ApArtId zugeteilt werden
                    window.apf.popId = erstelleIdAusDomAttributId($(aktiverNode).attr("id"));
                    // merken, dass ein node ausgeschnitten wurde
                    window.apf.popZumVerschiebenGemerkt = true;
                    // und wie er heisst (um es später im Kontextmenü anzuzeigen)
                    window.apf.popBezeichnung = $("#PopNr").val() + " " + $("#PopName").val();

                }
            };
        }
        if (window.apf.popZumVerschiebenGemerkt) {
            items.einfuegen = {
                "label": "'" + window.apf.popBezeichnung + "' einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    var popid = window.apf.popId;
                    var apartid = erstelleIdAusDomAttributId($(parentNode).attr("id"));
                    // db aktualisieren
                    var updatePop_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/update/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + popid + '/feld=ApArtId/wert=' + apartid + '/user=' + sessionStorage.user
                    });
                    updatePop_2.done(function () {
                        // Baum wieder aufbauen
                        $.when(window.apf.erstelleTree(apartid))
                            .then(function () {
                                // dann den eingefügten Node wählen
                                $("#tree").jstree("select_node", "[typ='pop']#" + popid);
                            });
                        // einfügen soll nicht mehr angezeigt werden
                        delete window.apf.popZumVerschiebenGemerkt;
                        // nicht mehr benötigte Variablen entfernen
                        delete window.apf.popBezeichnung;
                        delete window.apf.popId;
                    });
                    updatePop_2.fail(function () {
                        melde("Fehler: Die Population wurde nicht verschoben");
                    });
                }
            };
        }
        return items;
    case "popOrdnerTpop":
        items = {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neue Teilpopulation",
                "icon": "style/images/neu.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilpopulation/feld=PopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp = "tpop",
                            beschriftung = "neue Teilpopulation";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    }).fail(function () {
                        melde("Fehler: Keine neue Teilpopulation erstellt");
                    });
                }
            },
            "GeoAdminMaps": {
                "label": "auf CH-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_gelb.png",
                "action": function () {
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/tpopsKarte/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeTPopAufOlmap(data);
                        } else {
                            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Teilpopulationen erhalten");
                    });
                }
            },
            "GoogleMaps": {
                "label": "auf Google-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
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
                "label": $.jstree._reference(window.apf.tpopNodeAusgeschnitten).get_text(window.apf.tpopNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopNodeKopiert) {
            label = "";
            if (window.apf.tpopObjektKopiert.TPopNr) {
                label += window.apf.tpopObjektKopiert.TPopNr;
            } else {
                label += "(keine Nr.)";
            }
            label += ": ";
            if (window.apf.tpopObjektKopiert.TPopFlurname) {
                label += window.apf.tpopObjektKopiert.TPopFlurname;
            } else {
                label += "(kein Flurname)";
            }
            items.einfuegen = {
                //"label": $.jstree._reference(window.apf.tpopNodeKopiert).get_text(window.apf.tpopNodeKopiert) + " einfügen",
                "label": label + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    window.apf.tpopKopiertInPopOrdnerTpopEinfuegen(aktiverNode);
                }
            };
        }
        return items;
    case "tpop":
        items = {
            "untergeordneteKnotenOeffnen": {
                "label": "untergeordnete Knoten öffnen",
                "icon": "style/images/tree16x16.png",
                "action": function () {
                    $.jstree._reference(node).open_all(node);
                }
            },
            "neu": {
                "label": "neue Teilpopulation",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPop_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilpopulation/feld=PopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPop_2.done(function (id) {
                        var strukturtyp = "tpop",
                            beschriftung = "neue Teilpopulation";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPop_2.fail(function () {
                        melde("Fehler: Keine neue Teilpopulation erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                    $.jstree._reference(aktiverNode).deselect_all();
                    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                    $.jstree._reference(aktiverNode).open_all(aktiverNode);
                    $.jstree._reference(aktiverNode).deselect_all();
                    $.jstree._reference(aktiverNode).select_node(aktiverNode);
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Teilpopulation '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpop;
                                window.apf.deleted.typ = "tpop";
                                // löschen
                                var deleteTPop = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPop.done(function () {
                                    delete localStorage.tpopId;
                                    delete window.apf.tpop;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerTpop(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Teilpopulation '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPop.fail(function () {
                                    melde("Fehler: Die Teilpopulation wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            },
            "GeoAdminMaps": {
                "label": "auf CH-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_gelb.png",
                "action": function () {
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/tpopKarte/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeTPopAufOlmap(data);
                        } else {
                            melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Teilpopulationen erhalten");
                    });
                }
            },
            "verortenGeoAdmin": {
                "label": "auf CH-Karten verorten",
                "separator_before": true,
                "icon": "style/images/flora_icon_rot.png",
                "action": function () {
                    var verorteTPop = require('../olmap/verorteTPop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        verorteTPop(data[0]);
                    }).fail(function () {
                        melde("Fehler: Keine Teilpopulation erhalten");
                    });
                }
            },
            "GoogleMaps": {
                "label": "auf Google-Karten zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
                "action": function () {
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/tpopKarte/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        if (data.length > 0) {
                            zeigeTPopAufGmap(data);
                        } else {
                            melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
                        }
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "verorten": {
                "label": "auf Google-Karten verorten",
                "separator_before": true,
                "icon": "style/images/flora_icon_rot.png",
                "action": function () {
                    var verorteTPop = require('../gmap/verorteTPop');
                    $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                    }).done(function (data) {
                        verorteTPop(data[0]);
                    }).fail(function () {
                        melde("Fehler: Keine Daten erhalten");
                    });
                }
            },
            "GisBrowser": {
                "label": "im GIS-Browser zeigen",
                "separator_before": true,
                "icon": "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.tpopNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopNodeAusgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopNodeKopiert;
                    delete window.apf.tpopObjektKopiert;
                }
            };
        }
        if (!window.apf.tpopNodeAusgeschnitten) {
            items.kopieren = {
                "label": "kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopNodeKopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPop_4 = $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId($(tpop_node_kopiert).attr("id"))
                    });
                    getTPop_4.done(function (data) {
                        window.apf.tpopObjektKopiert = data[0];
                    });
                    getTPop_4.fail(function () {
                        melde("Fehler: Die Teilpopulation wurde nicht kopiert");
                    });
                }
            };
        }
        if (window.apf.tpopNodeKopiert) {
            var label = "";
            if (window.apf.tpopObjektKopiert.TPopNr) {
                label += window.apf.tpopObjektKopiert.TPopNr;
            } else {
                label += "(keine Nr.)";
            }
            label += ": ";
            if (window.apf.tpopObjektKopiert.TPopFlurname) {
                label += window.apf.tpopObjektKopiert.TPopFlurname;
            } else {
                label += "(kein Flurname)";
            }
            items.einfuegen = {
                "label": label + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    window.apf.tpopKopiertInPopOrdnerTpopEinfuegen(parentNode);
                }
            };
        }
        if (window.apf.tpopNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopNodeAusgeschnitten).get_text(window.apf.tpopNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
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
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPopber = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopBericht/feld=PopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertPopber.done(function (id) {
                        var strukturtyp = "popber",
                            beschriftung = "neuer Populations-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPopber.fail(function () {
                        melde("Fehler: Keinen neuen Populations-Bericht erstellt");
                    });
                }
            }
        };
    case "popber":
        return {
            "neu": {
                "label": "neuer Populations-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPopber_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopBericht/feld=PopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertPopber_2.done(function (id) {
                        var strukturtyp = "popber",
                            beschriftung = "neuer Populations-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPopber_2.fail(function () {
                        melde("Fehler: Keinen neuen Populations-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Populations-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.popber;
                                window.apf.deleted.typ = "popber";
                                var deletePopber = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblPopBericht/tabelleIdFeld=PopBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deletePopber.done(function () {
                                    delete localStorage.popberId;
                                    delete window.apf.popber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerPopber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Populations-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deletePopber.fail(function () {
                                    melde("Fehler: Der Populations-Bericht wurde nicht gelöscht");
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
    case "popOrdnerMassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPopMassnBer = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopMassnBericht/feld=PopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertPopMassnBer.done(function (id) {
                        var strukturtyp = "popmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPopMassnBer.fail(function () {
                        melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
                    });
                }
            }
        };
    case "popmassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertPopMassnBer_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblPopMassnBericht/feld=PopId/wert=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertPopMassnBer_2.done(function (id) {
                        var strukturtyp = "popmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertPopMassnBer_2.fail(function () {
                        melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.popmassnber;
                                window.apf.deleted.typ = "popmassnber";
                                var deletePopMassnBer = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblPopMassnBericht/tabelleIdFeld=PopMassnBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deletePopMassnBer.done(function () {
                                    delete localStorage.popmassnberId;
                                    delete window.apf.popmassnber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerPopmassnber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deletePopMassnBer.fail(function () {
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
    case "tpopOrdnerFeldkontr":
        items = {
            "neu": {
                "label": "neue Feldkontrolle",
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopFeldKontr = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrtyp=tpopfeldkontr/user=' + sessionStorage.user
                    });
                    insertTPopFeldKontr.done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = "neue Feldkontrolle";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopFeldKontr.fail(function () {
                        melde("Fehler: Keine neue Feldkontrolle erstellt");
                    });
                }
            }
        };
        if (window.apf.tpopfeldkontrNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontrNodeAusgeschnitten).get_text(window.apf.tpopfeldkontrNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopfeldkontrNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopfeldkontr_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontr_node_kopiert).get_text(window.apf.tpopfeldkontr_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
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
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopFeldKontr_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrtyp=tpopfeldkontr/user=' + sessionStorage.user
                    });
                    insertTPopFeldKontr_2.done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = "neue Feldkontrolle";
                        insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopFeldKontr_2.fail(function () {
                        melde("Fehler: Keine neue Feldkontrolle erstellt");
                    });
                }
            },
            "loeschen": {
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Feldkontrolle '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopfeldkontr;
                                window.apf.deleted.typ = "tpopfeldkontr";
                                var deleteTPopFeldKontr = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/tabelleIdFeld=TPopKontrId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopFeldKontr.done(function () {
                                    delete localStorage.tpopfeldkontrId;
                                    delete window.apf.tpopfeldkontr;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerTpopfeldkontr(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die Feldkontrolle '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopFeldKontr.fail(function () {
                                    melde("Fehler: Die Feldkontrolle wurde nicht gelöscht");
                                });
                            },
                            "abbrechen": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            },
            "biotop_kopieren": {
                "label": "Biotop kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    delete window.apf.feldkontr_biotop;
                    window.apf.feldkontr_biotop = {};
                    var $TPopKontrFlaeche = $("#TPopKontrFlaeche");
                    if ($TPopKontrFlaeche.val()) {
                        window.apf.feldkontr_biotop.TPopKontrFlaeche = $TPopKontrFlaeche.val();
                    }
                    var $TPopKontrLeb = $("#TPopKontrLeb");
                    if ($TPopKontrLeb.val()) {
                        window.apf.feldkontr_biotop.TPopKontrLeb = $TPopKontrLeb.val();
                    }
                    var $TPopKontrLebUmg = $("#TPopKontrLebUmg");
                    if ($TPopKontrLebUmg.val()) {
                        window.apf.feldkontr_biotop.TPopKontrLebUmg = $TPopKontrLebUmg.val();
                    }
                    var $TPopKontrVegTyp = $("#TPopKontrVegTyp");
                    if ($TPopKontrVegTyp.val()) {
                        window.apf.feldkontr_biotop.TPopKontrVegTyp = $TPopKontrVegTyp.val();
                    }
                    var $TPopKontrKonkurrenz = $("#TPopKontrKonkurrenz");
                    if ($TPopKontrKonkurrenz.val()) {
                        window.apf.feldkontr_biotop.TPopKontrKonkurrenz = $TPopKontrKonkurrenz.val();
                    }
                    var $TPopKontrMoosschicht = $("#TPopKontrMoosschicht");
                    if ($TPopKontrMoosschicht.val()) {
                        window.apf.feldkontr_biotop.TPopKontrMoosschicht = $TPopKontrMoosschicht.val();
                    }
                    var $TPopKontrKrautschicht = $("#TPopKontrKrautschicht");
                    if ($TPopKontrKrautschicht.val()) {
                        window.apf.feldkontr_biotop.TPopKontrKrautschicht = $TPopKontrKrautschicht.val();
                    }
                    var $TPopKontrStrauchschicht = $("#TPopKontrStrauchschicht");
                    if ($TPopKontrStrauchschicht.val()) {
                        window.apf.feldkontr_biotop.TPopKontrStrauchschicht = $TPopKontrStrauchschicht.val();
                    }
                    var $TPopKontrBaumschicht = $("#TPopKontrBaumschicht");
                    if ($TPopKontrBaumschicht.val()) {
                        window.apf.feldkontr_biotop.TPopKontrBaumschicht = $TPopKontrBaumschicht.val();
                    }
                    var $TPopKontrBodenTyp = $("#TPopKontrBodenTyp");
                    if ($TPopKontrBodenTyp.val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenTyp = $TPopKontrBodenTyp.val();
                    }
                    var $TPopKontrBodenKalkgehalt = $("#TPopKontrBodenKalkgehalt");
                    if ($TPopKontrBodenKalkgehalt.val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenKalkgehalt = $TPopKontrBodenKalkgehalt.val();
                    }
                    if ($("#TPopKontrBodenDurchlaessigkeit").val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenDurchlaessigkeit = $("#TPopKontrBodenDurchlaessigkeit").val();
                    }
                    if ($("#TPopKontrBodenHumus").val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenHumus = $("#TPopKontrBodenHumus").val();
                    }
                    if ($("#TPopKontrBodenNaehrstoffgehalt").val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenNaehrstoffgehalt = $("#TPopKontrBodenNaehrstoffgehalt").val();
                    }
                    if ($("#TPopKontrBodenAbtrag").val()) {
                        window.apf.feldkontr_biotop.TPopKontrBodenAbtrag = $("#TPopKontrBodenAbtrag").val();
                    }
                    if ($("#TPopKontrWasserhaushalt").val()) {
                        window.apf.feldkontr_biotop.TPopKontrWasserhaushalt = $("#TPopKontrWasserhaushalt").val();
                    }
                    if ($("#TPopKontrHandlungsbedarf").val()) {
                        window.apf.feldkontr_biotop.TPopKontrHandlungsbedarf = $("#TPopKontrHandlungsbedarf").val();
                    }
                }
            }
        };
        if (window.apf.feldkontr_biotop) {
            items.biotop_einfuegen = {
                "label": "Biotop einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    var data = {};
                    data.id = erstelleIdAusDomAttributId($(aktiverNode).attr("id"));
                    data.user = sessionStorage.user;
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    _.each(window.apf.feldkontr_biotop, function (value, key) {
                        $("#" + key).val(value);
                        data[key] = value;
                    });
                    // jetzt alles speichern
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/updateMultiple/apflora/tabelle=tblTeilPopFeldkontrolle/felder=' + JSON.stringify(data)
                    }).fail(function () {
                        melde("Fehler: Das kopierte Biotop wurde nicht eingefügt");
                    });
                }
            };
        }
        if (!window.apf.tpopfeldkontrNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "Feldkontrolle ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfeldkontrNodeAusgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopfeldkontr_node_kopiert;
                    delete window.apf.tpopfeldkontr_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopfeldkontrNodeAusgeschnitten) {
            items.kopieren = {
                "label": "kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfeldkontr_node_kopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopFeldkontr_2 = $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id"))
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopfeldkontrNodeAusgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.tpopfeldkontr_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfeldkontr_node_kopiert).get_text(window.apf.tpopfeldkontr_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id")) + '/user=' + sessionStorage.user
                    }).done(function (id) {
                        var strukturtyp = "tpopfeldkontr",
                            beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
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
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopFeldKontr_3 = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/feldkontr/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrtyp=tpopfreiwkontr/user=' + sessionStorage.user
                    });
                    insertTPopFeldKontr_3.done(function (id) {
                        var strukturtyp = "tpopfreiwkontr",
                            beschriftung = "neue Freiwilligen-Kontrolle";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopFeldKontr_3.fail(function () {
                        melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
                    });
                }
            }
        };
        if (window.apf.tpopfreiwkontrNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontrNodeAusgeschnitten).get_text(window.apf.tpopfreiwkontrNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopfreiwkontrNodeAusgeschnitten, aktiverNode, "first", false);
                }
            }
        }
        if (window.apf.tpopfreiwkontr_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_kopiert).get_text(window.apf.tpopfreiwkontr_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    // und an die DB schicken
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id")) + '/user=' + sessionStorage.user
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
                "icon": "style/images/neu.png",
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
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopfeldkontr;
                                window.apf.deleted.typ = "tpopfreiwkontr";
                                var deleteTPopFeldKontr_2 = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/tabelleIdFeld=TPopKontrId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopFeldKontr_2.done(function () {
                                    delete localStorage.tpopfeldkontrId;
                                    delete localStorage.tpopfreiwkontr;
                                    delete window.apf.tpopfeldkontr;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerTpopfreiwkontr(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopFeldKontr_2.fail(function () {
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
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfreiwkontrNodeAusgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopfreiwkontr_node_kopiert;
                    delete window.apf.tpopfreiwkontr_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopfreiwkontrNodeAusgeschnitten) {
            items.kopieren = {
                "label": "kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopfreiwkontr_node_kopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopFeldkontr_3 = $.ajax({
                        type: 'get',
                        url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id"))
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopfreiwkontrNodeAusgeschnitten, parentNode, "first", false);
                    localStorage.tpopfreiwkontr = true;
                }
            };
        }
        if (window.apf.tpopfreiwkontr_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_kopiert).get_text(window.apf.tpopfreiwkontr_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopfeldkontrInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopKontrId=' + erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id")) + '/user=' + sessionStorage.user
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
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopMassn = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnahme/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopMassn.done(function (id) {
                        var strukturtyp = "tpopmassn",
                            beschriftung = "neue Massnahme";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassn.fail(function () {
                        melde("Fehler: Keine neue Massnahme erstellt");
                    });
                }
            }
        };
        if (window.apf.tpopmassnNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassnNodeAusgeschnitten).get_text(window.apf.tpopmassnNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.tpopmassnNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.tpopmassn_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassn_node_kopiert).get_text(window.apf.tpopmassn_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    var insertTPopMassnKopie = $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopMassnKopie.done(function (id) {
                        var strukturtyp = "tpopmassn",
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
                "icon": "style/images/neu.png",
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
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Die Massnahme '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopmassn;
                                window.apf.deleted.typ = "tpopmassn";
                                var deleteTPopMassn = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/tabelleIdFeld=TPopMassnId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopMassn.done(function () {
                                    delete localStorage.tpopmassnId;
                                    delete window.apf.tpopmassn;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerTpopmassn(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Die Massnahme '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopMassn.fail(function () {
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
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopmassnNodeAusgeschnitten = aktiverNode;
                    // es macht keinen Sinn mehr, den kopierten node zu behalten
                    // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                    delete window.apf.tpopmassn_node_kopiert;
                    delete window.apf.tpopmassn_objekt_kopiert;
                }
            };
        }
        if (!window.apf.tpopmassnNodeAusgeschnitten) {
            items.kopieren = {
                "label": "kopieren",
                "separator_before": true,
                "icon": "style/images/kopieren.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    window.apf.tpopmassn_node_kopiert = aktiverNode;
                    // Daten des Objekts holen
                    var getTPopMassn_2 = $.ajax({
                            type: 'get',
                            url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/feld=TPopMassnId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id"))
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.tpopmassnNodeAusgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.tpopmassn_node_kopiert) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.tpopmassn_node_kopiert).get_text(window.apf.tpopmassn_node_kopiert) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    var insertTPopMassnKopie_2 = $.ajax({
                        type: 'post',
                        url: 'api/v1/tpopmassnInsertKopie/tpopId=' + erstelleIdAusDomAttributId($(parentNode).attr("id")) + '/tpopMassnId=' + erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id")) + '/user=' + sessionStorage.user
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
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopBer = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopBer.done(function (id) {
                        var strukturtyp = "tpopber",
                            beschriftung = "neuer Teilpopulations-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopBer.fail(function () {
                        melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
                    });
                }
            }
        };
    case "tpopber":
        return {
            "neu": {
                "label": "neuer Teilpopulations-Bericht",
                "icon": "style/images/neu.png",
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
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Teilpopulations-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopber;
                                window.apf.deleted.typ = "tpopber";
                                var deleteTPopBer = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopBericht/tabelleIdFeld=TPopBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopBer.done(function () {
                                    delete localStorage.tpopberId;
                                    delete window.apf.tpopber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerTpopber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Teilpopulations-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopBer.fail(function () {
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
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(aktiverNode).move_node(window.apf.beobZugeordnetNodeAusgeschnitten, aktiverNode, "first", false);
                }
            };
        }
        if (window.apf.beobNodeAusgeschnitten) {
            items.einfuegen = {
                "label": $.jstree._reference(window.apf.beobNodeAusgeschnitten).get_text(window.apf.beobNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobNodeAusgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beobZugeordnet":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon.png",
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
                "label": "auf Luftbild einer neuen<br>&nbsp;&nbsp;&nbsp;Teilpopulation zuordnen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
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
                "label": "im GIS-Browser zeigen",
                "separator_before": true,
                "icon": "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beobZugeordnetNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $.jstree._reference(parentNode).move_node(window.apf.beobZugeordnetNodeAusgeschnitten, parentNode, "first", false);
                }
            };
        }
        if (window.apf.beobNodeAusgeschnitten) {
            items.einfuegen_beob = {
                "label": $.jstree._reference(window.apf.beobNodeAusgeschnitten).get_text(window.apf.beobNodeAusgeschnitten) + " einfügen",
                "separator_before": true,
                "icon": "style/images/einfuegen.png",
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
                "icon": "style/images/neu.png",
                "action": function () {
                    var insertTPopMassnBer = $.ajax({
                        type: 'post',
                        url: 'api/v1/insert/apflora/tabelle=tblTeilPopMassnBericht/feld=TPopId/wert=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/user=' + sessionStorage.user
                    });
                    insertTPopMassnBer.done(function (id) {
                        var strukturtyp = "tpopmassnber",
                            beschriftung = "neuer Massnahmen-Bericht";
                        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
                    });
                    insertTPopMassnBer.fail(function () {
                        melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
                    });
                }
            }
        };
    case "tpopmassnber":
        return {
            "neu": {
                "label": "neuer Massnahmen-Bericht",
                "icon": "style/images/neu.png",
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
                "label": "löschen",
                "separator_before": true,
                "icon": "style/images/loeschen.png",
                "action": function () {
                    // nur aktualisieren, wenn Schreibrechte bestehen
                    if (!window.apf.pruefeSchreibvoraussetzungen()) {
                        return;
                    }
                    var bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
                    $("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
                    $("#loeschen_dialog").dialog({
                        resizable: false,
                        height:'auto',
                        width: 400,
                        modal: true,
                        buttons: {
                            "ja, löschen!": function () {
                                $(this).dialog("close");
                                // Variable zum rückgängig machen erstellen
                                window.apf.deleted = window.apf.tpopmassnber;
                                window.apf.deleted.typ = "tpopmassnber";
                                var deleteTPopMassnBer = $.ajax({
                                    type: 'delete',
                                    url: 'api/v1/apflora/tabelle=tblTeilPopMassnBericht/tabelleIdFeld=TPopMassnBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                                });
                                deleteTPopMassnBer.done(function () {
                                    delete localStorage.tpopmassnberId;
                                    delete window.apf.tpopmassnber;
                                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                                    // Parent Node-Beschriftung: Anzahl anpassen
                                    window.apf.beschrifteOrdnerPopmassnber(parentNode);
                                    // Hinweis zum rückgängig machen anzeigen
                                    frageObUndeleteDatensatz("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                });
                                deleteTPopMassnBer.fail(function () {
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
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
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
                "icon": "style/images/flora_icon_violett.png",
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobZugeordnetNodeAusgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beobNichtBeurteilt":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
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
                "label": "auf Luftbild einer Teilpopulation<br>&nbsp;&nbsp;&nbsp;zuordnen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
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
                "label": "im GIS-Browser zeigen",
                "separator_before": true,
                "icon": "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beobNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobZugeordnetNodeAusgeschnitten, parentNode, "first");
                }
            };
        }
        return items;
    case "apOrdnerBeobNichtZuzuordnen":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobZugeordnetNodeAusgeschnitten, aktiverNode, "first");
                }
            };
        }
        return items;
    case "beobNichtZuzuordnen":
        items = {
            "GoogleMaps": {
                "label": "auf Luftbild zeigen",
                "separator_before": true,
                "icon": "style/images/flora_icon_violett.png",
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
                "label": "im GIS-Browser zeigen",
                "separator_before": true,
                "icon": "style/images/wappen_zuerich.png",
                "action": function () {
                    zeigeBeobKoordinatenImGisBrowser();
                }
            }
        };
        if (!window.apf.beobNodeAusgeschnitten) {
            items.ausschneiden = {
                //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                "label": "ausschneiden",
                "separator_before": true,
                "icon": "style/images/ausschneiden.png",
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
                "icon": "style/images/einfuegen.png",
                "action": function () {
                    $("#tree").jstree("move_node", window.apf.beobZugeordnetNodeAusgeschnitten, parentNode, "first");
                }
            };
        }
        return items;
    }
};

module.exports = returnFunction;