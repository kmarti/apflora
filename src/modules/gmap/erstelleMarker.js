/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $      = require('jquery'),
    google = require('google');

var returnFunction = function (location, map, marker, tpop) {
    /*global Google*/
    var title,
        setLocationTPop = require('./setLocationTPop');

    // title muss String sein
    title = (tpop && tpop.TPopFlurname ? tpop.TPopFlurname : "neue Teilpopulation");

    // zuerst bisherigen Marker löschen
    window.apf.gmap.clearMarkers();
    marker = new google.maps.Marker({
        position:  location,
        map:       map,
        title:     title,
        icon:      "img/flora_icon_rot.png",
        draggable: true
    });
    // Marker in Array speichern, damit er gelöscht werden kann
    window.apf.gmap.markers_array.push(marker);
    google.maps.event.addListener(marker, "dragend", function (event) {
        setLocationTPop(event.latLng, map, marker, tpop);
    });
    setLocationTPop(location, map, marker);
};

module.exports = returnFunction;