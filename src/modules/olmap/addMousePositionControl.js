/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var ol = require('ol');

module.exports = function () {
    var mousePositionControl = new ol.control.MousePosition({
        //This is the format we want the coordinate in
        //The number argument in createStringXY is the number of decimal places
        coordinateFormat: ol.coordinate.createStringXY(0),
        projection: "EPSG:21781",
        undefinedHTML: '&nbsp;' //what openlayers will use if the map returns undefined for a map coordinate
    });
    window.apf.olmap.map.addControl(mousePositionControl);
};