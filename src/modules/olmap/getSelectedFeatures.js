/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    if (window.apf.olmap.map.olmapSelectInteraction) {
        return window.apf.olmap.map.olmapSelectInteraction.getFeatures().getArray();
    }
    return [];
};