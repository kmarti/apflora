// GoogleMap: alle Marker löschen
// benutzt wo in GoogleMaps Marker gesetzt und verschoben werden

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _ = require('underscore');

module.exports = function () {
    _.each(window.apf.gmap.markersArray, function (marker) {
        marker.setMap(null);
    });
};