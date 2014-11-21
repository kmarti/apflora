/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery');

module.exports = function () {
    if (window.apf.olmap.map.olmapSelectInteraction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.map.olmapSelectInteraction);
        delete window.apf.olmap.map.olmapSelectInteraction;
        window.apf.olmap.removeDragBox();
        $("#ergebnisAuswahl").hide();
    }
};