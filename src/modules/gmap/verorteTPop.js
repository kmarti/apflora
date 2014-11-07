/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $      = require('jquery'),
    google = require('google');

var returnFunction = function (tpop) {
    /*global Google*/
    var infowindow = new google.maps.InfoWindow(),
        lat,
        lng,
        latlng,
        zoom_level,
        options,
        map,
        map_canvas = $('#google_karten_div'),
        verorted,
        marker,
        content_string,
        tpop_beschriftung,
        my_flurname,
        chToWgsLng      = require('../../lib/chToWgsLng'),
        chToWgsLat      = require('../../lib/chToWgsLat'),
        zeigeFormular   = require('../zeigeFormular'),
        setLocationTPop = require('./setLocationTPop'),
        erstelleMarker  = require('./erstelleMarker');

    window.apf.gmap.markers_array = [];

    // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
    zeigeFormular("google_karte");

    // Optionen für die Anzeige
    if (tpop && tpop.TPopXKoord && tpop.TPopYKoord) {
        // Wenn Koordinaten vorhanden, Lat und Lng ergänzen
        lat = chToWgsLat(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10));
        lng = chToWgsLng(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10));
        zoom_level = 15;
        verorted = true;
    } else {
        // sonst auf Zürich zentrieren
        lat = 47.360566;
        lng = 8.542829;
        zoom_level = 12;
        verorted = false;
    }
    latlng = new google.maps.LatLng(lat, lng);
    options = {
        zoom: zoom_level,
        center: latlng,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    // Karte gründen
    map = new google.maps.Map(map_canvas[0], options);
    window.apf.gmap.map = map;

    if (verorted) {
        // marker erstellen
        tpop_beschriftung = window.apf.beschrifteTPopMitNrFürKarte(tpop.PopNr, tpop.TPopNr);
        marker = new google.maps.Marker({
            position: latlng, 
            map: map,
            title: tpop_beschriftung,
            icon: "img/flora_icon_rot.png",
            draggable: true
        });
        // Marker in Array speichern, damit er gelöscht werden kann
        window.apf.gmap.markers_array.push(marker);

        // infowindow erstellen
        my_flurname = tpop.TPopFlurname || '(kein Flurname)';
        content_string = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + my_flurname + '</h3>'+
            '<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>'+
            '<p><a href="#" onclick="window.apf.öffneTPop(\'' + tpop.TPopId + '\')">Formular anstelle Karte öffnen<\/a></p>'+
            '<p><a href="#" onclick="window.apf.öffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')">Formular neben der Karte öffnen<\/a></p>'+
            '<p><a href="#" onclick="window.apf.öffneTPopInNeuemTab(\'' + tpop.TPopId + '\')">Formular in neuem Fenster öffnen<\/a></p>'+
            '</div>'+
            '</div>';
        infowindow = new google.maps.InfoWindow({
            content: content_string
        });
        if (!window.apf.gmap.info_window_array) {
            window.apf.gmap.info_window_array = [];
        }
        window.apf.gmap.info_window_array.push(infowindow);

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
        google.maps.event.addListener(marker, "dragend", function (event) {
            setLocationTPop(event.latLng, map, marker, tpop);
        });
    }

    // listener bei klick in Karte
    // entfernt bestehenden marker, erstellt neuen und aktualisiert Koordinaten
    google.maps.event.addListener(map, 'click', function (event) {
        erstelleMarker(event.latLng, map, marker, tpop);
    });
};

module.exports = returnFunction;