/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var google = require('google');

module.exports = function (map, marker, contentString, infowindow) {
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
};