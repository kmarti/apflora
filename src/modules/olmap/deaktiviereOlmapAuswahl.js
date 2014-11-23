/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery');

module.exports = function () {
    if (window.apf.olMap.auswahlPolygonLayer) {
        window.apf.olMap.auswahlPolygonLayer.removeAllFeatures();
    }
    if (window.drawControl) {
        window.drawControl.deactivate();
    }
    $("#olMapErgebnisAuswahl").css("display", "none");
};