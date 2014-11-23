/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $         = require('jquery'),
    styleTPop = require('../olmap/styleTPop');

module.exports = function () {
    var layers = window.apf.olmap.map.getLayers().getArray(),
        layer  = $('#olmapLayertreeTeilpopulationen').val(),
        that   = this;

    // style setzen
    layers[layer].setStyle(styleTPop);
    // jeweils andere box unchecken
    if ($(that).hasClass('tpopNr') && that.checked) {
        // andere box unchecken
        $('#layertreeTpopName').prop('checked', false);
    } else if ($(that).hasClass('tpopName') && that.checked) {
        // andere box unchecken
        $('#layertreeTpopNr').prop('checked', false);
    }
};