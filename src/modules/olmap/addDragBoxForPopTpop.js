/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                             = require('jquery'),
    ol                            = require('ol'),
    pruefeObPopTpopGewaehltWurden = require('./pruefeObPopTpopGewaehltWurden');

module.exports = function () {
    // interaction erstellen
    window.apf.olmap.dragBoxInteraction = new ol.interaction.DragBox({
        /* dragbox interaction is active only if alt key is pressed */
        condition: ol.events.condition.altKeyOnly,
        /* style the box */
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 1],
                width: 3
            })
        })
    });
    window.apf.olmap.map.addInteraction(window.apf.olmap.dragBoxInteraction);

    // Aktion bei boxend erstellen
    window.apf.olmap.dragBoxInteraction.on('boxend', function () {
        var geometry         = window.apf.olmap.dragBoxInteraction.getGeometry(),
            extent           = geometry.getExtent(),
            layers           = window.apf.olmap.map.getLayers().getArray(),
            popLayerNr       = $('#olmapLayertreePopulationen').val(),
            popLayer         = layers[popLayerNr],
            tpopLayerNr      = $('#olmapLayertreeTeilpopulationen').val(),
            tpopLayer        = layers[tpopLayerNr],
            popLayerSource   = popLayer.getSource(),
            tpopLayerSource  = tpopLayer.getSource(),
            selectedFeatures = window.apf.olmap.map.olmapSelectInteraction.getFeatures().getArray();

        if (popLayer.get('visible') === true) {
            popLayerSource.forEachFeatureInExtent(extent, function (feature) {
                selectedFeatures.push(feature);
            });
        }
        if (tpopLayer.get('visible') === true) {
            tpopLayerSource.forEachFeatureInExtent(extent, function (feature) {
                selectedFeatures.push(feature);
            });
        }
        setTimeout(function () {
            pruefeObPopTpopGewaehltWurden();
        }, 100);
    });
};