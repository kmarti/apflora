/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                         = require('jquery'),
    google                    = require('google'),
    berechneLayertreeMaxhoehe = require('./olMap/berechneLayertreeMaxhoehe');

module.exports = function () {
    var lytMaxHeight = berechneLayertreeMaxhoehe,
        formsHeight,
        maxWidth;

    // Formulare sind unbegrenzt hoch aber Karten sollen das nicht sein
    if (window.apf.kartenhoeheManuell) {
        formsHeight = $(window).height() - 17;
        maxWidth    = $("#forms").width();
        $("#forms").height(formsHeight);
        $('#olMapDiv')
            //.css('width', maxWidth)
            .css('max-width', maxWidth)
            //.css('height', formsHeight)
            .css('max-height', formsHeight);
        if (window.apf.olMap && window.apf.olMap.map) {
            window.apf.olMap.map.updateSize();
            // Maximalgrösse des Layertree begrenzen
            $('#olmap_layertree_layers').css('max-height', lytMaxHeight);
        }
        if (google !== undefined && google.maps && window.apf.gMap && window.apf.gMap.map !== undefined) {
            google.maps.event.trigger(window.apf.gMap.map, 'resize');
        }
    } else {
        $("#forms").height('auto');
    }
};