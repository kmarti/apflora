/*jslint node: true, browser: true*/
/*global google*/
'use strict';

var _ = require('underscore');

var returnFunction = function (tpop_liste, $) {
    var anz_tpop,
        infowindow,
        tpop_beschriftung,
        lat,
        lng,
        latlng,
        options,
        map,
        bounds,
        markers,
        tpop_id,
        latlng2,
        marker,
        contentString,
        marker_options,
        marker_cluster,
        my_flurname,
        chToWgsLat    = require('../lib/chToWgsLat'),
        chToWgsLng    = require('../lib/chToWgsLng'),
        zeigeFormular = require('./zeigeFormular');

    // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
    zeigeFormular("google_karte", $);
    window.apf.gmap.markers_array = [];
    window.apf.gmap.info_window_array = [];
    infowindow = new google.maps.InfoWindow();

    // TPopListe bearbeiten:
    // Objekte löschen, die keine Koordinaten haben
    // Lat und Lng ergänzen
    _.each(tpop_liste, function (tpop, index) {
        if (!tpop.TPopXKoord || !tpop.TPopYKoord) {
            // tpop einsetzen geht nicht, weil Chrome Fehler meldet
            delete tpop_liste[index];
        } else {
            tpop.Lat = chToWgsLat(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10));
            tpop.Lng = chToWgsLng(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10));
        }
    });

    // TPop zählen
    anz_tpop = tpop_liste.length;

    // Karte mal auf Zürich zentrieren, falls in den TPopListe keine Koordinaten kommen
    // auf die die Karte ausgerichtet werden kann
    lat = 47.383333;
    lng = 8.533333;
    latlng = new google.maps.LatLng(lat, lng);
    options = {
        zoom: 15,
        center: latlng,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    map = new google.maps.Map(document.getElementById("google_karten_div"), options);
    window.apf.gmap.map = map;
    bounds = new google.maps.LatLngBounds();

    // für alle TPop Marker erstellen
    markers = [];
    _.each(tpop_liste, function (tpop) {
        tpop_id = tpop.TPopId;
        tpop_beschriftung = window.apf.beschrifteTPopMitNrFürKarte(tpop.PopNr, tpop.TPopNr);
        latlng2 = new google.maps.LatLng(tpop.Lat, tpop.Lng);
        if (anz_tpop === 1) {
            // map.fitbounds setzt zu hohen zoom, wenn nur eine TPop Koordinaten hat > verhindern
            latlng = latlng2;
        } else {
            // Kartenausschnitt um diese Koordinate erweitern
            bounds.extend(latlng2);
        }
        marker = new MarkerWithLabel({
            map:          map,
            position:     latlng2,
            title:        tpop_beschriftung,
            labelContent: tpop_beschriftung,
            labelAnchor:  new google.maps.Point(75, 0),
            labelClass:   "MapLabel",
            icon:         "img/flora_icon.png"
        });
        markers.push(marker);
        my_flurname = tpop.TPopFlurname || '(kein Flurname)';
        contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + tpop.Artname + '</h3>'+
            '<p>Population: ' + tpop.PopName + '</p>'+
            '<p>TPop: ' + my_flurname + '</p>'+
            '<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>'+
            '<p><a href="#" onclick="window.apf.öffneTPop("' + tpop.TPopId + '")">Formular anstelle Karte öffnen<\/a></p>'+
            '<p><a href="#" onclick="window.apf.öffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')">Formular neben der Karte öffnen<\/a></p>'+
            '<p><a href="#" onclick="window.apf.öffneTPopInNeuemTab("' + tpop.TPopId + '")">Formular in neuem Fenster öffnen<\/a></p>'+
            '</div>'+
            '</div>';
        makeListener(map, marker, contentString);
    });
    marker_options = {
        maxZoom: 17, 
        styles: [{
                height: 53,
                url:    "img/m8.png",
                width:  53
            }]
    };

    // globale Variable verwenden, damit ein Klick auf die Checkbox die Ebene einblenden kann
    window.apf.google_karte_detailpläne = new google.maps.KmlLayer({
        url: 'kml/rueteren.kmz',
        preserveViewport: true
    });

    window.apf.google_karte_detailpläne.setMap(null);
    marker_cluster = new MarkerClusterer(map, markers, marker_options);
    if (anz_tpop === 1) {
        // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
        map.setCenter(latlng);
        map.setZoom(18);
    } else {
        // Karte auf Ausschnitt anpassen
        map.fitBounds(bounds);
    }

    // diese Funktion muss hier sein, damit infowindow bekannt ist
    function makeListener(map, marker, contentString) {
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
    }
};

module.exports = returnFunction;