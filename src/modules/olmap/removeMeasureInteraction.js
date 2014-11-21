/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                     = require('jquery'),
    entferneLayerNachName = require('./entferneLayerNachName');

module.exports = function () {
    entferneLayerNachName('messen');
    window.apf.olmap.map.removeInteraction(window.apf.olmap.drawMeasure);
    delete window.apf.olmap.drawMeasure;
    $("#ergebnisMessung").text("");
    $(window.apf.olmap.map.getViewport()).off('mousemove');
};