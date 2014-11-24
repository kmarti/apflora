/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                             = require('jquery'),
    _                             = require('underscore'),
    addruler                      = require('addruler'),
    removeruler                   = require('removeruler'),
    downloadFileFromView          = require('./downloadFileFromView'),
    downloadFileFromViewWehreIdIn = require('./downloadFileFromViewWehreIdIn'),
    fitTextareaToContent          = require('./fitTextareaToContent'),
    speichern                     = require('./speichern'),
    waehleApListe                 = require('./waehleApListe'),
    stylePop                      = require('./olMap/stylePop'),
    styleTPop                     = require('./olMap/styleTPop'),
    waehleAp                      = require('./waehleAp'),
    loescheAp                     = require('./loescheAp'),
    undeleteDatensatz             = require('./undeleteDatensatz'),
    kopiereKoordinatenInPop       = require('./kopiereKoordinatenInPop'),
    setzeKartenhoehe              = require('./setzeKartenhoehe'),
    deaktiviereOlmapAuswahl       = require('./olMap/deaktiviereOlmapAuswahl'),
    initiiereExporte              = require('./initiiereExporte'),
    setzeTreehoehe                = require('./jstree/setzeTreehoehe'),
    onKeydownForm                 = require('./events/forms/onKeydownForm'),
    onChangeBerUrl                = require('./events/forms/ber/onChangeBerUrl'),
    onClickOlMapExportieren       = require('./events/forms/olMap/onClickOlMapExportieren'),
    onClickOlmapLayertreeCheckbox = require('./events/forms/olMap/layertree/onClickOlmapLayertreeCheckbox'),
    onClickLayertreePopStyle      = require('./events/forms/olMap/layertree/onClickLayertreePopStyle'),
    onClickLayertreeTpopStyle     = require('./events/forms/olMap/layertree/onClickLayertreeTpopStyle'),
    onClickModifyLayer            = require('./events/forms/olMap/layertree/onClickModifyLayer'),
    onClickRenameLayer            = require('./events/forms/olMap/layertree/onClickRenameLayer'),
    onClickEntferneLayer          = require('./events/forms/olMap/layertree/onClickEntferneLayer'),
    onClickNeuesLayer             = require('./events/forms/olMap/layertree/onClickNeuesLayer'),
    onClickOeffneBeob             = require('./events/forms/gMap/onClickOeffneBeob'),
    onClickOeffneBeobInNeuemTab   = require('./events/forms/gMap/onClickOeffneBeobInNeuemTab'),
    onSelectmenuchangeExportLayerSelect = require('./events/forms/olMap/layertree/onSelectmenuchangeExportLayerSelect');

