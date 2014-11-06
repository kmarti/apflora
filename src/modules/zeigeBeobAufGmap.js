/*jslint node: true, browser: true, nomen: true, todo: true */
/*global Google*/
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (beob_liste) {
    var anz_beob,
        infowindow,
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
        marker_options,
        marker_cluster,
        datum,
        titel,
        a_note,
        chToWgsLng = require('../lib/chToWgsLng'),
        chToWgsLat = require('../lib/chToWgsLat'),
        zeigeFormular = require('./zeigeFormular');

    // diese Funktion muss hier sein, damit infowindow bekannt ist
    function makeListener(map, marker, contentString) {
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
    }

    // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
    zeigeFormular("google_karte");
    window.apf.gmap.markers_array = [];
    window.apf.gmap.info_window_array = [];
    infowindow = new google.maps.InfoWindow();
    // Lat und Lng in BeobListe ergänzen
    _.each(beob_liste, function (beob) {
        beob.Lat = chToWgsLat(parseInt(beob.X, 10), parseInt(beob.Y, 10));
        beob.Lng = chToWgsLng(parseInt(beob.X, 10), parseInt(beob.Y, 10));
    });
    // TPop zählen
    anz_beob = beob_liste.length;
    // Karte mal auf Zürich zentrieren, falls in den BeobListe.rows keine Koordinaten kommen
    // auf die die Karte ausgerichtet werden kann
    lat = 47.383333;
    lng = 8.533333;
    latlng = new google.maps.LatLng(lat, lng);
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
    _.each(beob_liste, function (beob) {
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
        if (datum) {
            titel = datum.toString();
        } else {
            titel = "";
        }
        // A_NOTE muss String sein
        if (beob.A_NOTE) {
            a_note = beob.A_NOTE.toString();
        } else {
            a_note = "";
        }
        marker = new MarkerWithLabel({
            map: map,
            position: latlng2,
            title: titel,
            labelContent: a_note,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon_violett.png"
        });
        // dem Marker einen Typ und eine id geben
        // damit drag and drop möglich werden soll
        // marker.set("typ", "beob");
        // marker.set("id", Beob.BeobId);
        marker.metadata = {typ: "beob_nicht_beurteilt", id: beob.NO_NOTE};
        markers.push(marker);
        var Autor = beob.Autor || "(keiner)",
            Projekt = beob.PROJET || "(keines)",
            Ort = beob.DESC_LOCALITE || "(keiner)";
        contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<div id="bodyContent" class="GmInfowindow">' +
            '<h3>' + datum + '</h3>' +
            '<p>Autor: ' + Autor + '</p>' +
            '<p>Projekt: ' + Projekt + '</p>' +
            '<p>Ort: ' + Ort + '</p>' +
            '<p>Koordinaten: ' + beob.X + ' / ' + beob.Y + '</p>' +
            '<p><a href="#" onclick="window.apf.öffneBeob(\'' + beob.NO_NOTE + '\')">Formular anstelle Karte öffnen<\/a></p>' +
            '<p><a href="#" onclick="window.apf.öffneBeobInNeuemTab(\'' + beob.NO_NOTE + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
            '</div>' +
            '</div>';
        makeListener(map, marker, contentString);
    });
    marker_options = {
        maxZoom: 17,
        styles: [{
            height: 53,
            url: "img/m5.png",
            width: 53
        }]
    };
    marker_cluster = new MarkerClusterer(map, markers, marker_options);
    if (anz_beob === 1) {
        // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
        map.setCenter(latlng);
        map.setZoom(18);
    } else {
        // Karte auf Ausschnitt anpassen
        map.fitBounds(bounds);
    }
};

module.exports = returnFunction;