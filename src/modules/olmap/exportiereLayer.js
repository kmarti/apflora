/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var ol = require('ol');

var returnFunction = function (layer, selected_value) {
    var layer_name = layer.get('title') || 'Eigene_Ebene',
        allFeatures = layer.getSource().getFeatures(),
        format = new ol.format[selected_value](),
        data_parsed,
        data_stringified,
        serializer;

    layer_name += '.' + selected_value;
    try {
        data_parsed = format.writeFeatures(allFeatures);
    } catch (e) {
        window.apf.melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
        return;
    }
    if (selected_value === 'GeoJSON') {
        try {
            data_stringified = JSON.stringify(data_parsed, null, 4);
        } catch (e) {
            window.apf.melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
        }
    } else {
        serializer = new XMLSerializer();
        try {
            data_stringified = serializer.serializeToString(data_parsed);
        } catch (e) {
            window.apf.melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
        }
    }
    window.apf.download(layer_name, data_stringified);
};

module.exports = returnFunction;