module.exports = function () {
    $("#forms")
        .on('keydown',         '.form',                    onKeydownForm);

    $('#olMap')
        .on('click',            '#olMapExportieren',       onClickOlMapExportieren);

    $('#olMapLayertree')
        .on('click',            '.olmapLayertreeCheckbox', onClickOlmapLayertreeCheckbox)
        .on('click',            '.layertreePopStyle',      onClickLayertreePopStyle)
        .on('click',            '.layertreeTpopStyle',     onClickLayertreeTpopStyle)
        .on('click',            '.modifyLayer',            onClickModifyLayer)
        .on('selectmenuchange', '.exportLayerSelect',      onSelectmenuchangeExportLayerSelect)
        .on('click',            '.renameLayer',            onClickRenameLayer)
        .on('click',            '.entferneLayer',          onClickEntferneLayer)
        .on('click',            '.neuesLayer',             onClickNeuesLayer);

    $('#gMap')
        .on('click',            '.oeffneBeob',             onClickOeffneBeob)
        .on('click',            '.oeffneBeobInNeuemTab',   onClickOeffneBeobInNeuemTab);

    $('#ber').on('change',      '#berUrl',                 onChangeBerUrl);

    // Für jedes Feld bei Änderung speichern
    $('.form')
        .on('change', '.speichern', function () {
            speichern(this);
        })
        .on('click', '#kopiereKoordinatenInPop', function () {
            kopiereKoordinatenInPop($('#TPopXKoord').val(), $('#TPopYKoord').val());
        })
        .on('keyup focus', 'textarea', function () {
            fitTextareaToContent(this, document.documentElement.clientHeight);
        });

    // verhindern, dass Zahlen durch Scrollen am Mausrad aus Versehen verändert werden
    $('[type="number"]').mousewheel(function (event) {
        event.preventDefault();
    });

    // Wenn im Suchfeld oder in einem Datenfeld die Taste Delete gedrückt wird,
    // wird anschliessend im Baum der markierte node entfernt!
    $('#menu')
        .on('keydown', '#suchen', function (event) {
            if (event.keyCode === 46) {
                event.stopPropagation();
            }
        })
        .on('click', '.exportieren', function () {
            initiiereExporte();
        })
        .on('click', '[name=programm_wahl]', function () {
            waehleApListe($(this).attr('id'));
        })
        .on('click', '#ap_loeschen', function () {
            var $ap_waehlen = $('#ap_waehlen');
            if (!$ap_waehlen.val()) {
                $('#Meldung')
                    .html('Bitte wählen Sie vor dem Löschen ein Artförderprogramm')
                    .dialog({
                        modal: true,
                        buttons: {
                            Ok: function () {
                                $(this).dialog('close');
                            }
                        }
                    });
            } else {
                $('#Meldung')
                    .html('Wollen Sie das Artförderprogramm für "' + $('#ap_waehlen_text').val() + '" wirklich löschen?')
                    .dialog({
                        modal: true,
                        width: 500,
                        buttons: {
                            ja: function () {
                                loescheAp(localStorage.apId);
                                $(this).dialog('close');
                            },
                            nein: function () {
                                $(this).dialog('close');
                            }
                        }
                    });
            }
        })
        .on('change', '#ap_waehlen', function () {
            var value = this.value || localStorage.apId;
            waehleAp(value);
        })
        .on('click', '#ap_waehlen_text_loeschen', function () {
            waehleAp();
            $('#ap_waehlen_text').focus();
        });

    $('#beob')
        .on('change', '#BeobNichtBeurteilt', function () {
            var $BeobNichtBeurteilt = $('#BeobNichtBeurteilt');
            if ($BeobNichtBeurteilt.prop('checked') === true) {
                // node verschieben. Den rest macht der callback zu jstree.move_node
                $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#apOrdnerBeobNichtBeurteilt' + localStorage.apId, 'first');
            } else {
                // es bringt nichts, diesen Haken zu entfernen
                // stattdessen soll ein anderer Wert gewählt werden
                $BeobNichtBeurteilt.prop('checked', true);
            }
        })
        .on('change', '#BeobNichtZuordnen', function () {
            if ($('#BeobNichtZuordnen').prop('checked') === true) {
                // node verschieben. Der Rest wird vom Callback fon jstree.move_node erledigt
                $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#apOrdnerBeobNichtZuzuordnen' + localStorage.apId, 'first');
            } else {
                // node verschieben. Den Rest macht der callback zu jstree.move_node
                $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#apOrdnerBeobNichtBeurteilt' + localStorage.apId, 'first');
            }
        })
        .on('change', '[name="DistZuTPop"]', function () {
            var tpopId = $(this).val();
            $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#tpopOrdnerBeobZugeordnet' + tpopId, 'first');
        });

    $('#gMap')
        .on('click', '#gMapDistanzMessen', function (event) {
            event.preventDefault();
            addruler();
        })
        .on('click', '#gMapDistanzMessenEntfernen', function (event) {
            event.preventDefault();
            removeruler();
        });

    $('#undelete_div').on('click', '#undelete', function (event) {
        event.preventDefault();
        undeleteDatensatz();
    });

    //Suche steuern
    $('body').on('keyup click', '#suchen', function (e) {
        //if (this.value.length > 2) {
        if (e.keyCode === 13) {
            $('#tree').jstree('search', this.value);
        } else {
            $('#tree').jstree('clear_search');
        }
    });

    // Paarige Jahr/Datumfelder: Datum zurückstellen, wenn Jahr verändert wurde
    $('#tpopfeldkontr').on('change', '#TPopKontrJahr', function () {
        var objekt,
            $TPopKontrDatum = $('#TPopKontrDatum');

        if ($TPopKontrDatum.val()) {
            $TPopKontrDatum.val(null);
            objekt          = {};
            objekt.name     = 'TPopKontrDatum';
            objekt.formular = 'tpopfeldkontr';
            speichern(objekt);
        }
    });

    // Paarige Jahr/Datumfelder: Datum zurückstellen, wenn Jahr verändert wurde
    $('#tpopmassn').on('change', '#TPopMassnJahr', function () {
        var objekt,
            $TPopMassnDatum = $('#TPopMassnDatum');

        if ($TPopMassnDatum.val()) {
            $TPopMassnDatum.val(null);
            objekt          = {};
            objekt.name     = 'TPopMassnDatum';
            objekt.formular = 'tpopmassn';
            speichern(objekt);
        }
    });

    $('.karte').on('change', '.gMapDetailplaeneCheckbox', function () {
        if (window.apf.googleKarteDetailplaene.getMap() === null) {
            window.apf.googleKarteDetailplaene.setMap(window.apf.gMap.map);
        } else {
            window.apf.googleKarteDetailplaene.setMap(null);
        }
    });

    $(window).resize(function () {
        setzeTreehoehe();
        // Karten sollen ca. Bildschirmhöhe haben
        // da Formulare so hoch wie der Inhalt sind, muss die Kartenhöhe manuell eingestellt werden
        setzeKartenhoehe();
    });

    $('#forms')
        .on('click', '.guid', function () {
            // die GUIDS sollen einfach kopiert werden können
            $(this).select();
        })
        .on('click', '.export_pop', function () {
            // wenn pop ausgewählt, diese übergeben
            var pop_id_liste = '';
            if (window.apf.olMap.popSelected) {
                _.each(window.apf.olMap.popSelected, function (pop, index) {
                    pop_id_liste +=  pop.get('myId');
                    if (index + 1 < window.apf.olMap.popSelected.length) {
                        pop_id_liste += ',';
                    }
                });
                downloadFileFromViewWehreIdIn('vPop', 'PopId', pop_id_liste, 'Populationen', 'csv');
            } else {
                downloadFileFromView('vPop', 'Populationen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on('click', '.export_kontr', function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpop_id_liste = '';
            if (window.apf.olMap.tpopSelected) {
                _.each(window.apf.olMap.tpopSelected, function (tpop, index) {
                    tpop_id_liste +=  tpop.get('myId');
                    if (index + 1 < window.apf.olMap.tpopSelected.length) {
                        tpop_id_liste += ',';
                    }
                });
                downloadFileFromViewWehreIdIn('vKontr', 'TPop ID', tpop_id_liste, 'Kontrollen', 'csv');
            } else {
                downloadFileFromView('vKontr', 'Kontrollen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on('click', '.export_tpop', function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpop_id_liste = '';
            if (window.apf.olMap.tpopSelected) {
                _.each(window.apf.olMap.tpopSelected, function (tpop, index) {
                    tpop_id_liste +=  tpop.get('myId');
                    if (index + 1 < window.apf.olMap.tpopSelected.length) {
                        tpop_id_liste += ',';
                    }
                });
                downloadFileFromViewWehreIdIn('vTPop', 'TPop ID', tpop_id_liste, 'Teilpopulationen', 'csv');
            } else {
                downloadFileFromView('vTPop', 'Teilpopulationen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on('click', '.export_massn', function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpop_id_liste = '';
            if (window.apf.olMap.tpopSelected) {
                _.each(window.apf.olMap.tpopSelected, function (tpop, index) {
                    tpop_id_liste +=  tpop.get('myId');
                    if (index + 1 < window.apf.olMap.tpopSelected.length) {
                        tpop_id_liste += ',';
                    }
                });
                downloadFileFromViewWehreIdIn('vMassn', 'TPop ID', tpop_id_liste, 'Massnahmen', 'csv');
            } else {
                downloadFileFromView('vMassn', 'Massnahmen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        });

    $('#olMapErgebnisAuswahlHeader').on('click', '.ui-icon.ui-icon-closethick', function () {
        deaktiviereOlmapAuswahl();
    });

    $('#exporte')
        .on('click', '#export_ap', function () {
            downloadFileFromView('vProgramme', 'Programme', 'csv');
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on('click', '#export_ap_ohne_pop', function () {
            downloadFileFromView('vApOhnePop', 'ProgrammeOhnePopulationen', 'csv');
            return false;
        })
        .on('click', '#export_ap_anz_massn', function () {
            downloadFileFromView('vApAnzMassn', 'ProgrammeAnzahlMassnahmen', 'csv');
            return false;
        })
        .on('click', '#export_ap_anz_kontr', function () {
            downloadFileFromView('vApAnzKontr', 'ProgrammeAnzahlKontrollen', 'csv');
            return false;
        })
        .on('click', '#export_jber', function () {
            downloadFileFromView('vApJahresberichte', 'Jahresberichte', 'csv');
            return false;
        })
        .on('click', '#export_jber_massn', function () {
            downloadFileFromView('vApJahresberichteUndMassnahmen', 'ApJahresberichteUndMassnahmen', 'csv');
            return false;
        })
        .on('click', '#export_apziel', function () {
            downloadFileFromView('vApZiele', 'ApZiele', 'csv');
            return false;
        })
        .on('click', '#export_zielber', function () {
            downloadFileFromView('vZielBer', 'Zielberichte', 'csv');
            return false;
        })
        .on('click', '#export_ber', function () {
            downloadFileFromView('vBer', 'Berichte', 'csv');
            return false;
        })
        .on('click', '#export_erfkrit', function () {
            downloadFileFromView('vErfKrit', 'Erfolgskriterien', 'csv');
            return false;
        })
        .on('click', '#export_idealbiotop', function () {
            downloadFileFromView('vIdealbiotop', 'Idealbiotope', 'csv');
            return false;
        })
        .on('click', '#export_assoz_arten', function () {
            downloadFileFromView('vAssozArten', 'AssoziierteArten', 'csv');
            return false;
        })
        .on('click', '#export_pop_fuer_kml', function () {
            downloadFileFromView('vPopFuerKml', 'ApFloraPopulationen', 'kml');
            return false;
        })
        .on('click', '#export_pop_fuer_kml_namen', function () {
            downloadFileFromView('vPopFuerKmlNamen', 'PopulationenNachNamen', 'kml');
            return false;
        })
        .on('click', '#export_pop_ohne_tpop', function () {
            downloadFileFromView('vPopOhneTPop', 'PopulationenOhneTeilpopulationen', 'csv');
            return false;
        })
        .on('click', '#export_pop_von_ap_ohne_status', function () {
            downloadFileFromView('vPopVonApOhneStatus', 'PopulationenVonApArtenOhneStatus', 'csv');
            return false;
        })
        .on('click', '#export_pop_ohne_koord', function () {
            downloadFileFromView('vPopOhneKoord', 'PopulationenOhneKoordinaten', 'csv');
            return false;
        })
        .on('click', '#export_pop_mit_massnber_anz_massn', function () {
            downloadFileFromView('vPopMassnberAnzMassn', 'PopulationenAnzMassnProMassnber', 'csv');
            return false;
        })
        .on('click', '#export_pop_anz_massn', function () {
            downloadFileFromView('vPopAnzMassn', 'PopulationenAnzahlMassnahmen', 'csv');
            return false;
        })
        .on('click', '#export_pop_anz_kontr', function () {
            downloadFileFromView('vPopAnzKontr', 'PopulationenAnzahlKontrollen', 'csv');
            return false;
        })
        .on('click', '#export_popber_massnber', function () {
            downloadFileFromView('vPop_BerUndMassnBer', 'PopulationenPopUndMassnBerichte', 'csv');
            return false;
        })
        .on('click', '#export_tpop_fuer_kml', function () {
            downloadFileFromView('vTPopFuerKml', 'Teilpopulationen', 'kml');
            return false;
        })
        .on('click', '#export_tpop_fuer_kml_namen', function () {
            downloadFileFromView('vTPopFuerKmlNamen', 'TeilpopulationenNachNamen', 'kml');
            return false;
        })
        .on('click', '#export_tpop_ohne_bekannt_seit', function () {
            downloadFileFromView('vTPopOhneBekanntSeit', 'TeilpopulationenVonApArtenOhneBekanntSeit', 'csv');
            return false;
        })
        .on('click', '#export_tpop_anz_massn', function () {
            downloadFileFromView('vTPopAnzMassn', 'TeilpopulationenAnzahlMassnahmen', 'csv');
            return false;
        })
        .on('click', '#export_tpop_anz_kontr_inkl_letzte', function () {
            downloadFileFromView('vTPopAnzKontrInklLetzteKontr', 'TeilpopulationenAnzahlKontrollenInklusiveLetzteKontrolle', 'csv');
            return false;
        })
        .on('click', '#export_tpopber_massnber', function () {
            downloadFileFromView('vTPop_BerUndMassnBer', 'TeilpopulationenTPopUndMassnBerichte', 'csv');
            return false;
        })
        .on('click', '#export_kontr_anz_pro_zaehleinheit', function () {
            downloadFileFromView('vKontrAnzProZaehleinheit', 'KontrollenAnzahlProZaehleinheit', 'csv');
            return false;
        })
        .on('click', '#export_beob', function () {
            downloadFileFromView('vBeob', 'Beobachtungen', 'csv');
            return false;
        })
        .on('click', '#export_datenstruktur', function () {
            downloadFileFromView('vDatenstruktur', 'Datenstruktur', 'csv');
            return false;
        })
        .on('click', '#export_datenstruktur_grafisch', function () {
            window.open('etc/Beziehungen.pdf');
        });
};