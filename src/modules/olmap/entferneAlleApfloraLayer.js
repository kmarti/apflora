/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                  = require('underscore'),
    initiiereLayertree = require('./initiiereLayertree');

module.exports = function () {
    var layersArray,
        kategorie,
        title,
        zuLoeschendeLayer = [];

    if (window.apf.olmap && window.apf.olmap.map) {
        // getLayers retourniert ein Objekt!!!
        // um die eigentlichen Layers zu erhalten, muss man .getLayers().getArray() aufrufen!!!
        layersArray = window.apf.olmap.map.getLayers().getArray();
        // zuerst nur einen Array mit den zu löschenden Layern erstellen
        // wenn man sofort löscht, wird nur der erste entfernt!
        _.each(layersArray, function (layer) {
            kategorie = layer.get('kategorie');
            title     = layer.get('title');
            if (kategorie && kategorie === 'AP Flora' && title !== 'Detailpläne') {
                zuLoeschendeLayer.push(layer);
            }
        });
        _.each(zuLoeschendeLayer, function (layer) {
            window.apf.olmap.map.removeLayer(layer);
        });
        initiiereLayertree();
    }
};