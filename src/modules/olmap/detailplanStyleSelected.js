/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var ol = require('ol');

module.exports = function (feature, resolution) {
    return new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(15, 85, 250, 0.1)'
        }),
        stroke: new ol.style.Stroke({
            color: '#0F55FA',
            width: 1
        })
    });
};