/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery');

module.exports = function () {
    var tooltipTitle;

    $('#olMapExportieren').button();
    $('#olMapExportieren').button("enable");

    tooltipTitle = 'Karte als png herunterladen';
    $("#olMapExportierenDiv").tooltip({
        tooltipClass: "tooltip-styling-hinterlegt",
        content:      tooltipTitle
    });
};