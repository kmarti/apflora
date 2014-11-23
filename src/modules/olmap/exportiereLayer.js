/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var ol       = require('ol'),
    melde    = require('../melde'),
    download = require('../download');

module.exports = function (layer, selectedValue) {
    var layerName   = layer.get('title') || 'Eigene_Ebene',
        allFeatures = layer.getSource().getFeatures(),
        format      = new ol.format[selectedValue](),
        dataParsed,
        dataStringified,
        serializer;

    layerName += '.' + selectedValue;
    try {
        dataParsed = format.writeFeatures(allFeatures);
    } catch (e) {
        melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
        return;
    }
    if (selectedValue === 'GeoJSON') {
        try {
            dataStringified = JSON.stringify(dataParsed, null, 4);
        } catch (e) {
            melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
        }
    } else {
        serializer = new XMLSerializer();
        try {
            dataStringified = serializer.serializeToString(dataParsed);
        } catch (e) {
            melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
        }
    }
    download(layerName, dataStringified);
};