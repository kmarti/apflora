/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    if (window.apf.olMap.map.olmapSelectInteraction) {
        return window.apf.olMap.map.olmapSelectInteraction.getFeatures().getArray();
    }
    return [];
};