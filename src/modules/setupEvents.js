/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                   = require('jquery'),
    _                                   = require('underscore'),
    downloadFileFromView                = require('./downloadFileFromView'),
    downloadFileFromViewWehreIdIn       = require('./downloadFileFromViewWehreIdIn'),
    speichern                           = require('./speichern'),
    stylePop                            = require('./olMap/stylePop'),
    styleTPop                           = require('./olMap/styleTPop'),
    setzeKartenhoehe                    = require('./setzeKartenhoehe'),
    deaktiviereOlmapAuswahl             = require('./olMap/deaktiviereOlmapAuswahl'),
    setzeTreehoehe                      = require('./jstree/setzeTreehoehe'),
    onClickUndelete                     = require('./events/onClickUndelete'),
    onKeydownSuchen                     = require('./events/menu/onKeydownSuchen'),
    onClickExportieren                  = require('./events/menu/onClickExportieren'),
    onClickProgrammWahl                 = require('./events/menu/onClickProgrammWahl'),
    onClickApLoeschen                   = require('./events/menu/onClickApLoeschen'),
    onChangeApWaehlen                   = require('./events/menu/onChangeApWaehlen'),
    onClickApWaehlenTextLoeschen        = require('./events/menu/onClickApWaehlenTextLoeschen'),
    onKeyupClickSuchen                  = require('./events/menu/onKeyupClickSuchen'),
    onKeydownForm                       = require('./events/forms/onKeydownForm'),
    onChangeSpeichern                   = require('./events/forms/onChangeSpeichern'),
    onClickKopiereKoordinatenInPop      = require('./events/forms/onClickKopiereKoordinatenInPop'),
    onClickGuid                         = require('./events/forms/onClickGuid'),
    onKeyupFocusTextarea                = require('./events/forms/onKeyupFocusTextarea'),
    onChangeBerUrl                      = require('./events/forms/ber/onChangeBerUrl'),
    onClickOlMapExportieren             = require('./events/forms/olMap/onClickOlMapExportieren'),
    onClickOlmapLayertreeCheckbox       = require('./events/forms/olMap/layertree/onClickOlmapLayertreeCheckbox'),
    onClickLayertreePopStyle            = require('./events/forms/olMap/layertree/onClickLayertreePopStyle'),
    onClickLayertreeTpopStyle           = require('./events/forms/olMap/layertree/onClickLayertreeTpopStyle'),
    onClickModifyLayer                  = require('./events/forms/olMap/layertree/onClickModifyLayer'),
    onClickRenameLayer                  = require('./events/forms/olMap/layertree/onClickRenameLayer'),
    onClickEntferneLayer                = require('./events/forms/olMap/layertree/onClickEntferneLayer'),
    onClickNeuesLayer                   = require('./events/forms/olMap/layertree/onClickNeuesLayer'),
    onClickOeffneBeob                   = require('./events/forms/gMap/onClickOeffneBeob'),
    onClickOeffneBeobInNeuemTab         = require('./events/forms/gMap/onClickOeffneBeobInNeuemTab'),
    onClickGMapDistanzMessen            = require('./events/forms/gMap/onClickGMapDistanzMessen'),
    onClickGMapDistanzMessenEntfernen   = require('./events/forms/gMap/onClickGMapDistanzMessenEntfernen'),
    onChangeBeobNichtBeurteilt          = require('./events/forms/beob/onChangeBeobNichtBeurteilt'),
    onChangeBeobNichtZuordnen           = require('./events/forms/beob/onChangeBeobNichtZuordnen'),
    onChangeDistZuTPop                  = require('./events/forms/beob/onChangeDistZuTPop'),
    onSelectmenuchangeExportLayerSelect = require('./events/forms/olMap/layertree/onSelectmenuchangeExportLayerSelect');

