/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var ol = require('ol');

var returnFunction = function () {
    var frageNameFuerEbene         = require('./frageNameFuerEbene'),
        drag_and_drop_defaultStyle = require('./defaultStyle'),
        initiiereLayertree         = require('./initiiereLayertree'),
        drag_and_drop_styleFunction,
        drag_and_drop_interaction;

    drag_and_drop_styleFunction = function (feature, resolution) {
        var featureStyleFunction = feature.getStyleFunction();
        if (featureStyleFunction) {
            return featureStyleFunction.call(feature, resolution);
        }
        return drag_and_drop_defaultStyle[feature.getGeometry().getType()];
    };

    drag_and_drop_interaction = new ol.interaction.DragAndDrop({
        formatConstructors: [
            ol.format.GPX,
            ol.format.GeoJSON,
            ol.format.IGC,
            ol.format.KML,
            ol.format.TopoJSON
        ]
    });

    window.apf.olmap.map.addInteraction(drag_and_drop_interaction);

    drag_and_drop_interaction.on('addfeatures', function (event) {
        var vectorSource,
            drag_and_drop_layer,
            view;
        vectorSource = new ol.source.Vector({
            features: event.features
        });
        drag_and_drop_layer = new ol.layer.Vector({
            guid: window.apf.erstelleGuid(),
            source: vectorSource,
            style: drag_and_drop_styleFunction,
            title: 'eigene Ebene',
            kategorie: 'Eigene Ebenen'
        });
        window.apf.olmap.map.addLayer(drag_and_drop_layer);
        view = window.apf.olmap.map.getView();
        view.fitExtent(vectorSource.getExtent(), /** @type {ol.Size} */ (window.apf.olmap.map.getSize()));
        // layertree aktualisieren
        initiiereLayertree('Eigene Ebenen');
        frageNameFuerEbene(drag_and_drop_layer);
    });
};

module.exports = returnFunction;