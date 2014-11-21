/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $             = require('jquery'),
    removeDragBox = require('./removeDragBox');

module.exports = function () {
    if (window.apf.olmap.map.olmapSelectInteraction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.map.olmapSelectInteraction);
        delete window.apf.olmap.map.olmapSelectInteraction;
        removeDragBox();
        $("#ergebnisAuswahl").hide();
    }
};