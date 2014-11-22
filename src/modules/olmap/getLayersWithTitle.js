/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _ = require('underscore');

module.exports = function () {
    var layersArray,
        layers;

    layersArray = window.apf.olmap.map.getLayers().getArray();
    layers = _.map(layersArray, function (layer) {
        if (layer.get('title')) {
            return layer;
        }
    });
    return layers || [];
};