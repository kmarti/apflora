/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    google = require('google');

var returnFunction = function (LatLng, map, marker, TPop) {
    /*global Google*/
    var lat,
        lng,
        contentString,
        infowindow,
        Objekt,
        title,
        X,
        Y,
        ddInChY = require('./lib/ddInChY'),
        ddInChX = require('./lib/ddInChX');

    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!window.apf.prüfeSchreibvoraussetzungen()) { return; }
    title = (TPop && TPop.TPopFlurname ? TPop.TPopFlurname : "neue Teilpopulation");
    lat = LatLng.lat();
    lng = LatLng.lng();
    X = ddInChY(lat, lng);
    Y = ddInChX(lat, lng);
    $.ajax({
        type: 'post',
        url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + localStorage.tpop_id + '/feld=TPopXKoord/wert=' + X + '/user=' + sessionStorage.User
    }).done(function () {
        $.ajax({
            type: 'post',
            url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + localStorage.tpop_id + '/feld=TPopYKoord/wert=' + Y + '/user=' + sessionStorage.User
        }).done(function () {
            window.apf.gmap.clearInfoWindows();
            contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<div id="bodyContent" class="GmInfowindow">'+
                '<h3>' + title + '</h3>'+
                '<p>Koordinaten: ' + X + ' / ' + Y + '</p>'+
                '<p><a href="#" onclick="window.apf.öffneTPop(\'' + localStorage.tpop_id + '\')">Formular anstelle Karte öffnen<\/a></p>'+
                '<p><a href="#" onclick="window.apf.öffneFormularAlsPopup(\'tpop\', ' + localStorage.tpop_id + ')">Formular neben der Karte öffnen<\/a></p>'+
                '<p><a href="#" onclick="window.apf.öffneTPopInNeuemTab(\'' + localStorage.tpop_id + '\')">Formular in neuem Fenster öffnen<\/a></p>'+
                '</div>'+
                '</div>';
            infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            if (!window.apf.gmap.info_window_array) {
                window.apf.gmap.info_window_array = [];
            }
            window.apf.gmap.info_window_array.push(infowindow);
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        }).fail(function () {
            window.apf.melde("Fehler: Die Y-Koordinate wurde nicht übernommen (die X-Koordinate offenbar schon)");
        });
    }).fail(function () {
        window.apf.melde("Fehler: Die Koordinaten wurden nicht übernommen");
    });
};

module.exports = returnFunction;