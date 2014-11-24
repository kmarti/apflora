/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                   = require('jquery'),
    _                                   = require('underscore'),
    downloadFileFromViewWehreIdIn       = require('./downloadFileFromViewWehreIdIn'),
    onWindowResize                      = require('./events/onWindowResize'),
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
    onClickExportPop                    = require('./events/forms/onClickExportPop'),
    onClickExportKontr                  = require('./events/forms/onClickExportKontr'),
    onClickExportTpop                   = require('./events/forms/onClickExportTpop'),
    onClickExportTpopMassn              = require('./events/forms/onClickExportTpopMassn'),
    onChangeBerUrl                      = require('./events/forms/onChangeBerUrl'),
    onChangeTPopKontrJahr               = require('./events/forms/onChangeTPopKontrJahr'),
    onChangeTPopMassnJahr               = require('./events/forms/onChangeTPopMassnJahr'),
    onClickExport                       = require('./events/forms/onClickExport'),
    onClickExportDatenstrukturGrafisch  = require('./events/forms/onClickExportDatenstrukturGrafisch'),
    onClickOlMapExportieren             = require('./events/forms/olMap/onClickOlMapExportieren'),
    onClickOlmapLayertreeCheckbox       = require('./events/forms/olMap/layertree/onClickOlmapLayertreeCheckbox'),
    onClickLayertreePopStyle            = require('./events/forms/olMap/layertree/onClickLayertreePopStyle'),
    onClickLayertreeTpopStyle           = require('./events/forms/olMap/layertree/onClickLayertreeTpopStyle'),
    onClickModifyLayer                  = require('./events/forms/olMap/layertree/onClickModifyLayer'),
    onClickRenameLayer                  = require('./events/forms/olMap/layertree/onClickRenameLayer'),
    onClickEntferneLayer                = require('./events/forms/olMap/layertree/onClickEntferneLayer'),
    onClickNeuesLayer                   = require('./events/forms/olMap/layertree/onClickNeuesLayer'),
    onClickErgebnisAuswahlClose         = require('./events/forms/olMap/onClickErgebnisAuswahlClose'),
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
        .on('click',           '.exportPop',                   onClickExportPop)
        .on('click',           '.exportKontr',                 onClickExportKontr)
        .on('click',           '.exportTpop',                  onClickExportTpop)
        .on('click',           '.exportMassn',                 onClickExportTpopMassn);

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

    $('#olMapErgebnisAuswahlHeader')
        .on('click',            '.ui-icon.ui-icon-closethick', onClickErgebnisAuswahlClose);

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
    $('#tpopfeldkontr')
        .on('change',           '#TPopKontrJahr',              onChangeTPopKontrJahr);

    // Paarige Jahr/Datumfelder: Datum zurückstellen, wenn Jahr verändert wurde
    $('#tpopmassn')
        .on('change',           '#TPopMassnJahr',              onChangeTPopMassnJahr);

    $(window).resize(onWindowResize);

    $('#exporte')
        .on('click',            '.export',                     onClickExport)
        .on('click',            '#exportDatenstrukturGrafisch', onClickExportDatenstrukturGrafisch);

    // verhindern, dass Zahlen durch Scrollen am Mausrad aus Versehen verändert werden
    $('[type="number"]').mousewheel(function (event) {
        event.preventDefault();
    });
};