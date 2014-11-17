/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $               = require('jquery'),
    _               = require('underscore'),
    google          = require('google'),
    MarkerWithLabel = require('MarkerWithLabel'),
    MarkerClusterer = require('MarkerClusterer'),
    chToWgsLng      = require('../../lib/chToWgsLng'),
    chToWgsLat      = require('../../lib/chToWgsLat'),
    zeigeFormular   = require('../zeigeFormular'),
    makeListener    = require('./makeListener');

module.exports = function (beobListe) {
    var anz_beob,
        infowindow = new google.maps.InfoWindow(),
        lat,
        lng,
        latlng,
        options,
        map,
        bounds,
        markers,
        latlng2,
        marker,
        contentString,
        markerOptions,
        markerCluster,
        datum,
        titel,
        aNote,
        autor,
        projekt,
        ort;

    // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
    zeigeFormular("google_karte");
    window.apf.gmap.markersArray = [];
    window.apf.gmap.infoWindowArray = [];
    // Lat und Lng in BeobListe ergänzen
    _.each(beobListe, function (beob, index) {
        if (beob.X && beob.Y) {
            beob.Lat = chToWgsLat(parseInt(beob.X, 10), parseInt(beob.Y, 10));
            beob.Lng = chToWgsLng(parseInt(beob.X, 10), parseInt(beob.Y, 10));
        } else {
            // beob entfernen, da keine Koordinaten
            beobListe.splice(index, 1);
        }
    });
    // TPop zählen
    anz_beob = beobListe.length;
    // Karte mal auf Zürich zentrieren, falls in den BeobListe.rows keine Koordinaten kommen
    // auf die die Karte ausgerichtet werden kann
    lat     = 47.383333;
    lng     = 8.533333;
    latlng  = new google.maps.LatLng(lat, lng);
    options = {
        zoom: 15,
        center: latlng,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControlOptions: {
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.TERRAIN,
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.HYBRID
            ]
        }
    };
    map = new google.maps.Map(document.getElementById("google_karten_div"), options);
    window.apf.gmap.map = map;
    bounds = new google.maps.LatLngBounds();

    // für alle Orte Marker erstellen
    markers = [];
    _.each(beobListe, function (beob) {
        datum = beob.Datum;
        latlng2 = new google.maps.LatLng(beob.Lat, beob.Lng);
        if (anz_beob === 1) {
            // map.fitbounds setzt zu hohen zoom, wenn nur eine Beob Koordinaten hat > verhindern
            latlng = latlng2;
        } else {
            // Kartenausschnitt um diese Koordinate erweitern
            bounds.extend(latlng2);
        }
        // title muss String sein
        titel = (datum ? datum.toString() : '');
        // A_NOTE muss String sein
        aNote = (beob.A_NOTE ? beob.A_NOTE.toString() : '');
        marker = new MarkerWithLabel({
            map: map,
            position: latlng2,
            title: titel,
            labelContent: aNote,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon_violett.png"
        });
        // dem Marker einen Typ und eine id geben
        // damit drag and drop möglich werden soll
        // marker.set("typ", "beob");
        // marker.set("id", Beob.BeobId);
        marker.metadata = {
            typ: "beob_nicht_beurteilt",
            id: beob.NO_NOTE
        };
        markers.push(marker);
        autor   = beob.Autor         || "(keiner)";
        projekt = beob.PROJET        || "(keines)";
        ort     = beob.DESC_LOCALITE || "(keiner)";
        contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<div id="bodyContent" class="GmInfowindow">' +
            '<h3>' + datum + '</h3>' +
            '<p>Autor: ' + autor + '</p>' +
            '<p>Projekt: ' + projekt + '</p>' +
            '<p>Ort: ' + ort + '</p>' +
            '<p>Koordinaten: ' + beob.X + ' / ' + beob.Y + '</p>' +
            '<p><a href="#" class="oeffneBeob" data-beob=\'' + JSON.stringify(beob) + '\'>Formular anstelle Karte öffnen<\/a></p>' +
            '<p><a href="#" class="oeffneBeobInNeuemTab" data-beob=\'' + JSON.stringify(beob) + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
            '</div>' +
            '</div>';
        makeListener(map, marker, contentString, infowindow);
    });
    markerOptions = {
        maxZoom: 17,
        styles: [{
            height: 53,
            url: "img/m5.png",
            width: 53
        }]
    };
    markerCluster = new MarkerClusterer(map, markers, markerOptions);
    if (anz_beob === 1) {
        // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
        map.setCenter(latlng);
        map.setZoom(18);
    } else {
        // Karte auf Ausschnitt anpassen
        map.fitBounds(bounds);
    }
};