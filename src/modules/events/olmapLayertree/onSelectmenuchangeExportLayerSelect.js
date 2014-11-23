/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $               = require('jquery'),
    exportiereLayer = require('../../olMap/exportiereLayer');

module.exports = function () {
    // layer holen
    var $layerDiv     = $(this).parent().parent().siblings('input'),
        layerIndex    = $layerDiv.val(),
        layer         = window.apf.olMap.map.getLayers().getArray()[layerIndex],
        $selectDiv    = this,
        selectedValue = $selectDiv.options[$selectDiv.selectedIndex].value;

    if (selectedValue !== 'leerwert') {
        exportiereLayer(layer, selectedValue);
        $selectDiv.value = 'leerwert';
        $(this).selectmenu('refresh');
    }
};