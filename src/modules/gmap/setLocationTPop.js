/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $       = require('jquery'),
    google  = require('google'),
    ddInChY = require('../../lib/ddInChY'),
    ddInChX = require('../../lib/ddInChX'),
    melde   = require('../melde');

module.exports = function (latLng, map, marker, TPop) {
    var lat,
        lng,
        contentString,
        infowindow,
        title,
        X,
        Y;

    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!window.apf.pruefeSchreibvoraussetzungen()) {
        return;
    }
    title = (TPop && TPop.TPopFlurname ? TPop.TPopFlurname : "neue Teilpopulation");
    lat   = latLng.lat();
    lng   = latLng.lng();
    X     = ddInChY(lat, lng);
    Y     = ddInChX(lat, lng);
    $.ajax({
        type: 'post',
        url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + localStorage.tpopId + '/feld=TPopXKoord/wert=' + X + '/user=' + sessionStorage.User
    }).done(function () {
        $.ajax({
            type: 'post',
            url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + localStorage.tpopId + '/feld=TPopYKoord/wert=' + Y + '/user=' + sessionStorage.User
        }).done(function () {
            window.apf.gmap.clearInfoWindows();
            contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<div id="bodyContent" class="GmInfowindow">' +
                '<h3>' + title + '</h3>' +
                '<p>Koordinaten: ' + X + ' / ' + Y + '</p>' +
                '<p><a href="#" onclick="window.apf.oeffneTPop(\'' + localStorage.tpopId + '\')">Formular anstelle Karte öffnen<\/a></p>' +
                '<p><a href="#" onclick="window.apf.oeffneFormularAlsPopup(\'tpop\', ' + localStorage.tpopId + ')">Formular neben der Karte öffnen<\/a></p>' +
                '<p><a href="#" onclick="window.apf.oeffneTPopInNeuemTab(\'' + localStorage.tpopId + '\')">Formular in neuem Fenster öffnen<\/a></p>' +
                '</div>' +
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
            melde("Fehler: Die Y-Koordinate wurde nicht übernommen (die X-Koordinate offenbar schon)");
        });
    }).fail(function () {
        melde("Fehler: Die Koordinaten wurden nicht übernommen");
    });
};