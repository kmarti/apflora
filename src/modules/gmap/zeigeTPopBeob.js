/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                       = require('jquery'),
    _                       = require('underscore'),
    google                  = require('google'),
    MarkerWithLabel         = require('MarkerWithLabel'),
    MarkerClusterer         = require('MarkerClusterer'),
    chToWgsLng              = require('../../lib/chToWgsLng'),
    chToWgsLat              = require('../../lib/chToWgsLat'),
    zeigeFormular           = require('../zeigeFormular'),
    makeListenerMarkerClick = require('./makeListenerMarkerClick');

module.exports = function (tpopBeobListe) {
    var anzTpopBeob,
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
        autor,
        projekt,
        ort;

    console.log('tpopBeobListe: ', tpopBeobListe);

    // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
    zeigeFormular("google_karte");
    window.apf.gmap.markersArray    = [];
    window.apf.gmap.infoWindowArray = [];
    // TPopListe bearbeiten:
    // Objekte löschen, die keine Koordinaten haben
    // Lat und Lng ergänzen
    _.each(tpopBeobListe, function (tpopBeob, index) {
        if (tpopBeob.X && tpopBeob.Y) {
            if (!tpopBeob.Lat || !tpopBeob.Lng) {
                tpopBeob.Lat = chToWgsLat(parseInt(tpopBeob.X, 10), parseInt(tpopBeob.Y, 10));
                tpopBeob.Lng = chToWgsLng(parseInt(tpopBeob.X, 10), parseInt(tpopBeob.Y, 10));
            }
        } else {
            tpopBeobListe.splice(index, 1);
        }
    });
    // TPop zählen
    anzTpopBeob = tpopBeobListe.length;
    console.log('anzTpopBeob: ', anzTpopBeob);
    // Karte mal auf Zürich zentrieren, falls in den TPopBeobListe.rows keine Koordinaten kommen
    // auf die die Karte ausgerichtet werden kann
    lat     = 47.383333;
    lng     = 8.533333;
    latlng  = new google.maps.LatLng(lat, lng);
    console.log('latlng: ', latlng);
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
    window.apf.gmap.map = map = new google.maps.Map($("#google_karten_div"), options);
    // Versuch: SVO einblenden
    //loadWMS(map, "//wms.zh.ch/FnsSVOZHWMS?");
    //loadWMS(map, "//www.gis.zh.ch/scripts/wmsfnssvo2.asp?");
    // Versuch: AV einblenden
    //loadWMS(map, "//wms.zh.ch/avwms?");
    bounds = new google.maps.LatLngBounds();

    // für alle Orte Marker erstellen
    markers = [];
    _.each(tpopBeobListe, function (tpopBeob, index) {
        console.log('verarbeite tpopBeob Nr. ' + index);
        datum   = tpopBeob.Datum;
        latlng2 = new google.maps.LatLng(tpopBeob.Lat, tpopBeob.Lng);
        console.log('latlng2: ', latlng2);
        if (anzTpopBeob === 1) {
            // map.fitbounds setzt zu hohen zoom, wenn nur eine TPopBeob Koordinaten hat > verhindern
            latlng = latlng2;
        } else {
            // Kartenausschnitt um diese Koordinate erweitern
            bounds.extend(latlng2);
        }
        // title muss String sein
        titel = (datum ? datum.toString() : '');
        marker = new MarkerWithLabel({
            map:          map,
            position:     latlng2,
            // title muss String sein
            title:        titel,
            labelContent: titel,
            labelAnchor:  new google.maps.Point(75, 0),
            labelClass:   "MapLabel",
            icon:         "img/flora_icon_violett.png"
        });
        markers.push(marker);
        autor = tpopBeob.Autor || "(keiner)";
        projekt = tpopBeob.PROJET || "(keines)";
        ort = tpopBeob.DESC_LOCALITE || "(keiner)";
        contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<div id="bodyContent" class="GmInfowindow">' +
            '<h3>' + datum + '</h3>' +
            '<p>Autor: ' + autor + '</p>' +
            '<p>Projekt: ' + projekt + '</p>' +
            '<p>Ort: ' + ort + '</p>' +
            '<p>Koordinaten: ' + tpopBeob.X + ' / ' + tpopBeob.Y + '</p>' +
            '<p><a href="#" onclick="window.apf.öffneTPopBeob(\'' + tpopBeob.NO_NOTE + '\')">Formular anstelle Karte öffnen<\/a></p>' +
            '<p><a href="#" onclick="window.apf.öffneTPopBeobInNeuemTab(\'' + tpopBeob.NO_NOTE + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
            '</div>' +
            '</div>';
        makeListenerMarkerClick(map, marker, contentString, infowindow);
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
    console.log('markerCluster: ', markerCluster);
    if (anzTpopBeob === 1) {
        console.log('anzTpopBeob = 1');
        // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
        map.setCenter(latlng);
        console.log('map center set');
        map.setZoom(18);
        console.log('map with zoom set: ', map);
    } else {
        console.log('anzTpopBeob = else');
        // Karte auf Ausschnitt anpassen
        map.fitBounds(bounds);
    }
};