// alle InfoWindows löschen
// benutzt wo in GoogleMaps Infowindows neu gesetzt werden müssen, weil die Daten verändert wurden

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _ = require('underscore');

module.exports = function () {
    _.each(window.apf.gMap.infoWindowArray, function (infoWindow) {
        infoWindow.setMap(null);
    });
};