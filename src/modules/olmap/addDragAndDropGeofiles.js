/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var ol                 = require('ol'),
    frageNameFuerEbene = require('./frageNameFuerEbene'),
    defaultStyle       = require('./defaultStyle'),
    initiiereLayertree = require('./initiiereLayertree'),
    erstelleGuid       = require('../erstelleGuid');

module.exports = function () {
    var styleFunction,
        dragAndDropInteraction;

    styleFunction = function (feature, resolution) {
        var featureStyleFunction = feature.getStyleFunction();

        if (featureStyleFunction) {
            return featureStyleFunction.call(feature, resolution);
        }
        return defaultStyle[feature.getGeometry().getType()];
    };

    dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
            ol.format.GPX,
            ol.format.GeoJSON,
            ol.format.IGC,
            ol.format.KML,
            ol.format.TopoJSON
        ]
    });

    window.apf.olmap.map.addInteraction(dragAndDropInteraction);

    dragAndDropInteraction.on('addfeatures', function (event) {
        var vectorSource,
            dragAndDropLayer,
            view;

        vectorSource = new ol.source.Vector({
            features: event.features
        });
        dragAndDropLayer = new ol.layer.Vector({
            guid:      erstelleGuid(),
            source:    vectorSource,
            style:     styleFunction,
            title:     'eigene Ebene',
            kategorie: 'Eigene Ebenen'
        });
        window.apf.olmap.map.addLayer(dragAndDropLayer);
        view = window.apf.olmap.map.getView();
        view.fitExtent(vectorSource.getExtent(), /** @type {ol.Size} */ (window.apf.olmap.map.getSize()));
        // layertree aktualisieren
        initiiereLayertree('Eigene Ebenen');
        frageNameFuerEbene(dragAndDropLayer);
    });
};