// uups, offenbar momentan nicht benutzt

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _  = require('underscore');

module.exports = function () {
    var layerObjektArray,
        layers;

    layerObjektArray = window.apf.olMap.map.getLayers().getArray();

    layers = _.map(layerObjektArray, function (layerObjekt) {
        if (layerObjekt.values_ && layerObjekt.values_.title) {
            return layerObjekt.values_.title;
        }
    });
    return layers;
};