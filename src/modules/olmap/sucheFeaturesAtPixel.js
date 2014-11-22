// sucht features an einem Ort in der Karte

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (pixel) {
    var features = [];

    window.apf.olmap.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        features.push(feature);
    });
    return features;
};