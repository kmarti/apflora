/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

module.exports = function () {
    var mapSize,
        anzKartenpixel,
        tooltipTitle;

    mapSize = window.apf.olmap.map.getSize();
    // resolution nicht berücksichtigen - das funktionierte nicht zuverlässig und gab Probleme
    anzKartenpixel = /*window.apf.olmap.map.getView().getResolution() * */mapSize[0] * mapSize[1];
    $('#olmap_exportieren').button();
    if (anzKartenpixel > 500000) {
        $('#olmap_exportieren').button("disable");
        tooltipTitle = 'Karte als png herunterladen<br>Diese Funktion ist inaktiv<br>Um sie zu aktivieren, müssen Sie die Karte verkleinern<br>Packen Sie dazu die untere rechte Ecke und ziehen Sie sie nach oben links';
    } else {
        $('#olmap_exportieren').button("enable");
        tooltipTitle = 'Karte als png herunterladen';
    }
    $("#olmap_exportieren_div").tooltip({
        tooltipClass: "tooltip-styling-hinterlegt",
        content:      tooltipTitle
    });
};