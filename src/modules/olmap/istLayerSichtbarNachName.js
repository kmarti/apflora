/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _  = require('underscore');

module.exports = function (layername) {
    var layerObjektArray,
        layerIstSichtbar;

    // prüfen, ob eine map existiert
    if (window.apf.olMap.map) {
        layerObjektArray = window.apf.olMap.map.getLayers().getArray();
        layerIstSichtbar = _.find(layerObjektArray, function (layerObjekt) {
            return layerObjekt.get('title') === layername && layerObjekt.get('visible');
        });
        if (layerIstSichtbar) {
            return true;
        }
    }
    return false;
};