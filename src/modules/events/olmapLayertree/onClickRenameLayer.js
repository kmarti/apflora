/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                  = require('jquery'),
    frageNameFuerEbene = require('../../olMap/frageNameFuerEbene');

module.exports = function () {
    // layer holen
    var layerDiv   = $(this).parent().parent().siblings('input'),
        layerIndex = layerDiv.val(),
        layer      = window.apf.olMap.map.getLayers().getArray()[layerIndex];

    frageNameFuerEbene(layer);
};