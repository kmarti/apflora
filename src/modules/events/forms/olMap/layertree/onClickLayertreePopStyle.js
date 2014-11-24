/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $        = require('jquery'),
    stylePop = require('../../../../olMap/stylePop');

module.exports = function () {
    var layers = window.apf.olMap.map.getLayers().getArray(),
        layer  = $('#olMapLayertreePopulationen').val(),
        that   = this;

    // style setzen
    layers[layer].setStyle(stylePop);
    // jeweils andere box unchecken
    if ($(that).hasClass('popNr') && that.checked) {
        $('#layertreePopName').prop('checked', false);
    } else if ($(that).hasClass('popName') && that.checked) {
        $('#layertreePopNr').prop('checked', false);
    }
};