module.exports = function () {
    $('#menu')
        .on('keydown',          '#suchen',                     onKeydownSuchen)
        .on('click',            '.exportieren',                onClickExportieren)
        .on('click',            '[name=programmWahl]',         onClickProgrammWahl)
        .on('click',            '#apLoeschen',                 onClickApLoeschen)
        .on('change',           '#apWaehlen',                  onChangeApWaehlen)
        .on('click',            '#apWaehlenTextLoeschen',      onClickApWaehlenTextLoeschen)
        .on('keyup click',      '#suchen',                     onKeyupClickSuchen);

    $("#forms")
        .on('keydown',         '.form',                        onKeydownForm)
        .on('click',           '.guid',                        onClickGuid)
        .on('click', '.exportPop', function () {
            // wenn pop ausgewählt, diese übergeben
            var popIdListe = '';
            if (window.apf.olMap.popSelected) {
                _.each(window.apf.olMap.popSelected, function (pop, index) {
                    popIdListe +=  pop.get('myId');
                    if (index + 1 < window.apf.olMap.popSelected.length) {
                        popIdListe += ',';
                    }
                });
                downloadFileFromViewWehreIdIn('vPop', 'PopId', popIdListe, 'Populationen', 'csv');
            } else {
                downloadFileFromView('vPop', 'Populationen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on('click', '.exportKontr', function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpopIdListe = '';
            if (window.apf.olMap.tpopSelected) {
                _.each(window.apf.olMap.tpopSelected, function (tpop, index) {
                    tpopIdListe +=  tpop.get('myId');
                    if (index + 1 < window.apf.olMap.tpopSelected.length) {
                        tpopIdListe += ',';
                    }
                });
                downloadFileFromViewWehreIdIn('vKontr', 'TPop ID', tpopIdListe, 'Kontrollen', 'csv');
            } else {
                downloadFileFromView('vKontr', 'Kontrollen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on('click', '.exportTpop', function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpopIdListe = '';
            if (window.apf.olMap.tpopSelected) {
                _.each(window.apf.olMap.tpopSelected, function (tpop, index) {
                    tpopIdListe +=  tpop.get('myId');
                    if (index + 1 < window.apf.olMap.tpopSelected.length) {
                        tpopIdListe += ',';
                    }
                });
                downloadFileFromViewWehreIdIn('vTPop', 'TPop ID', tpopIdListe, 'Teilpopulationen', 'csv');
            } else {
                downloadFileFromView('vTPop', 'Teilpopulationen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        })
        .on('click', '.export_massn', function () {
            // wenn tpop ausgewählt, diese übergeben
            var tpopIdListe = '';
            if (window.apf.olMap.tpopSelected) {
                _.each(window.apf.olMap.tpopSelected, function (tpop, index) {
                    tpopIdListe +=  tpop.get('myId');
                    if (index + 1 < window.apf.olMap.tpopSelected.length) {
                        tpopIdListe += ',';
                    }
                });
                downloadFileFromViewWehreIdIn('vMassn', 'TPop ID', tpopIdListe, 'Massnahmen', 'csv');
            } else {
                downloadFileFromView('vMassn', 'Massnahmen', 'csv');
            }
            return false; // this is critical to stop the click event which will trigger a normal file download!
        });

    // Für jedes Feld bei Änderung speichern
    $('.form')
        .on('change',          '.speichern',                   onChangeSpeichern)
        .on('click',           '#kopiereKoordinatenInPop',     onClickKopiereKoordinatenInPop)
        .on('keyup focus',     'textarea',                     onKeyupFocusTextarea);

    $('#olMap')
        .on('click',            '#olMapExportieren',           onClickOlMapExportieren);

    $('#olMapLayertree')
        .on('click',            '.olmapLayertreeCheckbox',     onClickOlmapLayertreeCheckbox)
        .on('click',            '.layertreePopStyle',          onClickLayertreePopStyle)
        .on('click',            '.layertreeTpopStyle',         onClickLayertreeTpopStyle)
        .on('click',            '.modifyLayer',                onClickModifyLayer)
        .on('selectmenuchange', '.exportLayerSelect',          onSelectmenuchangeExportLayerSelect)
        .on('click',            '.renameLayer',                onClickRenameLayer)
        .on('click',            '.entferneLayer',              onClickEntferneLayer)
        .on('click',            '.neuesLayer',                 onClickNeuesLayer);

    $('#gMap')
        .on('click',            '.oeffneBeob',                 onClickOeffneBeob)
        .on('click',            '.oeffneBeobInNeuemTab',       onClickOeffneBeobInNeuemTab)
        .on('click',            '#gMapDistanzMessen',          onClickGMapDistanzMessen)
        .on('click',            '#gMapDistanzMessenEntfernen', onClickGMapDistanzMessenEntfernen);

    $('#ber')
        .on('change',           '#berUrl',                     onChangeBerUrl);

    $('#beob')
        .on('change',           '#beobNichtBeurteilt',         onChangeBeobNichtBeurteilt)
        .on('change',           '#beobNichtZuordnen',          onChangeBeobNichtZuordnen)
        .on('change',           '[name="distZuTPop"]',         onChangeDistZuTPop);

    $('#undeleteDiv')
        .on('click',            '#undelete',                   onClickUndelete);

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

    // verhindern, dass Zahlen durch Scrollen am Mausrad aus Versehen verändert werden
    $('[type="number"]').mousewheel(function (event) {
        event.preventDefault();
    });
};