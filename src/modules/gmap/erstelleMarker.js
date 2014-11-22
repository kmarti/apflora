/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $               = require('jquery'),
    google          = require('google'),
    setLocationTPop = require('./setLocationTPop'),
    clearMarkers    = require('./clearMarkers');

module.exports = function (location, map, marker, tpop) {
    // title muss String sein
    var title = (tpop && tpop.TPopFlurname ? tpop.TPopFlurname : "neue Teilpopulation");

    // zuerst bisherigen Marker löschen
    clearMarkers();
    marker = new google.maps.Marker({
        position:  location,
        map:       map,
        title:     title,
        icon:      "img/flora_icon_rot.png",
        draggable: true
    });
    // Marker in Array speichern, damit er gelöscht werden kann
    window.apf.gmap.markersArray.push(marker);
    google.maps.event.addListener(marker, "dragend", function (event) {
        setLocationTPop(event.latLng, map, marker, tpop);
    });
    setLocationTPop(location, map, marker);
};