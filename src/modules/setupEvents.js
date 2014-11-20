/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $           = require('jquery'),
    _           = require('underscore'),
    addruler    = require('addruler'),
    removeruler = require('removeruler');

module.exports = function () {
    $('#olmap_layertree')
        .on('click', '.olmap_layertree_checkbox', function (event) {
            var layers = window.apf.olmap.map.getLayers().getArray();
            layers[event.target.value].setVisible(event.target.checked);
        })
        .on('click', '.layertree_pop_style', function () {
            var layers = window.apf.olmap.map.getLayers().getArray(),
                layer = $('#olmap_layertree_Populationen').val(),
                that = this;
            // style setzen
            layers[layer].setStyle(window.apf.olmap.stylePop);
            // jeweils andere box unchecken
            if ($(that).hasClass('popNr') && that.checked) {
                $('#layertree_pop_name').prop('checked', false);
            } else if ($(that).hasClass('pop_name') && that.checked) {
                $('#layertree_pop_nr').prop('checked', false);
            }
        })
        .on('click', '.layertree_tpop_style', function () {
            var layers = window.apf.olmap.map.getLayers().getArray(),
                layer = $('#olmap_layertree_Teilpopulationen').val(),
                that = this;
            // style setzen
            layers[layer].setStyle(window.apf.olmap.styleTPop);
            // jeweils andere box unchecken
            if ($(that).hasClass('tpopNr') && that.checked) {
                // andere box unchecken
                $('#layertree_tpop_name').prop('checked', false);
            } else if ($(that).hasClass('tpop_name') && that.checked) {
                // andere box unchecken
                $('#layertree_tpop_nr').prop('checked', false);
            }
        })
        .on('click', '.modify_layer', function () {
            // layer holen
            var layer_div = $(this).parent().siblings('input'),
                layer_index = layer_div.val(),
                layer = window.apf.olmap.map.getLayers().getArray()[layer_index],
                button_div = $(this).siblings('label').first(),
                geom_select_div = $(this).siblings('.modify_layer_geom_type'),
                geom_select_div_id = geom_select_div.attr('id'),
                button_icon = $(this).button('option', 'icons').primary,
                $non_modify_options = $(this).siblings('.non_modify_options'),
                tooltip_content;

            // modify-layer steuern
            if (window.apf.olmap.modifyInteractionFuerVectorlayer) {
                // modify entfernen
                // input_div mitgeben, damit alle übrigen Layer deaktiviert werden können
                window.apf.olmap.entferneModifyInteractionFuerVectorLayer(layer_div);
            }

            // modify_layer_geom_type selectmenu zurücksetzen...
            $('.modify_layer_geom_type')
                .selectmenu()
                .selectmenu('destroy')
                .hide();

            // Zustand der Layeranzeige steuern
            if (button_icon === 'ui-icon-locked') {
                // war inaktiv, also aktivieren
                window.apf.olmap.erstelleModifyInteractionFuerVectorLayer(layer);
                // title ändern
                tooltip_content = 'Ebene schützen';
                // selectmenu initiieren
                geom_select_div.selectmenu({
                    width: 140
                });
                // give the selectmenu a tooltip
                // oberhalb, sonst verdeckt er den Inhalt, wenn der öffnet...
                $('#' + geom_select_div_id + '-button').tooltip({
                    tooltipClass: "tooltip-styling-hinterlegt",
                    items: 'span',
                    content: geom_select_div.attr('title'),
                    position: {
                        my: 'left bottom-5',
                        at: 'left top'
                    }
                });
                // Optionen, die nicht der Bearbeitung dienen, auf zweite Zeile
                $non_modify_options
                    .css('display', 'block')
                    .css('margin-left', '3px');
                // button is pencil
                $(this)
                    .button({
                        icons: {primary: 'ui-icon-pencil'},
                        text: false
                    })
                    .button('refresh');
            } else {
                // button war aktiv > deaktivieren
                // title ändern
                tooltip_content = 'Ebene bearbeiten';
                // Optionen, die nicht der Bearbeitung dienen, auf gleiche Zeile
                $non_modify_options
                    .css('display', 'inline')
                    .css('margin-left', '0');
                // button is locked
                $(this)
                    .button({
                        icons: {primary: 'ui-icon-locked'},
                        text: false
                    })
                    .button('refresh');
            }
            // tooltip von .modify_layer anpassen
            button_div
                .attr('title', tooltip_content)
                .tooltip({
                    tooltipClass: "tooltip-styling-hinterlegt",
                    content: tooltip_content
                });
        })
        .on('selectmenuchange', '.export_layer_select', function () {
            // layer holen
            var $layer_div = $(this).parent().parent().siblings('input'),
                layer_index = $layer_div.val(),
                layer = window.apf.olmap.map.getLayers().getArray()[layer_index],
                $select_div = this,
                selectedValue = $select_div.options[$select_div.selectedIndex].value;

            if (selectedValue !== 'leerwert') {
                window.apf.olmap.exportiereLayer(layer, selectedValue);
                $select_div.value = 'leerwert';
                $(this).selectmenu('refresh');
            }
        })
        .on('click', '.rename_layer', function () {
            // layer holen
            var layer_div = $(this).parent().parent().siblings('input'),
                layer_index = layer_div.val(),
                layer = window.apf.olmap.map.getLayers().getArray()[layer_index];
            window.apf.olmap.frageNameFuerEbene(layer);
        })
        .on('click', '.entferne_layer', function () {
            // layer holen
            var layer_div   = $(this).parent().parent().siblings('input'),
                layer_index = layer_div.val(),
                layer       = window.apf.olmap.map.getLayers().getArray()[layer_index],
                layerName  = layer.get('title');
            if (layerName) {
                // open a dialog
                $("#entferne_eigene_ebene_dialog").dialog({
                    resizable: false,
                    height:    'auto',
                    width:     400,
                    modal:     true,
                    buttons: {
                        "ja, entfernen!": function () {
                            $(this).dialog("close");
                            window.apf.olmap.entferneLayerNachName(layerName);
                            window.apf.olmap.initiiereLayertree('Eigene Ebenen');
                        },
                        "abbrechen": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            } else {
                window.apf.melde('Fehler: Layer nicht entfernt');
            }
        })
        .on('click', '.neues_layer', function () {
            window.apf.olmap.erstelleModifyInteractionFuerVectorLayer('neuer_layer');
        });

    $('#google_karten_div')
        .on('click', '.oeffneBeob', function (event) {
            event.preventDefault();
            window.apf.oeffneBeob($(this).data('beob'));
        })
        .on('click', '.oeffneBeobInNeuemTab', function (event) {
            event.preventDefault();
            window.apf.oeffneBeobInNeuemTab($(this).data('beob'));
        });

    $('#GeoAdminKarte')
        .on('click', '#olmap_exportieren', function (event) {
            window.apf.olmap.exportiereKarte(event);
        });

    $("#ber").on("change", "#BerURL", function () {
        var $BerURL = $("#BerURL"),
            url = $BerURL.val();
        if (url.substring(0, 3) === "www") {
            $BerURL.val("//" + url);
        } else if (url.substring(0, 4) !== "http") {
            $BerURL.val("//www." + url);
        }
        $('#BerURLHref').attr('onClick', "window.open('" + $BerURL.val() + "', target='_blank')");
    });

    $("#forms").on("keydown", ".form", function (event) {
        if (event.keyCode === 46) {
            event.stopPropagation();
        }
    });

    $('.apf-with-tooltip')
        .each(function () {
            $(this).qtip({
                content: {
                    text:  $(this).next('.tooltiptext'),
                    title: 'Legende'
                },
                style: {
                    // Use the jQuery UI widget classes
                    widget: true,
                    // Remove the default styling
                    def: false,
                    tip: false
                },
                position: {
                    my:       'top right',
                    at:       'bottom right',
                    target:   $(this),
                    viewport: $(window)
                }
            });
        })
        .qtip({
            events: {
                render: function (event, api) {
                    api.elements.wrapper.addClass('ui-corner-all');
                }
            }
        });

    // Für jedes Feld bei Änderung speichern
    $(".form")
        .on("change", ".speichern", function () {
            window.apf.speichern(this);
        })
        .on("click", "#kopiereKoordinatenInPop", function () {
            window.apf.kopiereKoordinatenInPop($("#TPopXKoord").val(), $("#TPopYKoord").val());
        })
        .on("keyup focus", "textarea", function () {
            window.apf.fitTextareaToContent(this, document.documentElement.clientHeight);
        });

    // verhindern, dass Zahlen durch Scrollen am Mausrad aus Versehen verändert werden
    $("[type='number']").mousewheel(function (event) {
        event.preventDefault();
    });

    // Wenn im Suchfeld oder in einem Datenfeld die Taste Delete gedrückt wird,
    // wird anschliessend im Baum der markierte node entfernt!
    $("#menu")
        .on("keydown", "#suchen", function (event) {
            if (event.keyCode === 46) {
                event.stopPropagation();
            }
        })
        .on("click", ".exportieren", function () {
            window.apf.initiiereExporte();
        })
        .on("click", "[name=programm_wahl]", function () {
            window.apf.waehleApListe($(this).attr("id"));
        })
        .on("click", "#ap_loeschen", function () {
            var $ap_waehlen = $("#ap_waehlen");
            if (!$ap_waehlen.val()) {
                $("#Meldung")
                    .html("Bitte wählen Sie vor dem Löschen ein Artförderprogramm")
                    .dialog({
                        modal: true,
                        buttons: {
                            Ok: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
            } else {
                $("#Meldung")
                    .html("Wollen Sie das Artförderprogramm für '" + $('#ap_waehlen_text').val() + "' wirklich löschen?")
                    .dialog({
                        modal: true,
                        width: 500,
                        buttons: {
                            ja: function () {
                                window.apf.loescheAp(localStorage.apId);
                                $(this).dialog("close");
                            },
                            nein: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
            }
        })
        .on("change", "#ap_waehlen", function () {
            var value = this.value || localStorage.apId;
            window.apf.waehleAp(value);
        })
        .on("click", "#ap_waehlen_text_loeschen", function () {
            window.apf.waehleAp();
            $('#ap_waehlen_text').focus();
        });

    $("#beob")
        .on("change", "#BeobNichtBeurteilt", function () {
            var $BeobNichtBeurteilt = $("#BeobNichtBeurteilt");
            if ($BeobNichtBeurteilt.prop("checked") === true) {
                // node verschieben. Den rest macht der callback zu jstree.move_node
                $("#tree").jstree("move_node", "#beob" + localStorage.beobId, "#apOrdnerBeobNichtBeurteilt" + localStorage.apId, "first");
            } else {
                // es bringt nichts, diesen Haken zu entfernen
                // stattdessen soll ein anderer Wert gewählt werden
                $BeobNichtBeurteilt.prop("checked", true);
            }
        })
        .on("change", "#BeobNichtZuordnen", function () {
            if ($("#BeobNichtZuordnen").prop("checked") === true) {
                // node verschieben. Der Rest wird vom Callback fon jstree.move_node erledigt
                $("#tree").jstree("move_node", "#beob" + localStorage.beobId, "#apOrdnerBeobNichtZuzuordnen" + localStorage.apId, "first");
            } else {
                // node verschieben. Den Rest macht der callback zu jstree.move_node
                $("#tree").jstree("move_node", "#beob" + localStorage.beobId, "#apOrdnerBeobNichtBeurteilt" + localStorage.apId, "first");
            }
        })
        .on("change", "[name='DistZuTPop']", function () {
            var tpopId = $(this).val();
            $("#tree").jstree("move_node", "#beob" + localStorage.beobId, "#tpopOrdnerBeobZugeordnet" + tpopId, "first");
        });

    $("#google_karte")
        .on("click", "#distanz_messen", function (event) {
            event.preventDefault();
            addruler();
        })
        .on("click", "#distanz_messen_entfernen", function (event) {
            event.preventDefault();
            removeruler();
        });

    $("#undelete_div").on("click", "#undelete", function (event) {
        event.preventDefault();
        window.apf.undeleteDatensatz();
    });

    //Suche steuern
    $("body").on("keyup click", "#suchen", function (e) {
        //if (this.value.length > 2) {
        if (e.keyCode === 13) {
            $("#tree").jstree("search", this.value);
        } else {
            $("#tree").jstree("clear_search");
        }
    });

    // Paarige Jahr/Datumfelder: Datum zurückstellen, wenn Jahr verändert wurde
    $("#tpopfeldkontr").on("change", "#TPopKontrJahr", function () {
        var Objekt,
            $TPopKontrDatum = $("#TPopKontrDatum");

        if ($TPopKontrDatum.val()) {
            $TPopKontrDatum.val(null);
            Objekt = {};
            Objekt.name = "TPopKontrDatum";
            Objekt.formular = "tpopfeldkontr";
            window.apf.speichern(Objekt);
        }
    });

    // Paarige Jahr/Datumfelder: Datum zurückstellen, wenn Jahr verändert wurde
    $("#tpopmassn").on("change", "#TPopMassnJahr", function () {
        var Objekt,
            $TPopMassnDatum = $("#TPopMassnDatum");

        if ($TPopMassnDatum.val()) {
            $TPopMassnDatum.val(null);
            Objekt = {};
            Objekt.name = "TPopMassnDatum";
            Objekt.formular = "tpopmassn";
            window.apf.speichern(Objekt);
        }
    });

    $(".karte").on("change", ".google_karte_detailplaene_checkbox", function () {
        if (window.apf.googleKarteDetailplaene.getMap() === null) {
            window.apf.googleKarteDetailplaene.setMap(window.apf.gmap.map);
        } else {
            window.apf.googleKarteDetailplaene.setMap(null);
        }
    });

    $(window).resize(function () {
        window.apf.setzeTreehoehe();
        // Karten sollen ca. Bildschirmhöhe haben
        // da Formulare so hoch wie der Inhalt sind, muss die Kartenhöhe manuell eingestellt werden
        window.apf.setzeKartenhoehe();
    });

    $("#forms")
        .on("click", ".guid", function () {
            // die GUIDS sollen einfach kopiert werden können
            $(this).select();
        })
        .on("click", ".export_pop", function () {
            // wenn pop ausgewählt, diese übergeben
            var pop_id_liste = "";
            if (window.apf.olmap.popSelected) {
                _.each(window.apf.olmap.popSelected, function (pop, index) {
                    pop_id_liste +=  pop.get('myId');
                    if (index + 1 < window.apf.olmap.popSelected.length) {
                        pop_id_liste += ",";
                    }
                });
                window.apf.downloadFileFromViewWehreIdIn('vPop', 'PopId', pop_id_liste, 'Populationen', 'csv');
            } else {
                window.apf.downloadFileFromView('vPop', 'Populationen', 'xlsx');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on("click", ".export_kontr", function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpop_id_liste = "";
            if (window.apf.olmap.tpopSelected) {
                _.each(window.apf.olmap.tpopSelected, function (tpop, index) {
                    tpop_id_liste +=  tpop.get('myId');
                    if (index + 1 < window.apf.olmap.tpopSelected.length) {
                        tpop_id_liste += ",";
                    }
                });
                window.apf.downloadFileFromViewWehreIdIn('vKontr', 'TPop ID', tpop_id_liste, 'Kontrollen', 'csv');
            } else {
                window.apf.downloadFileFromView('vKontr', 'Kontrollen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on("click", ".export_tpop", function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpop_id_liste = "";
            if (window.apf.olmap.tpopSelected) {
                _.each(window.apf.olmap.tpopSelected, function (tpop, index) {
                    tpop_id_liste +=  tpop.get('myId');
                    if (index + 1 < window.apf.olmap.tpopSelected.length) {
                        tpop_id_liste += ",";
                    }
                });
                window.apf.downloadFileFromViewWehreIdIn('vTPop', 'TPop ID', tpop_id_liste, 'Teilpopulationen', 'csv');
            } else {
                window.apf.downloadFileFromView('vTPop', 'Teilpopulationen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on("click", ".export_massn", function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpop_id_liste = "";
            if (window.apf.olmap.tpopSelected) {
                _.each(window.apf.olmap.tpopSelected, function (tpop, index) {
                    tpop_id_liste +=  tpop.get('myId');
                    if (index + 1 < window.apf.olmap.tpopSelected.length) {
                        tpop_id_liste += ",";
                    }
                });
                window.apf.downloadFileFromViewWehreIdIn('vMassn', 'TPop ID', tpop_id_liste, 'Massnahmen', 'csv');
            } else {
                window.apf.downloadFileFromView('vMassn', 'Massnahmen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        });

    $("#ergebnisAuswahlHeader").on("click", ".ui-icon.ui-icon-closethick", function () {
        window.apf.deaktiviereGeoAdminAuswahl();
    });

    $("#exporte")
        .on("click", "#export_ap", function () {
            window.apf.downloadFileFromView('vProgramme', 'Programme', 'csv');
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on("click", "#export_ap_ohne_pop", function () {
            window.apf.downloadFileFromView('vApOhnePop', 'ProgrammeOhnePopulationen', 'csv');
            return false;
        })
        .on("click", "#export_ap_anz_massn", function () {
            window.apf.downloadFileFromView('vApAnzMassn', 'ProgrammeAnzahlMassnahmen', 'csv');
            return false;
        })
        .on("click", "#export_ap_anz_kontr", function () {
            window.apf.downloadFileFromView('vApAnzKontr', 'ProgrammeAnzahlKontrollen', 'csv');
            return false;
        })
        .on("click", "#export_jber", function () {
            window.apf.downloadFileFromView('vApJahresberichte', 'Jahresberichte', 'csv');
            return false;
        })
        .on("click", "#export_jber_massn", function () {
            window.apf.downloadFileFromView('vApJahresberichteUndMassnahmen', 'ApJahresberichteUndMassnahmen', 'csv');
            return false;
        })
        .on("click", "#export_apziel", function () {
            window.apf.downloadFileFromView('vApZiele', 'ApZiele', 'csv');
            return false;
        })
        .on("click", "#export_zielber", function () {
            window.apf.downloadFileFromView('vZielBer', 'Zielberichte', 'csv');
            return false;
        })
        .on("click", "#export_ber", function () {
            window.apf.downloadFileFromView('vBer', 'Berichte', 'csv');
            return false;
        })
        .on("click", "#export_erfkrit", function () {
            window.apf.downloadFileFromView('vErfKrit', 'Erfolgskriterien', 'csv');
            return false;
        })
        .on("click", "#export_idealbiotop", function () {
            window.apf.downloadFileFromView('vIdealbiotop', 'Idealbiotope', 'csv');
            return false;
        })
        .on("click", "#export_assoz_arten", function () {
            window.apf.downloadFileFromView('vAssozArten', 'AssoziierteArten', 'csv');
            return false;
        })
        .on("click", "#export_pop_fuer_kml", function () {
            window.apf.downloadFileFromView('vPopFuerKml', 'ApFloraPopulationen', 'kml');
            return false;
        })
        .on("click", "#export_pop_fuer_kml_namen", function () {
            window.apf.downloadFileFromView('vPopFuerKmlNamen', 'PopulationenNachNamen', 'kml');
            return false;
        })
        .on("click", "#export_pop_ohne_tpop", function () {
            window.apf.downloadFileFromView('vPopOhneTPop', 'PopulationenOhneTeilpopulationen', 'csv');
            return false;
        })
        .on("click", "#export_pop_von_ap_ohne_status", function () {
            window.apf.downloadFileFromView('vPopVonApOhneStatus', 'PopulationenVonApArtenOhneStatus', 'csv');
            return false;
        })
        .on("click", "#export_pop_ohne_koord", function () {
            window.apf.downloadFileFromView('vPopOhneKoord', 'PopulationenOhneKoordinaten', 'csv');
            return false;
        })
        .on("click", "#export_pop_mit_massnber_anz_massn", function () {
            window.apf.downloadFileFromView('vPopMassnberAnzMassn', 'PopulationenAnzMassnProMassnber', 'csv');
            return false;
        })
        .on("click", "#export_pop_anz_massn", function () {
            window.apf.downloadFileFromView('vPopAnzMassn', 'PopulationenAnzahlMassnahmen', 'csv');
            return false;
        })
        .on("click", "#export_pop_anz_kontr", function () {
            window.apf.downloadFileFromView('vPopAnzKontr', 'PopulationenAnzahlKontrollen', 'csv');
            return false;
        })
        .on("click", "#export_popber_massnber", function () {
            window.apf.downloadFileFromView('vPop_BerUndMassnBer', 'PopulationenPopUndMassnBerichte', 'csv');
            return false;
        })
        .on("click", "#export_tpop_fuer_kml", function () {
            window.apf.downloadFileFromView('vTPopFuerKml', 'Teilpopulationen', 'kml');
            return false;
        })
        .on("click", "#export_tpop_fuer_kml_namen", function () {
            window.apf.downloadFileFromView('vTPopFuerKmlNamen', 'TeilpopulationenNachNamen', 'kml');
            return false;
        })
        .on("click", "#export_tpop_ohne_bekannt_seit", function () {
            window.apf.downloadFileFromView('vTPopOhneBekanntSeit', 'TeilpopulationenVonApArtenOhneBekanntSeit', 'csv');
            return false;
        })
        .on("click", "#export_tpop_anz_massn", function () {
            window.apf.downloadFileFromView('vTPopAnzMassn', 'TeilpopulationenAnzahlMassnahmen', 'csv');
            return false;
        })
        .on("click", "#export_tpop_anz_kontr_inkl_letzte", function () {
            window.apf.downloadFileFromView('vTPopAnzKontrInklLetzteKontr', 'TeilpopulationenAnzahlKontrollenInklusiveLetzteKontrolle', 'csv');
            return false;
        })
        .on("click", "#export_tpopber_massnber", function () {
            window.apf.downloadFileFromView('vTPop_BerUndMassnBer', 'TeilpopulationenTPopUndMassnBerichte', 'csv');
            return false;
        })
        .on("click", "#export_kontr_anz_pro_zaehleinheit", function () {
            window.apf.downloadFileFromView('vKontrAnzProZaehleinheit', 'KontrollenAnzahlProZaehleinheit', 'csv');
            return false;
        })
        .on("click", "#export_beob", function () {
            window.apf.downloadFileFromView('vBeob', 'Beobachtungen', 'csv');
            return false;
        })
        .on("click", "#export_datenstruktur", function () {
            window.apf.downloadFileFromView('vDatenstruktur', 'Datenstruktur', 'csv');
            return false;
        })
        .on("click", "#export_datenstruktur_grafisch", function () {
            window.open("etc/Beziehungen.pdf");
        });
};