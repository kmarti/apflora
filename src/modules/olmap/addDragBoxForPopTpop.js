/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

var returnFunction = function () {
    window.apf.olmap.drag_box_interaction = new ol.interaction.DragBox({
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
    window.apf.olmap.drag_box_interaction.on('boxend', function (event) {
        var geometry = window.apf.olmap.drag_box_interaction.getGeometry(),
            extent = geometry.getExtent(),
            layers = window.apf.olmap.map.getLayers().getArray(),
            pop_layer_nr = $('#olmap_layertree_Populationen').val(),
            pop_layer = layers[pop_layer_nr],
            tpopLayerNr = $('#olmap_layertree_Teilpopulationen').val(),
            tpopLayer = layers[tpopLayerNr],
            pop_layer_source = pop_layer.getSource(),
            tpopLayerSource = tpopLayer.getSource(),
            selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();

        if (pop_layer.get('visible') === true) {
            pop_layer_source.forEachFeatureInExtent(extent, function (feature) {
                selected_features.push(feature);
            });
        }
        if (tpopLayer.get('visible') === true) {
            tpopLayerSource.forEachFeatureInExtent(extent, function (feature) {
                selected_features.push(feature);
            });
        }
        setTimeout(function () {
            window.apf.olmap.prüfeObPopTpopGewähltWurden();
        }, 100);
    });
    window.apf.olmap.map.addInteraction(window.apf.olmap.drag_box_interaction);
};

module.exports = returnFunction;