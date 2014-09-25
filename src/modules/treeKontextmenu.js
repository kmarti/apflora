'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var treeKontextmenu = function(node) {
    var items,
        aktiver_node,
        aktiver_nodeText,
        parent_node,
        parent_nodeText,
        grandparent_node,
        neue_apziele_node;
    // relevante nodes zwischenspeichern
    // aktiver_node = node;	 das hat auch funktioniert
    aktiver_node = $("#tree").jstree('get_selected');
    aktiver_nodeText = $.jstree._reference(aktiver_node).get_text(aktiver_node);
    // parent nur ermitteln, wenn parents exisiteren - sonst gibt es einen Fehler
    if ($(aktiver_node).attr("typ").slice(0, 9) !== "ap_ordner" && $(aktiver_node).attr("typ") !== "idealbiotop") {
        parent_node = $.jstree._reference(aktiver_node)._get_parent(aktiver_node);
        parent_nodeText = $.jstree._reference(parent_node).get_text(parent_node);
    }
    switch($(aktiver_node).attr("typ")) {
        case "ap_ordner_pop":
            items = {
                "untergeordneteKnotenOeffnen": {
                    "label": "untergeordnete Knoten öffnen",
                    "icon": "style/images/tree16x16.png",
                    "action": function() {
                        $.jstree._reference(node).open_all(node);
                    }
                },
                "neu": {
                    "label": "neue Population",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertPop = $.ajax({
                            type: 'post',
                            url: 'php/pop_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "typ": "pop",
                                "user": sessionStorage.User
                            }
                        });
                        insertPop.always(function(id) {
                            var strukturtyp = "pop",
                                beschriftung = "neue Population";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertPop.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Population erstellt");
                            console.log('Fehler: Keine neue Population erstellt');
                        });
                    }
                },
                "GeoAdminMaps": {
                    "label": "auf CH-Karten zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_gelb.png",
                    "action": function() {
                        var getPopsChKarte = $.ajax({
                            type: 'get',
                            url: 'php/pops_ch_karte.php',
                            dataType: 'json',
                            data: {
                                "ApArtId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getPopsChKarte.always(function(data) {
                            if (data.rows.length > 0) {
                                window.apf.zeigePopAufOlmap();
                                //window.apf.zeigePopAufOlmap(data);
                            } else {
                                window.apf.melde("Die Population hat keine Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getPopsChKarte.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "GoogleMaps": {
                    "label": "auf Google-Karten zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon.png",
                    "action": function() {
                        var getApKarte = $.ajax({
                            type: 'get',
                            url: 'php/ap_karte.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getApKarte.always(function(data) {
                            if (data.rows.length > 0) {
                                window.apf.gmap.zeigeTPop(data);
                            } else {
                                window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getApKarte.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                }
            };
            if (window.apf.pop_zum_verschieben_gemerkt) {
                items.einfuegen = {
                    "label": "'" + window.apf.pop_bezeichnung + "' einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        // db aktualisieren
                        var updatePop = $.ajax({
                            type: 'post',
                            url: 'php/pop_update.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.pop_id,
                                "Feld": "ApArtId",
                                "Wert": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        updatePop.always(function() {
                            var erstelleTree = require('./erstelleTree');
                            // Baum neu aufbauen
                            $.when(erstelleTree(window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))))
                                .then(function() {
                                    // dann den eingefügten Node wählen
                                    $("#tree").jstree("select_node", "[typ='pop']#" + localStorage.pop_id);
                                });
                            // einfügen soll nicht mehr angezeigt werden
                            delete window.apf.pop_zum_verschieben_gemerkt;
                            // nicht mehr benötigte Variablen entfernen
                            delete window.apf.pop_bezeichnung;
                            delete window.apf.pop_id;
                        });
                        updatePop.fail(function() {
                            //window.apf.melde("Fehler: Die Population wurde nicht verschoben");
                            console.log('Fehler: Die Population wurde nicht verschoben');
                        });
                    }
                }
            }
            return items;
        case "ap_ordner_apziel":
            items = {
                "untergeordneteKnotenOeffnen": {
                    "label": "untergeordnete Knoten öffnen",
                    "icon": "style/images/tree16x16.png",
                    "action": function() {
                        $.jstree._reference(node).open_all(node);
                    }
                },
                "neu": {
                    "label": "neues Ziel",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertApziel = $.ajax({
                            type: 'post',
                            url: 'php/apziel_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "typ": "apziel",
                                "user": sessionStorage.User
                            }
                        });
                        insertApziel.always(function(id) {
                            var strukturtyp = "apziel",
                                beschriftung = "neues Ziel";
                            // mitteilen, dass von ganz oben ein apziel erstellt wird und daher noch ein Zwischenordner erstellt werden muss
                            localStorage.apziel_von_ordner_apziel = true;
                            // zur Sicherheit den anderen Zeiger löschen
                            delete localStorage.apziel_von_apzieljahr;
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertApziel.fail(function() {
                            //window.apf.melde("Fehler: Keine neues AP-Ziel erstellt");
                            console.log('Fehler: Keine neues AP-Ziel erstellt');
                        });
                    }
                }
            };
            return items;
        case "apzieljahr":
            items = {
                "untergeordneteKnotenOeffnen": {
                    "label": "untergeordnete Knoten öffnen",
                    "icon": "style/images/tree16x16.png",
                    "action": function() {
                        $.jstree._reference(node).open_all(node);
                    }
                },
                "neu": {
                    "label": "neues Ziel",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertApziel_2 = $.ajax({
                            type: 'post',
                            url: 'php/apziel_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "apziel",
                                "user": sessionStorage.User
                            }
                        });
                        insertApziel_2.always(function(id) {
                            var strukturtyp = "apziel",
                                beschriftung = "neues Ziel";
                            localStorage.apziel_von_apzieljahr = true;
                            // zur Sicherheit den anderen Zeiger löschen
                            delete localStorage.apziel_von_ordner_apziel;
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertApziel_2.fail(function() {
                            //window.apf.melde("Fehler: Keine neues Ziel erstellt");
                            console.log('Fehler: Keine neues Ziel erstellt');
                        });
                    }
                }
            };
            return items;
        case "apziel":
            items = {
                "neu": {
                    "label": "neues Ziel",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        grandparent_node = $.jstree._reference(parent_node)._get_parent(parent_node);
                        var insertApziel_3 = $.ajax( {
                            type: 'post',
                            url: 'php/apziel_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(grandparent_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertApziel_3.always(function(id) {
                            var strukturtyp = "apziel",
                                beschriftung = "neues Ziel";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertApziel_3.fail(function() {
                            //window.apf.melde("Fehler: Kein neues AP-Ziel erstellt");
                            console.log('Fehler: Kein neues AP-Ziel erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Das AP-Ziel '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.apziel;
                                    window.apf.deleted.typ = "apziel";
                                    var deleteApziel = $.ajax({
                                        type: 'post',
                                        url: 'php/apziel_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteApziel.always(function() {
                                        delete localStorage.apziel_id;
                                        delete window.apf.apziel;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // grandparent Node-Beschriftung: Anzahl anpassen
                                        grandparent_node = $.jstree._reference(parent_node)._get_parent(parent_node);
                                        window.apf.beschrifte_ordner_apziel(grandparent_node);
                                        // parent Node-Beschriftung: Anzahl anpassen
                                        if ($.jstree._reference(parent_node).get_text(parent_node) !== "neue AP-Ziele") {
                                            window.apf.beschrifte_ordner_apzieljahr(parent_node);
                                        }
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Das AP-Ziel '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteApziel.fail(function() {
                                        //window.apf.melde("Fehler: Das AP-Ziel wurde nicht gelöscht");
                                        console.log('Fehler: Das AP-Ziel wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "zielber_ordner":
            items = {
                "neu": {
                    "label": "neuer Ziel-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertZielber = $.ajax({
                            type: 'post',
                            url: 'php/zielber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertZielber.always(function(id) {
                            var strukturtyp = "zielber",
                                beschriftung = "neuer Ziel-Bericht";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertZielber.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Ziel-Bericht erstellt");
                            console.log('Fehler: Keinen neuen Ziel-Bericht erstellt');
                        });
                    }
                }
            };
            return items;
        case "zielber":
            items = {
                "neu": {
                    "label": "neuer Ziel-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertZielber_2 = $.ajax({
                            type: 'post',
                            url: 'php/zielber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "zielber",
                                "user": sessionStorage.User
                            }
                        });
                        insertZielber_2.always(function(id) {
                            var strukturtyp = "zielber",
                                beschriftung = "neuer Ziel-Bericht";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertZielber_2.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Ziel-Bericht erstellt");
                            console.log('Fehler: Keinen neuen Ziel-Bericht erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Der Ziel-Bericht '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.zielber;
                                    window.apf.deleted.typ = "zielber";
                                    var deleteZielber = $.ajax({
                                        type: 'post',
                                        url: 'php/zielber_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteZielber.always(function() {
                                        delete localStorage.zielber_id;
                                        delete window.apf.zielber;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_zielber(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Ziel-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteZielber.fail(function() {
                                        //window.apf.melde("Fehler: Der Ziel-Bericht wurde nicht gelöscht");
                                        console.log('Fehler: Der Ziel-Bericht wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "ap_ordner_erfkrit":
            items = {
                "neu": {
                    "label": "neues Erfolgskriterium",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertErfkrit = $.ajax({
                            type: 'post',
                            url: 'php/erfkrit_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertErfkrit.always(function(id) {
                            var strukturtyp = "erfkrit",
                                beschriftung = "neues Erfolgskriterium";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertErfkrit.fail(function() {
                            //window.apf.melde("Fehler: Kein neues Erfolgskriterium erstellt");
                            console.log('Fehler: Kein neues Erfolgskriterium erstellt');
                        });
                    }
                }
            };
            return items;
        case "erfkrit":
            items = {
                "neu": {
                    "label": "neues Erfolgskriterium",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertErfkrit_2 = $.ajax({
                            type: 'post',
                            url: 'php/erfkrit_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "erfkrit",
                                "user": sessionStorage.User
                            }
                        });
                        insertErfkrit_2.always(function(id) {
                            var strukturtyp = "erfkrit",
                                beschriftung = "neues Erfolgskriterium";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertErfkrit_2.fail(function() {
                            //window.apf.melde("Fehler: Kein neues Erfolgskriterium erstellt");
                            console.log('Fehler: Kein neues Erfolgskriterium erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Das Erfolgskriterium '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.erfkrit;
                                    window.apf.deleted.typ = "erfkrit";
                                    var deleteErfkrit = $.ajax({
                                        type: 'post',
                                        url: 'php/erfkrit_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteErfkrit.always(function() {
                                        delete localStorage.erfkrit_id;
                                        delete window.apf.erfkrit;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_erfkrit(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Das Erfolgskriterium '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteErfkrit.fail(function() {
                                        //window.apf.melde("Fehler: Das Erfolgskriterium wurde nicht gelöscht");
                                        console.log('Fehler: Das Erfolgskriterium wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "ap_ordner_jber":
            items = {
                "untergeordneteKnotenOeffnen": {
                    "label": "untergeordnete Knoten öffnen",
                    "icon": "style/images/tree16x16.png",
                    "action": function() {
                        $.jstree._reference(node).open_all(node);
                    }
                },
                "neu": {
                    "label": "neuer AP-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertJber = $.ajax({
                            type: 'post',
                            url: 'php/jber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertJber.always(function(id) {
                            var strukturtyp = "jber",
                                beschriftung = "neuer AP-Bericht";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertJber.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen AP-Bericht erstellt");
                            console.log('Fehler: Keinen neuen AP-Bericht erstellt');
                        });
                    }
                }
            };
            return items;
        case "jber":
            items = {
                "neu": {
                    "label": "neuer AP-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertJber_2 = $.ajax({
                            type: 'post',
                            url: 'php/jber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "jber",
                                "user": sessionStorage.User
                            }
                        });
                        insertJber_2.always(function(id) {
                            var strukturtyp = "jber",
                                beschriftung = "neuer AP-Bericht";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertJber_2.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen AP-Bericht erstellt");
                            console.log('Fehler: Keinen neuen AP-Bericht erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Der AP-Bericht '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.jber;
                                    window.apf.deleted.typ = "jber";
                                    var deleteJber = $.ajax({
                                        type: 'post',
                                        url: 'php/jber_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteJber.always(function() {
                                        delete localStorage.jber_id;
                                        delete window.apf.jber;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_jber(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der AP-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteJber.fail(function() {
                                        //window.apf.melde("Fehler: Der AP-Bericht wurde nicht gelöscht");
                                        console.log('Fehler: Der AP-Bericht wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            // Wenn noch keine existiert, kann einen neue Übersicht zu allen Arten erstellt werden
            if ($.jstree._reference(aktiver_node)._get_children(aktiver_node).length === 0) {
                items.neu_jber_uebersicht = {
                    "label": "neue Übersicht zu allen Arten",
                    "separator_before": true,
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertJberUebersicht = $.ajax({
                            type: 'post',
                            url: 'php/jber_uebersicht_insert.php',
                            dataType: 'json',
                            data: {
                                "JbuJahr": $.jstree._reference(aktiver_node).get_text(aktiver_node),
                                "user": sessionStorage.User
                            }
                        });
                        insertJberUebersicht.always(function(data) {
                            var strukturtyp = "jber_uebersicht",
                                ds_id = $.jstree._reference(aktiver_node).get_text(aktiver_node),
                                beschriftung = "neue Übersicht zu allen Arten";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, ds_id, beschriftung);
                        });
                        insertJberUebersicht.fail(function() {
                            //window.apf.melde("Fehler: Keine Übersicht zu allen Arten erstellt");
                            console.log('Fehler: Keine Übersicht zu allen Arten erstellt');
                        });
                    }
                }
            }
            return items;
        case "jber_uebersicht":
            items = {
                "loeschen": {
                    "label": "lösche Übersicht zu allen Arten",
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Die Übersicht zu allen Arten wird gelöscht");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.jber_übersicht;
                                    window.apf.deleted.typ = "jber_uebersicht";
                                    var deleteJberUebersicht = $.ajax({
                                        type: 'post',
                                        url: 'php/jber_uebersicht_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "jahr": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteJberUebersicht.always(function() {
                                        delete localStorage.jber_uebersicht_id;
                                        delete window.apf.jber_übersicht;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Übersicht für den AP-Bericht des Jahrs \"" + window.apf.deleted.JbuJahr + "\" wurde gelöscht.");
                                    });
                                    deleteJberUebersicht.fail(function() {
                                        //window.apf.melde("Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht");
                                        console.log('Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "ap_ordner_ber":
            items = {
                "neu": {
                    "label": "neuer Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertBer = $.ajax({
                            type: 'post',
                            url: 'php/ber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertBer.always(function(id) {
                            var strukturtyp = "ber",
                                beschriftung = "neuer Bericht";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertBer.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Bericht erstellt");
                            console.log('Fehler: Keinen neuen Bericht erstellt');
                        });
                    }
                }
            };
            return items;
        case "ber":
            items = {
                "neu": {
                    "label": "Neuer Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertBer_2 = $.ajax({
                            type: 'post',
                            url: 'php/ber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "ber",
                                "user": sessionStorage.User
                            }
                        });
                        insertBer_2.always(function(id) {
                            var strukturtyp = "ber",
                                beschriftung = "neuer Bericht";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertBer_2.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Bericht erstellt");
                            console.log('Fehler: Keinen neuen Bericht erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Der Bericht '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.ber;
                                    window.apf.deleted.typ = "ber";
                                    var deleteBer = $.ajax({
                                        type: 'post',
                                        url: 'php/ber_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteBer.always(function() {
                                        delete localStorage.ber_id;
                                        delete window.apf.ber;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_ber(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Bericht '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteBer.fail(function() {
                                        //window.apf.melde("Fehler: Der Bericht wurde nicht gelöscht");
                                        console.log('Fehler: Der Bericht wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "ap_ordner_assozarten":
            items = {
                "neu": {
                    "label": "neue assoziierte Art",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertAssozarten = $.ajax({
                            type: 'post',
                            url: 'api/insert/tabelle=tblAssozArten/feld=AaApArtId/wert=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/user=' + sessionStorage.User,
                            dataType: 'json'
                        });
                        insertAssozarten.done(function(id) {
                            var strukturtyp = "assozarten",
                                beschriftung = "neue assoziierte Art";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertAssozarten.fail(function() {
                            //window.apf.melde("Fehler: keine assoziierte Art erstellt");
                            console.log('Fehler: keine assoziierte Art erstellt');
                        });
                    }
                }
            };
            return items;
        case "assozarten":
            items = {
                "neu": {
                    "label": "neue assoziierte Art",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertAssozarten_2 = $.ajax({
                            type: 'post',
                            url: 'api/insert/tabelle=tblAssozArten/feld=AaApArtId/wert=' + window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")) + '/user=' + sessionStorage.User,
                            dataType: 'json'
                        });
                        insertAssozarten_2.done(function(id) {
                            var strukturtyp = "assozarten",
                                beschriftung = "neue assoziierte Art";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertAssozarten_2.fail(function() {
                            //window.apf.melde("Fehler: Keine assoziierte Art erstellt");
                            console.log('Fehler: Keine assoziierte Art erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Die assoziierte Art '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.assozarten;
                                    window.apf.deleted.typ = "assozarten";
                                    var deleteAssozarten = $.ajax({
                                        type: 'post',
                                        url: 'api/delete/tabelle=tblAssozArten/tabelleIdFeld=AaId/tabelleId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                        dataType: 'json'
                                    });
                                    deleteAssozarten.done(function() {
                                        console.log('assozart gelöscht');
                                        delete localStorage.assozarten_id;
                                        delete window.apf.assozarten;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_assozarten(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die assoziierte Art '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteAssozarten.fail(function() {
                                        //window.apf.melde("Fehler: Die assoziierte Art wurde nicht gelöscht");
                                        console.log('Fehler: Die assoziierte Art wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "pop":
            items = {
                "neu": {
                    "label": "neue Population",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertPop_2 = $.ajax( {
                            type: 'post',
                            url: 'php/pop_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "pop",
                                "user": sessionStorage.User
                            }
                        });
                        insertPop_2.always(function(id) {
                            var strukturtyp = "pop",
                                beschriftung = "neue Population";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertPop_2.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Population erstellt");
                            console.log('Fehler: Keine neue Population erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Die Population '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.pop;
                                    window.apf.deleted.typ = "pop";
                                    var deletePop = $.ajax({
                                        type: 'post',
                                        url: 'php/pop_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deletePop.always(function() {
                                        delete localStorage.pop_id;
                                        delete window.apf.pop;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_pop(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Population '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deletePop.fail(function() {
                                        //window.apf.melde("Fehler: Die Population wurde nicht gelöscht");
                                        console.log('Fehler: Die Population wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
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
                    "action": function() {
                        var getPopChKarte_2 = $.ajax({
                            type: 'get',
                            url: 'php/pop_ch_karte.php',
                            dataType: 'json',
                            data: {
                                "pop_id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getPopChKarte_2.always(function(data) {
                            if (data.rows.length > 0) {
                                window.apf.zeigePopAufOlmap(data);
                            } else {
                                window.apf.melde("Die Population hat keine Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getPopChKarte_2.fail(function() {
                            //window.apf.melde("Fehler: Keine Populationen erhalten");
                            console.log('Fehler: Keine Populationen erhalten');
                        });
                    }
                },
                "GoogleMaps": {
                    "label": "auf Google-Karten zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon.png",
                    "action": function() {
                        var getPopKarte = $.ajax({
                            type: 'get',
                            url: 'php/pop_karte.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getPopKarte.always(function(data) {
                            if (data.rows.length > 0) {
                                window.apf.gmap.zeigeTPop(data);
                            } else {
                                window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getPopKarte.fail(function() {
                            //window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
                            console.log('Fehler: Keine Teilpopulationen erhalten');
                        });
                    }
                }
            };
            if (!window.apf.pop_zum_verschieben_gemerkt) {
                items.ausschneiden = {
                    "label": "zum Verschieben merken",
                    "separator_before": true,
                    "icon": "style/images/ausschneiden.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // Jetzt die PopId merken - ihr muss danach eine andere ApArtId zugeteilt werden
                        window.apf.pop_id = window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"));
                        // merken, dass ein node ausgeschnitten wurde
                        window.apf.pop_zum_verschieben_gemerkt = true;
                        // und wie er heisst (um es später im Kontextmenü anzuzeigen)
                        window.apf.pop_bezeichnung = $("#PopNr").val() + " " + $("#PopName").val();

                    }
                }
            }
            if (window.apf.pop_zum_verschieben_gemerkt) {
                items.einfuegen = {
                    "label": "'" + window.apf.pop_bezeichnung + "' einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        var popid = window.apf.pop_id;
                        var apartid = window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id"));
                        // db aktualisieren
                        var updatePop_2 = $.ajax({
                            type: 'post',
                            url: 'php/pop_update.php',
                            dataType: 'json',
                            data: {
                                "id": popid,
                                "Feld": "ApArtId",
                                "Wert": apartid,
                                "user": sessionStorage.User
                            }
                        });
                        updatePop_2.always(function() {
                            var erstelleTree = require('./erstelleTree');
                            // Baum wieder aufbauen
                            $.when(erstelleTree(apartid))
                                .then(function() {
                                    // dann den eingefügten Node wählen
                                    $("#tree").jstree("select_node", "[typ='pop']#" + popid);
                                });
                            // einfügen soll nicht mehr angezeigt werden
                            delete window.apf.pop_zum_verschieben_gemerkt;
                            // nicht mehr benötigte Variablen entfernen
                            delete window.apf.pop_bezeichnung;
                            delete window.apf.pop_id;
                        });
                        updatePop_2.fail(function() {
                            //window.apf.melde("Fehler: Die Population wurde nicht verschoben");
                            console.log('Fehler: Die Population wurde nicht verschoben');
                        });
                    }
                }
            }
            return items;
        case "pop_ordner_tpop":
            items = {
                "untergeordneteKnotenOeffnen": {
                    "label": "untergeordnete Knoten öffnen",
                    "icon": "style/images/tree16x16.png",
                    "action": function() {
                        $.jstree._reference(node).open_all(node);
                    }
                },
                "neu": {
                    "label": "neue Teilpopulation",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPop = $.ajax({
                            type: 'post',
                            url: 'php/tpop_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "typ": "tpop",
                                "user": sessionStorage.User
                            }
                        });
                        insertTPop.always(function(id) {
                            var strukturtyp = "tpop",
                                beschriftung = "neue Teilpopulation";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPop.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Teilpopulation erstellt");
                            console.log('Fehler: Keine neue Teilpopulation erstellt');
                        });
                    }
                },
                "GeoAdminMaps": {
                    "label": "auf CH-Karten zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_gelb.png",
                    "action": function() {
                        var getTpopsKarte = $.ajax({
                            type: 'get',
                            url: 'php/tpops_karte.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getTpopsKarte.always(function(data) {
                            if (data.rows.length > 0) {
                                window.apf.zeigeTPopAufOlmap(data);
                            } else {
                                window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getTpopsKarte.fail(function() {
                            //window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
                            console.log('Fehler: Keine Teilpopulationen erhalten');
                        });
                    }
                },
                "GoogleMaps": {
                    "label": "auf Google-Karten zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon.png",
                    "action": function() {
                        var getPopKarte_2 = $.ajax({
                            type: 'get',
                            url: 'php/pop_karte.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getPopKarte_2.always(function(data) {
                            if (data.rows.length > 0) {
                                window.apf.gmap.zeigeTPop(data);
                            } else {
                                window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getPopKarte_2.fail(function() {
                            //window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
                            console.log('Fehler: Keine Teilpopulationen erhalten');
                        });
                    }
                }
            };
            if (window.apf.tpop_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpop_node_ausgeschnitten).get_text(window.apf.tpop_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(aktiver_node).move_node(window.apf.tpop_node_ausgeschnitten, aktiver_node, "first", false);
                    }
                }
            }
            if (window.apf.tpop_node_kopiert) {
                label = "";
                if (window.apf.tpop_objekt_kopiert.TPopNr) {
                    label += window.apf.tpop_objekt_kopiert.TPopNr;
                } else {
                    label += "(keine Nr.)";
                }
                label += ": ";
                if (window.apf.tpop_objekt_kopiert.TPopFlurname) {
                    label += window.apf.tpop_objekt_kopiert.TPopFlurname;
                } else {
                    label += "(kein Flurname)";
                }
                items.einfuegen = {
                    //"label": $.jstree._reference(window.apf.tpop_node_kopiert).get_text(window.apf.tpop_node_kopiert) + " einfügen",
                    "label": label + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        window.apf.tpopKopiertInPopOrdnerTpopEinfügen(aktiver_node);
                    }
                }
            }
            return items;
        case "tpop":
            items = {
                "untergeordneteKnotenOeffnen": {
                    "label": "untergeordnete Knoten öffnen",
                    "icon": "style/images/tree16x16.png",
                    "action": function() {
                        $.jstree._reference(node).open_all(node);
                    }
                },
                "neu": {
                    "label": "neue Teilpopulation",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPop_2 = $.ajax({
                            type: 'post',
                            url: 'php/tpop_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "tpop",
                                "user": sessionStorage.User
                            }
                        });
                        insertTPop_2.always(function(id) {
                            var strukturtyp = "tpop",
                                beschriftung = "neue Teilpopulation";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPop_2.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Teilpopulation erstellt");
                            console.log('Fehler: Keine neue Teilpopulation erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
                        $.jstree._reference(aktiver_node).deselect_all();
                        // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
                        $.jstree._reference(aktiver_node).open_all(aktiver_node);
                        $.jstree._reference(aktiver_node).deselect_all();
                        $.jstree._reference(aktiver_node).select_node(aktiver_node);
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Die Teilpopulation '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.tpop;
                                    window.apf.deleted.typ = "tpop";
                                    // löschen
                                    var deleteTPop = $.ajax({
                                        type: 'post',
                                        url: 'php/tpop_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteTPop.always(function() {
                                        delete localStorage.tpop_id;
                                        delete window.apf.tpop;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_tpop(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Teilpopulation '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteTPop.fail(function() {
                                        //window.apf.melde("Fehler: Die Teilpopulation wurde nicht gelöscht");
                                        console.log('Fehler: Die Teilpopulation wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
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
                    "action": function() {
                        var getTPopKarte_2 = $.ajax({
                            type: 'get',
                            url: 'php/tpop_karte.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getTPopKarte_2.always(function(data) {
                            if (data.rows.length > 0) {
                                window.apf.zeigeTPopAufOlmap(data);
                            } else {
                                window.apf.melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getTPopKarte_2.fail(function() {
                            //window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
                            console.log('Fehler: Keine Teilpopulationen erhalten');
                        });
                    }
                },
                "verortenGeoAdmin": {
                    "label": "auf CH-Karten verorten",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_rot.png",
                    "action": function() {
                        var getTPop_2 = $.ajax({
                            type: 'get',
                            url: 'php/tpop.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getTPop_2.always(function(data) {
                            window.apf.verorteTPopAufOlmap(data);
                        });
                        getTPop_2.fail(function() {
                            //window.apf.melde("Fehler: Keine Teilpopulation erhalten");
                            console.log('Fehler: Keine Teilpopulation erhalten');
                        });
                    }
                },
                "GoogleMaps": {
                    "label": "auf Google-Karten zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon.png",
                    "action": function() {
                        var getTPopKarte_3 = $.ajax({
                            type: 'get',
                            url: 'php/tpop_karte.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getTPopKarte_3.always(function(data) {
                            if (data.rows.length > 0) {
                                window.apf.gmap.zeigeTPop(data);
                            } else {
                                window.apf.melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getTPopKarte_3.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "verorten": {
                    "label": "auf Google-Karten verorten",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_rot.png",
                    "action": function() {
                        var getTPop_3 = $.ajax({
                            type: 'get',
                            url: 'php/tpop.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                            }
                        });
                        getTPop_3.always(function(data) {
                            window.apf.gmap.verorteTPop(data);
                        });
                        getTPop_3.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "GisBrowser": {
                    "label": "im GIS-Browser zeigen",
                    "separator_before": true,
                    "icon": "style/images/wappen_zuerich.png",
                    "action": function() {
                        window.apf.zeigeBeobKoordinatenImGisBrowser();
                    }
                }
            };
            if (!window.apf.tpop_node_ausgeschnitten) {
                items.ausschneiden = {
                    //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                    "label": "ausschneiden",
                    "separator_before": true,
                    "icon": "style/images/ausschneiden.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.tpop_node_ausgeschnitten = aktiver_node;
                        // es macht keinen Sinn mehr, den kopierten node zu behalten
                        // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                        delete window.apf.tpop_node_kopiert;
                        delete window.apf.tpop_objekt_kopiert;
                    }
                }
            }
            if (!window.apf.tpop_node_ausgeschnitten) {
                items.kopieren = {
                    "label": "kopieren",
                    "separator_before": true,
                    "icon": "style/images/kopieren.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.tpop_node_kopiert = aktiver_node;
                        // Daten des Objekts holen
                        var getTPop_4 = $.ajax({
                            type: 'get',
                            url: 'php/tpop.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(window.apf.tpop_node_kopiert).attr("id"))
                            }
                        });
                        getTPop_4.always(function(data) {
                            window.apf.tpop_objekt_kopiert = data;
                        });
                        getTPop_4.fail(function() {
                            //window.apf.melde("Fehler: Die Teilpopulation wurde nicht kopiert");
                            console.log('Fehler: Die Teilpopulation wurde nicht kopiert');
                        });
                    }
                }
            }
            if (window.apf.tpop_node_kopiert) {
                var label = "";
                if (window.apf.tpop_objekt_kopiert.TPopNr) {
                    label += window.apf.tpop_objekt_kopiert.TPopNr;
                } else {
                    label += "(keine Nr.)";
                }
                label += ": ";
                if (window.apf.tpop_objekt_kopiert.TPopFlurname) {
                    label += window.apf.tpop_objekt_kopiert.TPopFlurname;
                } else {
                    label += "(kein Flurname)";
                }
                items.einfuegen = {
                    "label": label + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        window.apf.tpopKopiertInPopOrdnerTpopEinfügen(parent_node);
                    }
                }
            }
            if (window.apf.tpop_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpop_node_ausgeschnitten).get_text(window.apf.tpop_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(parent_node).move_node(window.apf.tpop_node_ausgeschnitten, parent_node, "first", false);
                    }
                }
            }
            return items;
        case "pop_ordner_popber":
            items = {
                "neu": {
                    "label": "neuer Populations-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertPopber = $.ajax({
                            type: 'post',
                            url: 'php/popber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertPopber.always(function(id) {
                            var strukturtyp = "popber",
                                beschriftung = "neuer Populations-Bericht";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertPopber.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Populations-Bericht erstellt");
                            console.log('Fehler: Keinen neuen Populations-Bericht erstellt');
                        });
                    }
                }
            };
            return items;
        case "popber":
            items = {
                "neu": {
                    "label": "neuer Populations-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertPopber_2 = $.ajax({
                            type: 'post',
                            url: 'php/popber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "popber",
                                "user": sessionStorage.User
                            }
                        });
                        insertPopber_2.always(function(id) {
                            var strukturtyp = "popber",
                                beschriftung = "neuer Populations-Bericht";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertPopber_2.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Populations-Bericht erstellt");
                            console.log('Fehler: Keinen neuen Populations-Bericht erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Der Populations-Bericht '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.popber;
                                    window.apf.deleted.typ = "popber";
                                    var deletePopber = $.ajax({
                                        type: 'post',
                                        url: 'php/popber_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deletePopber.always(function() {
                                        delete localStorage.popber_id;
                                        delete window.apf.popber;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_popber(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Populations-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deletePopber.fail(function() {
                                        //window.apf.melde("Fehler: Der Populations-Bericht wurde nicht gelöscht");
                                        console.log('Fehler: Der Populations-Bericht wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "pop_ordner_massnber":
            items = {
                "neu": {
                    "label": "neuer Massnahmen-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertPopMassnBer = $.ajax({
                            type: 'post',
                            url: 'php/popmassnber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertPopMassnBer.always(function(id) {
                            var strukturtyp = "popmassnber",
                                beschriftung = "neuer Massnahmen-Bericht";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertPopMassnBer.fail(function() {
                            //window.apf.melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
                            console.log('Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt');
                        });
                    }
                }
            };
            return items;
        case "popmassnber":
            items = {
                "neu": {
                    "label": "neuer Massnahmen-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertPopMassnBer_2 = $.ajax({
                            type: 'post',
                            url: 'php/popmassnber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "popmassnber",
                                "user": sessionStorage.User
                            }
                        });
                        insertPopMassnBer_2.always(function(id) {
                            var strukturtyp = "popmassnber",
                                beschriftung = "neuer Massnahmen-Bericht";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertPopMassnBer_2.fail(function() {
                            //window.apf.melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
                            console.log('Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.popmassnber;
                                    window.apf.deleted.typ = "popmassnber";
                                    var deletePopMassnBer = $.ajax({
                                        type: 'post',
                                        url: 'php/popmassnber_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deletePopMassnBer.always(function() {
                                        delete localStorage.popmassnber_id;
                                        delete window.apf.popmassnber;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_popmassnber(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deletePopMassnBer.fail(function() {
                                        //window.apf.melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
                                        console.log('Fehler: Der Massnahmen-Bericht wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "tpop_ordner_feldkontr":
            items = {
                "neu": {
                    "label": "neue Feldkontrolle",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopFeldKontr = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "typ": "tpopfeldkontr",
                                "user": sessionStorage.User
                            }
                        });
                        insertTPopFeldKontr.always(function(id) {
                            var strukturtyp = "tpopfeldkontr",
                                beschriftung = "neue Feldkontrolle";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopFeldKontr.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Feldkontrolle erstellt");
                            console.log('Fehler: Keine neue Feldkontrolle erstellt');
                        });
                    }
                }
            };
            if (window.apf.tpopfeldkontr_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopfeldkontr_node_ausgeschnitten).get_text(window.apf.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(aktiver_node).move_node(window.apf.tpopfeldkontr_node_ausgeschnitten, aktiver_node, "first", false);
                    }
                }
            }
            if (window.apf.tpopfeldkontr_node_kopiert) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopfeldkontr_node_kopiert).get_text(window.apf.tpopfeldkontr_node_kopiert) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        // und an die DB schicken
                        var insertTPopFeldKontrKopie = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_insert_kopie.php',
                            dataType: 'json',
                            data: {
                                "user": sessionStorage.User,
                                "TPopId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "TPopKontrId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id"))
                            }
                        });
                        insertTPopFeldKontrKopie.always(function(id) {
                            var strukturtyp = "tpopfeldkontr",
                                beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopFeldKontrKopie.fail(function() {
                            //window.apf.melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
                            console.log('Fehler: Die Feldkontrolle wurde nicht erstellt');
                        });
                    }
                }
            }
            return items;
        case "tpopfeldkontr":
            items = {
                "neu": {
                    "label": "neue Feldkontrolle",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopFeldKontr_2 = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "tpopfeldkontr",
                                "user": sessionStorage.User
                            }
                        });
                        insertTPopFeldKontr_2.always(function(id) {
                            var strukturtyp = "tpopfeldkontr",
                                beschriftung = "neue Feldkontrolle";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopFeldKontr_2.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Feldkontrolle erstellt");
                            console.log('Fehler: Keine neue Feldkontrolle erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Die Feldkontrolle '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.tpopfeldkontr;
                                    window.apf.deleted.typ = "tpopfeldkontr";
                                    var deleteTPopFeldKontr = $.ajax({
                                        type: 'post',
                                        url: 'php/tpopfeldkontr_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteTPopFeldKontr.always(function() {
                                        delete localStorage.tpopfeldkontr_id;
                                        delete window.apf.tpopfeldkontr;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_tpopfeldkontr(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Feldkontrolle '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteTPopFeldKontr.fail(function() {
                                        //window.apf.melde("Fehler: Die Feldkontrolle wurde nicht gelöscht");
                                        console.log('Fehler: Die Feldkontrolle wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
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
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
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
                    "action": function() {
                        var data = {};
                        data.id = window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"));
                        data.user = sessionStorage.User;
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        _.each(window.apf.feldkontr_biotop, function(value, key) {
                            $("#" + key).val(value);
                            data[key] = value;
                        });
                        // jetzt alles speichern
                        var updateTPopFeldKontrMultiple = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_update_multiple.php',
                            dataType: 'json',
                            data: data
                        });
                        updateTPopFeldKontrMultiple.fail(function() {
                            //window.apf.melde("Fehler: Das kopierte Biotop wurde nicht eingefügt");
                            console.log('Fehler: Das kopierte Biotop wurde nicht eingefügt');
                        });
                    }
                }
            }
            if (!window.apf.tpopfeldkontr_node_ausgeschnitten) {
                items.ausschneiden = {
                    //"label": "Feldkontrolle ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                    "label": "ausschneiden",
                    "separator_before": true,
                    "icon": "style/images/ausschneiden.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.tpopfeldkontr_node_ausgeschnitten = aktiver_node;
                        // es macht keinen Sinn mehr, den kopierten node zu behalten
                        // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                        delete window.apf.tpopfeldkontr_node_kopiert;
                        delete window.apf.tpopfeldkontr_objekt_kopiert;
                    }
                }
            }
            if (!window.apf.tpopfeldkontr_node_ausgeschnitten) {
                items.kopieren = {
                    "label": "kopieren",
                    "separator_before": true,
                    "icon": "style/images/kopieren.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.tpopfeldkontr_node_kopiert = aktiver_node;
                        // Daten des Objekts holen
                        var getTPopFeldkontr_2 = $.ajax({
                            type: 'get',
                            url: 'php/tpopfeldkontr.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id"))
                            }
                        });
                        getTPopFeldkontr_2.always(function(data) {
                            window.apf.tpopfeldkontr_objekt_kopiert = data;
                        });
                        getTPopFeldkontr_2.fail(function() {
                            //window.apf.melde("Fehler: Die Feldkontrolle wurde nicht kopiert");
                            console.log('Fehler: Die Feldkontrolle wurde nicht kopiert');
                        });
                    }
                }
            }
            if (window.apf.tpopfeldkontr_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopfeldkontr_node_ausgeschnitten).get_text(window.apf.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(parent_node).move_node(window.apf.tpopfeldkontr_node_ausgeschnitten, parent_node, "first", false);
                    }
                }
            }
            if (window.apf.tpopfeldkontr_node_kopiert) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopfeldkontr_node_kopiert).get_text(window.apf.tpopfeldkontr_node_kopiert) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        // und an die DB schicken
                        var insertTPopFeldKontrKopie_2 = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_insert_kopie.php',
                            dataType: 'json',
                            data: {
                                "user": sessionStorage.User,
                                "TPopId": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "TPopKontrId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id"))
                            }
                        });
                        insertTPopFeldKontrKopie_2.always(function(id) {
                            var strukturtyp = "tpopfeldkontr",
                                beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopFeldKontrKopie_2.fail(function() {
                            //window.apf.melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
                            console.log('Fehler: Die Feldkontrolle wurde nicht erstellt');
                        });
                    }
                }
            }
            return items;
        case "tpop_ordner_freiwkontr":
            items = {
                "neu": {
                    "label": "neue Freiwilligen-Kontrolle",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopFeldKontr_3 = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User,
                                "typ": "Freiwilligen-Erfolgskontrolle"
                            }
                        });
                        insertTPopFeldKontr_3.always(function(id) {
                            var strukturtyp = "tpopfreiwkontr",
                                beschriftung = "neue Freiwilligen-Kontrolle";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopFeldKontr_3.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
                            console.log('Fehler: Keine neue Freiwilligen-Kontrolle erstellt');
                        });
                    }
                }
            };
            if (window.apf.tpopfreiwkontr_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_ausgeschnitten).get_text(window.apf.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(aktiver_node).move_node(window.apf.tpopfreiwkontr_node_ausgeschnitten, aktiver_node, "first", false);
                    }
                }
            }
            if (window.apf.tpopfreiwkontr_node_kopiert) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_kopiert).get_text(window.apf.tpopfreiwkontr_node_kopiert) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        // und an die DB schicken
                        var insertTPopFeldKontrKopie_3 = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_insert_kopie.php',
                            dataType: 'json',
                            data: {
                                "user": sessionStorage.User,
                                "TPopId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "TPopKontrId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id"))
                            }
                        });
                        insertTPopFeldKontrKopie_3.always(function(id) {
                            var strukturtyp = "tpopfreiwkontr",
                                beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopFeldKontrKopie_3.fail(function() {
                            //window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
                            console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt');
                        });
                    }
                }
            }
            return items;
        case "tpopfreiwkontr":
            items = {
                "neu": {
                    "label": "neue Freiwilligen-Kontrolle",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopFeldKontr_4 = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "user": sessionStorage.User,
                                "typ": "Freiwilligen-Erfolgskontrolle"
                            }
                        });
                        insertTPopFeldKontr_4.always(function(id) {
                            var strukturtyp = "tpopfreiwkontr",
                                beschriftung = "neue Freiwilligen-Kontrolle";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopFeldKontr_4.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
                            console.log('Fehler: Keine neue Freiwilligen-Kontrolle erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.tpopfeldkontr;
                                    window.apf.deleted.typ = "tpopfreiwkontr";
                                    var deleteTPopFeldKontr_2 = $.ajax({
                                        type: 'post',
                                        url: 'php/tpopfeldkontr_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteTPopFeldKontr_2.always(function() {
                                        delete localStorage.tpopfeldkontr_id;
                                        delete localStorage.tpopfreiwkontr;
                                        delete window.apf.tpopfeldkontr;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_tpopfreiwkontr(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteTPopFeldKontr_2.fail(function() {
                                        //window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht gelöscht");
                                        console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            if (!window.apf.tpopfreiwkontr_node_ausgeschnitten) {
                items.ausschneiden = {
                    //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                    "label": "ausschneiden",
                    "separator_before": true,
                    "icon": "style/images/ausschneiden.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.tpopfreiwkontr_node_ausgeschnitten = aktiver_node;
                        // es macht keinen Sinn mehr, den kopierten node zu behalten
                        // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                        delete window.apf.tpopfreiwkontr_node_kopiert;
                        delete window.apf.tpopfreiwkontr_objekt_kopiert;
                    }
                }
            }
            if (!window.apf.tpopfreiwkontr_node_ausgeschnitten) {
                items.kopieren = {
                    "label": "kopieren",
                    "separator_before": true,
                    "icon": "style/images/kopieren.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.tpopfreiwkontr_node_kopiert = aktiver_node;
                        // Daten des Objekts holen
                        var getTPopFeldkontr_3 = $.ajax({
                            type: 'get',
                            url: 'php/tpopfeldkontr.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id"))
                            }
                        });
                        getTPopFeldkontr_3.always(function(data) {
                            window.apf.tpopfreiwkontr_objekt_kopiert = data;
                        });
                        getTPopFeldkontr_3.fail(function() {
                            //window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert");
                            console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert');
                        });
                    }
                }
            }
            if (window.apf.tpopfreiwkontr_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_ausgeschnitten).get_text(window.apf.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(parent_node).move_node(window.apf.tpopfreiwkontr_node_ausgeschnitten, parent_node, "first", false);
                        localStorage.tpopfreiwkontr = true;
                    }
                }
            }
            if (window.apf.tpopfreiwkontr_node_kopiert) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopfreiwkontr_node_kopiert).get_text(window.apf.tpopfreiwkontr_node_kopiert) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        var insertTPopFeldKontrKopie_4 = $.ajax({
                            type: 'post',
                            url: 'php/tpopfeldkontr_insert_kopie.php',
                            dataType: 'json',
                            data: {
                                "user": sessionStorage.User,
                                "TPopId": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "TPopKontrId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id"))
                            }
                        });
                        insertTPopFeldKontrKopie_4.always(function(id) {
                            var strukturtyp = "tpopfreiwkontr",
                                beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopFeldKontrKopie_4.fail(function() {
                            //window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
                            console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt');
                        });
                    }
                }
            }
            return items;
        case "tpop_ordner_massn":
            items = {
                "neu": {
                    "label": "neue Massnahme",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopMassn = $.ajax({
                            type: 'post',
                            url: 'php/tpopmassn_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "typ": "tpopmassn",
                                "user": sessionStorage.User
                            }
                        });
                        insertTPopMassn.always(function(id) {
                            var strukturtyp = "tpopmassn",
                                beschriftung = "neue Massnahme";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopMassn.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Massnahme erstellt");
                            console.log('Fehler: Keine neue Massnahme erstellt');
                        });
                    }
                }
            };
            if (window.apf.tpopmassn_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopmassn_node_ausgeschnitten).get_text(window.apf.tpopmassn_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(aktiver_node).move_node(window.apf.tpopmassn_node_ausgeschnitten, aktiver_node, "first", false);
                    }
                }
            }
            if (window.apf.tpopmassn_node_kopiert) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopmassn_node_kopiert).get_text(window.apf.tpopmassn_node_kopiert) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        var insertTPopMassnKopie = $.ajax({
                            type: 'post',
                            url: 'php/tpopmassn_insert_kopie.php',
                            dataType: 'json',
                            data: {
                                "user": sessionStorage.User,
                                "TPopId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "TPopMassnId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id"))
                            }
                        });
                        insertTPopMassnKopie.always(function(id) {
                            var strukturtyp = "tpopmassn",
                                beschriftung = window.apf.erstelleLabelFürMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopMassnKopie.fail(function() {
                            //window.apf.melde("Fehler: Die Massnahme wurde nicht erstellt");
                            console.log('Fehler: Die Massnahme wurde nicht erstellt');
                        });
                    }
                }
            }
            return items;
        case "tpopmassn":
            items = {
                "neu": {
                    "label": "neue Massnahme",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopMassn_2 = $.ajax({
                            type: 'post',
                            url: 'php/tpopmassn_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "tpopmassn",
                                "user": sessionStorage.User
                            }
                        });
                        insertTPopMassn_2.always(function(id) {
                            var strukturtyp = "tpopmassn",
                                beschriftung = "neue Massnahme";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopMassn_2.fail(function() {
                            //window.apf.melde("Fehler: Keine neue Massnahme erstellt");
                            console.log('Fehler: Keine neue Massnahme erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Die Massnahme '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.tpopmassn;
                                    window.apf.deleted.typ = "tpopmassn";
                                    var deleteTPopMassn = $.ajax({
                                        type: 'post',
                                        url: 'php/tpopmassn_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteTPopMassn.always(function() {
                                        delete localStorage.tpopmassn_id;
                                        delete window.apf.tpopmassn;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_tpopmassn(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Massnahme '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteTPopMassn.fail(function() {
                                        //window.apf.melde("Fehler: Die Massnahme wurde nicht gelöscht");
                                        console.log('Fehler: Die Massnahme wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            if (!window.apf.tpopmassn_node_ausgeschnitten) {
                items.ausschneiden = {
                    //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                    "label": "ausschneiden",
                    "separator_before": true,
                    "icon": "style/images/ausschneiden.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.tpopmassn_node_ausgeschnitten = aktiver_node;
                        // es macht keinen Sinn mehr, den kopierten node zu behalten
                        // und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
                        delete window.apf.tpopmassn_node_kopiert;
                        delete window.apf.tpopmassn_objekt_kopiert;
                    }
                }
            }
            if (!window.apf.tpopmassn_node_ausgeschnitten) {
                items.kopieren = {
                    "label": "kopieren",
                    "separator_before": true,
                    "icon": "style/images/kopieren.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.tpopmassn_node_kopiert = aktiver_node;
                        // Daten des Objekts holen
                        var getTPopMassn_2 = $.ajax({
                                type: 'get',
                                url: 'php/tpopmassn.php',
                                dataType: 'json',
                                data: {
                                    "id": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id"))
                                }
                            }),
                            $TPopMassnTypChecked = $("#TPopMassnTyp option:checked");
                        getTPopMassn_2.always(function(data) {
                            window.apf.tpopmassn_objekt_kopiert = data;
                            // den Beurteilungstext holen - ist nur mühsam aus der DB zu holen
                            window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = "";
                            if ($TPopMassnTypChecked.text()) {
                                window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = $TPopMassnTypChecked.text();
                            }
                        });
                        getTPopMassn_2.fail(function() {
                            //window.apf.melde("Fehler: Die Massnahme wurde nicht kopiert");
                            console.log('Fehler: Die Massnahme wurde nicht kopiert');
                        });
                    }
                }
            }
            if (window.apf.tpopmassn_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopmassn_node_ausgeschnitten).get_text(window.apf.tpopmassn_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(parent_node).move_node(window.apf.tpopmassn_node_ausgeschnitten, parent_node, "first", false);
                    }
                }
            }
            if (window.apf.tpopmassn_node_kopiert) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.tpopmassn_node_kopiert).get_text(window.apf.tpopmassn_node_kopiert) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        var insertTPopMassnKopie_2 = $.ajax({
                            type: 'post',
                            url: 'php/tpopmassn_insert_kopie.php',
                            dataType: 'json',
                            data: {
                                "user": sessionStorage.User,
                                "TPopId": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "TPopMassnId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id"))
                            }
                        });
                        insertTPopMassnKopie_2.always(function(id) {
                            var strukturtyp = "tpopmassn",
                                beschriftung = window.apf.erstelleLabelFürMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopMassnKopie_2.fail(function() {
                            //window.apf.melde("Fehler: Die Massnahme wurde nicht erstellt");
                            console.log('Fehler: Die Massnahme wurde nicht erstellt');
                        });
                    }
                }
            }
            return items;
        case "tpop_ordner_tpopber":
            items = {
                "neu": {
                    "label": "neuer Teilpopulations-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopBer = $.ajax({
                            type: 'post',
                            url: 'php/tpopber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertTPopBer.always(function(id) {
                            var strukturtyp = "tpopber",
                                beschriftung = "neuer Teilpopulations-Bericht";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopBer.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
                            console.log('Fehler: Keinen neuen Teilpopulations-Bericht erstellt');
                        });
                    }
                }
            };
            return items;
        case "tpopber":
            items = {
                "neu": {
                    "label": "neuer Teilpopulations-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopBer_2 = $.ajax({
                            type: 'post',
                            url: 'php/tpopber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "tpopber",
                                "user": sessionStorage.User
                            }
                        });
                        insertTPopBer_2.always(function(id) {
                            var strukturtyp = "tpopber",
                                beschriftung = "neuer Teilpopulations-Bericht";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopBer_2.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
                            console.log('Fehler: Keinen neuen Teilpopulations-Bericht erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Der Teilpopulations-Bericht '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.tpopber;
                                    window.apf.deleted.typ = "tpopber";
                                    var deleteTPopBer = $.ajax({
                                        type: 'post',
                                        url: 'php/tpopber_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteTPopBer.always(function() {
                                        delete localStorage.tpopber_id;
                                        delete window.apf.tpopber;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_tpopber(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Teilpopulations-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteTPopBer.fail(function() {
                                        //window.apf.melde("Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht");
                                        console.log('Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "tpop_ordner_beob_zugeordnet":
            items = {
                "GoogleMaps": {
                    "label": "auf Luftbild zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon.png",
                    "action": function() {
                        var getBeobKarte = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=/tpopId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/beobId=/nichtZuzuordnen=',
                            dataType: 'json'
                        });
                        getBeobKarte.done(function(data) {
                            if (data.length > 0) {
                                window.apf.gmap.zeigeTPopBeob(data);
                            } else {
                                window.apf.melde("Es gibt keine Beobachtungen mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                }
            };
            if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
                items = {};
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(aktiver_node).move_node(window.apf.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first", false);
                    }
                }
            }
            if (window.apf.beob_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.beob_node_ausgeschnitten).get_text(window.apf.beob_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $("#tree").jstree("move_node", window.apf.beob_node_ausgeschnitten, aktiver_node, "first");
                    }
                }
            }
            return items;
        case "beob_zugeordnet":
            items = {
                "GoogleMaps": {
                    "label": "auf Luftbild zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon.png",
                    "action": function() {
                        var getBeobKarte_2 = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=/tpopId=/beobId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/nichtZuzuordnen=',
                            dataType: 'json'
                        });
                        getBeobKarte_2.done(function(data) {
                            if (data.length > 0) {
                                window.apf.gmap.zeigeTPopBeob(data);
                            } else {
                                window.apf.melde("Die Beobachtung hat keine Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte_2.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "GoogleMapsMitTPopTPopBeob": {
                    "label": "auf Luftbild einer neuen<br>&nbsp;&nbsp;&nbsp;Teilpopulation zuordnen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_violett.png",
                    "action": function() {
                        var getBeobKarte_3 = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=/tpopId=/beobId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/nichtZuzuordnen=',
                            dataType: 'json'
                        });
                        getBeobKarte_3.done(function(beob) {
                            if (beob.length > 0) {
                                var getApKarte = $.ajax({
                                    type: 'get',
                                    url: 'php/ap_karte.php',
                                    dataType: 'json',
                                    data: {
                                        "id": localStorage.ap_id
                                    }
                                });
                                getApKarte.always(function(tpop) {
                                    if (tpop.rows.length > 0) {
                                        window.apf.gmap.zeigeBeobUndTPop(beob, tpop);
                                    } else {
                                        window.apf.gmap.zeigeBeob(beob);
                                    }
                                });
                            } else {
                                window.apf.melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte_3.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "GisBrowser": {
                    "label": "im GIS-Browser zeigen",
                    "separator_before": true,
                    "icon": "style/images/wappen_zuerich.png",
                    "action": function() {
                        window.apf.zeigeBeobKoordinatenImGisBrowser();
                    }
                }
            };
            if (!window.apf.beob_zugeordnet_node_ausgeschnitten) {
                items.ausschneiden = {
                    //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                    "label": "ausschneiden",
                    "separator_before": true,
                    "icon": "style/images/ausschneiden.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.beob_zugeordnet_node_ausgeschnitten = aktiver_node;
                    }
                }
            }
            if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
                items.einfuegen_beob_zugeordnet = {
                    "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(parent_node).move_node(window.apf.beob_zugeordnet_node_ausgeschnitten, parent_node, "first", false);
                    }
                }
            }
            if (window.apf.beob_node_ausgeschnitten) {
                items.einfuegen_beob = {
                    "label": $.jstree._reference(window.apf.beob_node_ausgeschnitten).get_text(window.apf.beob_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $.jstree._reference(parent_node).move_node(window.apf.beob_node_ausgeschnitten, parent_node, "first", false);
                    }
                }
            }
            return items;
        case "tpop_ordner_massnber":
            items = {
                "neu": {
                    "label": "neuer Massnahmen-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopMassnBer = $.ajax({
                            type: 'post',
                            url: 'php/tpopmassnber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
                                "user": sessionStorage.User
                            }
                        });
                        insertTPopMassnBer.always(function(id) {
                            var strukturtyp = "tpopmassnber",
                                beschriftung = "neuer Massnahmen-Bericht";
                            window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopMassnBer.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
                            console.log('Fehler: Keinen neuen Massnahmen-Bericht erstellt');
                        });
                    }
                }
            };
            return items;
        case "tpopmassnber":
            items = {
                "neu": {
                    "label": "neuer Massnahmen-Bericht",
                    "icon": "style/images/neu.png",
                    "action": function() {
                        var insertTPopMassBer_2 = $.ajax({
                            type: 'post',
                            url: 'php/tpopmassnber_insert.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
                                "typ": "tpopmassnber",
                                "user": sessionStorage.User
                            }
                        });
                        insertTPopMassBer_2.always(function(id) {
                            var strukturtyp = "tpopmassnber",
                                beschriftung = "neuer Massnahmen-Bericht";
                            window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
                        });
                        insertTPopMassBer_2.fail(function() {
                            //window.apf.melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
                            console.log('Fehler: Keinen neuen Massnahmen-Bericht erstellt');
                        });
                    }
                },
                "loeschen": {
                    "label": "löschen",
                    "separator_before": true,
                    "icon": "style/images/loeschen.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
                        $("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
                        $("#loeschen_dialog").dialog({
                            resizable: false,
                            height:'auto',
                            width: 400,
                            modal: true,
                            buttons: {
                                "ja, löschen!": function() {
                                    $(this).dialog("close");
                                    // Variable zum rückgängig machen erstellen
                                    window.apf.deleted = window.apf.tpopmassnber;
                                    window.apf.deleted.typ = "tpopmassnber";
                                    var deleteTPopMassnBer = $.ajax({
                                        type: 'post',
                                        url: 'php/tpopmassnber_delete.php',
                                        dataType: 'json',
                                        data: {
                                            "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                        }
                                    });
                                    deleteTPopMassnBer.always(function() {
                                        delete localStorage.tpopmassnber_id;
                                        delete window.apf.tpopmassnber;
                                        $.jstree._reference(aktiver_node).delete_node(aktiver_node);
                                        // Parent Node-Beschriftung: Anzahl anpassen
                                        window.apf.beschrifte_ordner_popmassnber(parent_node);
                                        // Hinweis zum rückgängig machen anzeigen
                                        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
                                    });
                                    deleteTPopMassnBer.fail(function() {
                                        //window.apf.melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
                                        console.log('Fehler: Der Massnahmen-Bericht wurde nicht gelöscht');
                                    });
                                },
                                "abbrechen": function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            };
            return items;
        case "ap_ordner_beob_nicht_beurteilt":
            items = {
                "GoogleMaps": {
                    "label": "auf Luftbild zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_violett.png",
                    "action": function() {
                        var getBeobKarte_4 = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen=',
                            dataType: 'json'
                        });
                        getBeobKarte_4.done(function(data) {
                            if (data.length > 0) {
                                window.apf.gmap.zeigeBeob(data);
                            } else {
                                window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte_4.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "GoogleMapsMitTPop": {
                    "label": "auf Luftbild Teilpopulationen<br>&nbsp;&nbsp;&nbsp;zuordnen<br>&nbsp;&nbsp;&nbsp;Tipp: Beobachtungen auf<br>&nbsp;&nbsp;&nbsp;Teilpopulationen ziehen!",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_violett.png",
                    "action": function() {
                        var getBeobKarte_5 = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen=',
                            dataType: 'json'
                        });
                        getBeobKarte_5.done(function(beob) {
                            if (beob.length > 0) {
                                $.ajax({
                                    type: 'get',
                                    url: 'php/ap_karte.php',
                                    dataType: 'json',
                                    data: {
                                        "id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
                                    },
                                    success: function(tpop) {
                                        if (tpop.rows.length > 0) {
                                            window.apf.gmap.zeigeBeobUndTPop(beob, tpop);
                                        } else {
                                            window.apf.gmap.zeigeBeob(beob);
                                        }
                                    }
                                });
                            } else {
                                window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte_5.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                }
            };
            if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first");
                    }
                }
            }
            return items;
        case "beob_nicht_beurteilt":
            items = {
                "GoogleMaps": {
                    "label": "auf Luftbild zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_violett.png",
                    "action": function() {
                        var getBeobKarte_6 = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=/tpopId=/beobId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/nichtZuzuordnen=',
                            dataType: 'json'
                        });
                        getBeobKarte_6.done(function(data) {
                            if (data.length > 0) {
                                window.apf.gmap.zeigeBeob(data);
                            } else {
                                window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte_6.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "GoogleMapsMitTPopBeob": {
                    "label": "auf Luftbild einer Teilpopulation<br>&nbsp;&nbsp;&nbsp;zuordnen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_violett.png",
                    "action": function() {
                        var getBeobKarte_7 = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=/tpopId=/beobId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/nichtZuzuordnen=',
                            dataType: 'json'
                        });
                        getBeobKarte_7.done(function(beob) {
                            if (beob.length > 0) {
                                var getApKarte_2 = $.ajax({
                                    type: 'get',
                                    url: 'php/ap_karte.php',
                                    dataType: 'json',
                                    data: {
                                        "id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id"))
                                    }
                                });
                                getApKarte_2.always(function(tpop) {
                                    if (tpop.rows.length > 0) {
                                        window.apf.gmap.zeigeBeobUndTPop(beob, tpop);
                                    } else {
                                        window.apf.gmap.zeigeBeob(beob);
                                    }
                                });
                            } else {
                                window.apf.melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte_7.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "GisBrowser": {
                    "label": "im GIS-Browser zeigen",
                    "separator_before": true,
                    "icon": "style/images/wappen_zuerich.png",
                    "action": function() {
                        window.apf.zeigeBeobKoordinatenImGisBrowser();
                    }
                }
            };
            if (!window.apf.beob_node_ausgeschnitten) {
                items.ausschneiden = {
                    //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                    "label": "ausschneiden",
                    "separator_before": true,
                    "icon": "style/images/ausschneiden.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.beob_node_ausgeschnitten = aktiver_node;
                    }
                }
            }
            if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, parent_node, "first");
                    }
                }
            }
            return items;
        case "ap_ordner_beob_nicht_zuzuordnen":
            items = {
                "GoogleMaps": {
                    "label": "auf Luftbild zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_violett.png",
                    "action": function() {
                        var getBeobKarte_8 = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/tpopId=/beobId=/nichtZuzuordnen=1',
                            dataType: 'json'
                        });
                        getBeobKarte_8.done(function(data) {
                            if (data.length > 0) {
                                window.apf.gmap.zeigeBeob(data);
                            } else {
                                window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte_8.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                }
            };
            if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first");
                    }
                }
            }
            return items;
        case "beob_nicht_zuzuordnen":
            items = {
                "GoogleMaps": {
                    "label": "auf Luftbild zeigen",
                    "separator_before": true,
                    "icon": "style/images/flora_icon_violett.png",
                    "action": function() {
                        var getBeobKarte_9 = $.ajax({
                            type: 'get',
                            url: '/api/beobKarte/apId=/tpopId=/beobId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/nichtZuzuordnen=',
                            dataType: 'json'
                        });
                        getBeobKarte_9.done(function(data) {
                            if (data.length > 0) {
                                window.apf.gmap.zeigeBeob(data);
                            } else {
                                window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
                            }
                        });
                        getBeobKarte_9.fail(function() {
                            //window.apf.melde("Fehler: Keine Daten erhalten");
                            console.log('Fehler: Keine Daten erhalten');
                        });
                    }
                },
                "GisBrowser": {
                    "label": "im GIS-Browser zeigen",
                    "separator_before": true,
                    "icon": "style/images/wappen_zuerich.png",
                    "action": function() {
                        window.apf.zeigeBeobKoordinatenImGisBrowser();
                    }
                }
            };
            if (!window.apf.beob_node_ausgeschnitten) {
                items.ausschneiden = {
                    //"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
                    "label": "ausschneiden",
                    "separator_before": true,
                    "icon": "style/images/ausschneiden.png",
                    "action": function() {
                        // nur aktualisieren, wenn Schreibrechte bestehen
                        if (!window.apf.prüfeSchreibvoraussetzungen()) {
                            return;
                        }
                        window.apf.beob_node_ausgeschnitten = aktiver_node;
                    }
                }
            }
            if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
                items.einfuegen = {
                    "label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
                    "separator_before": true,
                    "icon": "style/images/einfuegen.png",
                    "action": function() {
                        $("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, parent_node, "first");
                    }
                }
            }
            return items;
    }
};

module.exports = treeKontextmenu;