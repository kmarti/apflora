/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery');

module.exports = function () {
    if (window.apf.olmap.auswahlPolygonLayer) {
        window.apf.olmap.auswahlPolygonLayer.removeAllFeatures();
    }
    if (window.drawControl) {
        window.drawControl.deactivate();
    }
    $("#ergebnisAuswahl").css("display", "none");
};