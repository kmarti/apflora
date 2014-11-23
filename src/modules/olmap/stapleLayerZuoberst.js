/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                  = require('underscore'),
    initiiereLayertree = require('./initiiereLayertree');

module.exports = function (layerTitle) {
    var layers      = window.apf.olMap.map.getLayers(),
        layersArray = window.apf.olMap.map.getLayers().getArray(),
        topLayer;

    _.each(layersArray, function (layer, index) {
        if (layer.get('title') === layerTitle) {
            topLayer = layers.removeAt(index);
            layers.insertAt(layersArray.length, topLayer);
        }
    });
    initiiereLayertree();
};