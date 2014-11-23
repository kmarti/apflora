/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                 = require('jquery'),
    ol                                = require('ol'),
    ga                                = require('ga'),
    initiiereLayertree                = require('./initiiereLayertree'),
    createLayers                      = require('./createLayers'),
    addDragAndDropGeofiles            = require('./addDragAndDropGeofiles'),
    blendeOlmapExportieren            = require('./blendeOlmapExportieren'),
    entferneAlleApfloraLayer          = require('./entferneAlleApfloraLayer'),
    addShowFeatureInfoOnClick         = require('./addShowFeatureInfoOnClick'),
    changeCursorOverFeature           = require('./changeCursorOverFeature'),
    addMousePositionControl           = require('./addMousePositionControl'),
    addFullScreenControl              = require('./addFullScreenControl'),
    entferneModifyInteractionFuerTpop = require('./entferneModifyInteractionFuerTpop');

module.exports = function () {
    // allfällige Apflora-Ebenen entfernen
    entferneAlleApfloraLayer();
    // allfällige Modify-Interaktion entfernen
    entferneModifyInteractionFuerTpop();

    // Karte nur aufbauen, wenn dies nicht schon passiert ist
    if (!window.apf.olMap.map) {
        window.apf.olMap.map = new ga.Map({
            target: 'ga_karten_div',
            layers: createLayers(),
            view: new ol.View2D({
                resolution: 4,
                center: [693000, 253000]
            })
        });

        // diverse features und Fähigkeiten ergänzen
        addDragAndDropGeofiles();
        addShowFeatureInfoOnClick();
        changeCursorOverFeature();
        initiiereLayertree();
        addMousePositionControl();
        addFullScreenControl();

        window.apf.olMap.map.on('change:size', function () {
            // steuern, ob das Export-Tool sichtbar ist
            // wenn es bei hoher Pixelzahl sichtbar ist, gibt es Probleme
            blendeOlmapExportieren();
        });
    }
};