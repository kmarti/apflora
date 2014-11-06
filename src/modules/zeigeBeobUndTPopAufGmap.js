/*jslint node: true, browser: true, nomen: true, todo: true */
/*global Google*/
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (beob_liste, tpop_liste) {
    var anz_beob,
        anz_tpop,
        infowindow_beob,
        infowindow_tpop,
        tpop,
        lat,
        lng,
        latlng,
        options,
        map,
        bounds,
        markers_tpop,
        tpop_id,
        latlng2,
        marker_beob,
        marker_tpop,
        contentstring_beob,
        contentstring_tpop,
        marker_options_beob,
        marker_options_tpop,
        marker_cluster_beob,
        marker_cluster_tpop,
        datum,
        titel_beob,
        tpop_beschriftung,
        a_note,
        my_flurname,
        chToWgsLat = require('../lib/chToWgsLat'),
        chToWgsLng = require('../lib/chToWgsLng'),
        zeigeFormular = require('./zeigeFormular');

    // vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
    zeigeFormular("google_karte");
    window.apf.gmap.markers_array = [];
    window.apf.gmap.info_window_array = [];
    infowindow_beob = new google.maps.InfoWindow();
    infowindow_tpop = new google.maps.InfoWindow();
    // Lat und Lng in BeobListe ergänzen
    _.each(beob_liste, function (beob) {
        beob.Lat = chToWgsLat(parseInt(beob.X, 10), parseInt(beob.Y, 10));
        beob.Lng = chToWgsLng(parseInt(beob.X, 10), parseInt(beob.Y, 10));
    });
    // dito in TPopListe
    _.each(tpop_liste, function (tpop, index) {
        if (!tpop.TPopXKoord || !tpop.TPopYKoord) {
            // tpop gibt in Chrome Fehler
            delete tpop_liste[index];
        } else {
            tpop.Lat = chToWgsLat(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10));
            tpop.Lng = chToWgsLng(parseInt(tpop.TPopXKoord, 10), parseInt(tpop.TPopYKoord, 10));
        }
    });
    // Beob zählen
    anz_beob = beob_liste.length;
    // TPop zählen
    anz_tpop = tpop_liste.length;
    // Karte mal auf Zürich zentrieren, falls in den BeobListe.rows keine Koordinaten kommen
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
    markers_tpop = [];
    _.each(tpop_liste, function (tpop) {
        tpop_id = tpop.TPopId;
        latlng2 = new google.maps.LatLng(tpop.Lat, tpop.Lng);
        // Kartenausschnitt um diese Koordinate erweitern
        bounds.extend(latlng2);
        tpop_beschriftung = window.apf.beschrifteTPopMitNrFürKarte(tpop.PopNr, tpop.TPopNr);
        marker_tpop = new MarkerWithLabel({
            map: map,
            position: latlng2,
            title: tpop_beschriftung,
            labelContent: tpop_beschriftung,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon.png"
        });
        markers_tpop.push(marker_tpop);
        my_flurname = tpop.TPopFlurname || '(kein Flurname)';
        contentstring_tpop = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + tpop.Artname + '</h3>'+
            '<p>Population: ' + tpop.PopName + '</p>'+
            '<p>TPop: ' + my_flurname + '</p>'+
            '<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>'+
            '<p><a href="#" onclick="window.apf.öffneTPop(\'' + tpop.TPopId + '\')">Formular anstelle Karte öffnen<\/a></p>'+
            '<p><a href="#" onclick="window.apf.öffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')">Formular neben der Karte öffnen<\/a></p>'+
            '<p><a href="#" onclick="window.apf.öffneTPopInNeuemTab(\'' + tpop.TPopId + '\')">Formular in neuem Fenster öffnen<\/a></p>'+
            '</div>'+
            '</div>';
        makeListener(map, marker_tpop, contentstring_tpop);
    });
    marker_options_tpop = {
        maxZoom: 17, 
        styles: [{
                height: 53,
                url: "img/m8.png",
                width: 53
            }]
    };
    marker_cluster_tpop = new MarkerClusterer(map, markers_tpop, marker_options_tpop);
    
    // diese Funktion muss hier sein, damit infowindow bekannt ist
    function makeListener(map, markerTPop, contentStringTPop) {
        google.maps.event.addListener(markerTPop, 'click', function () {
            infowindow_tpop.setContent(contentStringTPop);
            infowindow_tpop.open(map, markerTPop);
        });
    }

    // für alle Beob Marker erstellen
    window.markersBeob = [];
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
            titel_beob = datum.toString();
        } else {
            titel_beob = "";
        }
        // A_NOTE muss String sein
        if (beob.A_NOTE) {
            a_note = beob.A_NOTE.toString();
        } else {
            a_note = "";
        }
        marker_beob = new MarkerWithLabel({
            map: map,
            position: latlng2,
            title: titel_beob,
            labelContent: a_note,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon_violett.png",
            draggable: true
        });
        window.markersBeob.push(marker_beob);
        makeListenerMarkerBeobDragend(marker_beob, beob);
        var Autor = beob.Autor || "(keiner)";
        var Projekt = beob.PROJET || "(keines)";
        var Ort = beob.DESC_LOCALITE || "(keiner)";
        contentstring_beob = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + datum + '</h3>'+
            '<p>Autor: ' + Autor + '</p>'+
            '<p>Projekt: ' + Projekt + '</p>'+
            '<p>Ort: ' + Ort + '</p>'+
            '<p>Koordinaten: ' + beob.X + ' / ' + beob.Y + '</p>'+
            '<p><a href="#" onclick="window.apf.öffneBeob(\'' + beob.NO_NOTE + '\')">Formular anstelle Karte öffnen<\/a></p>'+
            //'<p><a href="#" onclick="window.apf.öffneFormularAlsPopup(\'beob\', ' + beob.NO_NOTE + ')">Formular neben der Karte öffnen<\/a></p>'+
            '<p><a href="#" onclick="window.apf.öffneBeobInNeuemTab(\'' + beob.NO_NOTE + '\')">Formular in neuem Fenster öffnen<\/a></p>'+
            '</div>'+
            '</div>';
        makeListenerBeob(map, marker_beob, contentstring_beob);
    });
    // KEIN MARKERCLUSTERER: er verhindert das Entfernen einzelner Marker!
    // ausserdem macht er es schwierig, eng liegende Marker zuzuordnen
    
    // diese Funktion muss hier sein, damit infowindow bekannt ist
    function makeListenerBeob(map, markerBeob, contentStringBeob) {
        google.maps.event.addListener(markerBeob, 'click', function () {
            infowindow_beob.setContent(contentStringBeob);
            infowindow_beob.open(map, markerBeob);
        });
    }

    function makeListenerMarkerBeobDragend(markerBeob, Beob) {
        /*global Google*/
        var ddInChY = require('../lib/ddInChY'),
            ddInChX = require('../lib/ddInChX');

        google.maps.event.addListener(markerBeob, "dragend", function (event) {
            var lat, lng, X, Y, that;
            that = this;
            // Koordinaten berechnen
            lat = event.latLng.lat();
            lng = event.latLng.lng();
            X = ddInChY(lat, lng);
            Y = ddInChX(lat, lng);
            // nächstgelegene TPop aus DB holen
            var BeobNächsteTPop = $.ajax({
                type: 'get',
                url: 'api/v1/beobNaechsteTpop/apId=' + Beob.NO_ISFS + '/X=' + X + '/Y=' + Y
            });
            BeobNächsteTPop.done(function (data) {
                var beobtxt,
                    chToWgsLng = require('../lib/chToWgsLng'),
                    chToWgsLat = require('../lib/chToWgsLat');
                if (Beob.Autor) {
                    beobtxt = "Beobachtung von " + Beob.Autor + " aus dem Jahr " + Beob.A_NOTE;
                } else {
                    beobtxt = "Beobachtung ohne Autor aus dem Jahr " + Beob.A_NOTE;
                }
                // rückfragen
                $("#Meldung")
                    .html("Soll die " + beobtxt + "<br>der Teilpopulation '" + data[0].TPopFlurname + "' zugeordnet werden?")
                    .dialog({
                    modal: true,
                    title: "Zuordnung bestätigen",
                    width: 600,
                    buttons: {
                        Ja: function () {
                            $(this).dialog("close");
                            // dem bind.move_node mitteilen, dass das Formular nicht initiiert werden soll
                            localStorage.karte_fokussieren = true;
                            // Beob der TPop zuweisen
                            // TODO: Was ist, wenn diese Beobachtung im Baum nicht dargestellt wird????
                            $("#tree").jstree("move_node", "#beob" + Beob.NO_NOTE, "#tpop_ordner_beob_zugeordnet" + data[0].TPopId, "first");
                            //$("#tree").jstree("move_node", "#beob" + Beob.NO_NOTE, "#tpop_ordner_beob_zugeordnet" + data[0].TPopId, "first");
                            // Den Marker der zugewiesenen Beobachtung entfernen
                            that.setMap(null);
                        },
                        Nein: function () {
                            $(this).dialog("close");
                            // drag rückgängig machen
                            lng = chToWgsLng(Beob.X, Beob.Y);
                            lat = chToWgsLat(Beob.X, Beob.Y);
                            var latlng3 = new google.maps.LatLng(lat, lng);
                            that.setPosition(latlng3);
                        }
                    }
                });
            });
            BeobNächsteTPop.fail(function () {
                window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
            });
        });
    }

    if (anz_tpop + anz_beob === 1) {
        // map.fitbounds setzt zu hohen zoom, wenn nur ein Punkt dargestellt wird > verhindern
        map.setCenter(latlng);
        map.setZoom(18);
    } else {
        // Karte auf Ausschnitt anpassen
        map.fitBounds(bounds);
    }
};

module.exports = returnFunction;