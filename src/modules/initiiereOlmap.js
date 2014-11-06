/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var returnFunction = function ($) {
    var initiiereLayertree = require('./initiiereLayertree');

    // allfällige Apflora-Ebenen entfernen
    window.apf.olmap.entferneAlleApfloraLayer();
    // allfällige Modify-Interaktion entfernen
    window.apf.olmap.entferneModifyInteractionFürTpop();

    // Karte nur aufbauen, wenn dies nicht schon passiert ist
    if (!window.apf.olmap.map) {
        window.apf.olmap.map = new ga.Map({
            target: 'ga_karten_div',
            layers: window.apf.olmap.createLayersForOlmap(),
            view: new ol.View2D({
                resolution: 4,
                center: [693000, 253000]
            })
        });

        // diverse features und Fähigkeiten ergänzen
        window.apf.olmap.addDragAndDropGeofiles();
        window.apf.olmap.addShowFeatureInfoOnClick();
        window.apf.olmap.changeCursorOverFeature();
        initiiereLayertree($);
        window.apf.olmap.addMousePositionControl();
        window.apf.olmap.addFullScreenControl();

        window.apf.olmap.map.on('change:size', function () {
            // steuern, ob das Export-Tool sichtbar ist
            // wenn es bei hoher Pixelzahl sichtbar ist, gibt es Probleme
            window.apf.olmap.blendeOlmapExportieren();
        });
    }
};

module.exports = returnFunction;