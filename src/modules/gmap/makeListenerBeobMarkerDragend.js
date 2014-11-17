/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $          = require('jquery'),
    google     = require('google'),
    chToWgsLat = require('../../lib/chToWgsLat'),
    chToWgsLng = require('../../lib/chToWgsLng'),
    ddInChY    = require('../../lib/ddInChY'),
    ddInChX    = require('../../lib/ddInChX'),
    melde      = require('../melde');

module.exports = function (markerBeob, Beob) {
    google.maps.event.addListener(markerBeob, "dragend", function (event) {
        var lat,
            lng,
            X,
            Y,
            that;

        that = this;
        // Koordinaten berechnen
        lat = event.latLng.lat();
        lng = event.latLng.lng();
        X = ddInChY(lat, lng);
        Y = ddInChX(lat, lng);
        // nächstgelegene TPop aus DB holen
        $.ajax({
            type: 'get',
            url: 'api/v1/beobNaechsteTpop/apId=' + Beob.NO_ISFS + '/X=' + X + '/Y=' + Y
        }).done(function (data) {
            var beobtxt;

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
                            localStorage.karteFokussieren = true;
                            // Beob der TPop zuweisen
                            // TODO: Was ist, wenn diese Beobachtung im Baum nicht dargestellt wird????
                            $("#tree").jstree("move_node", "#beob" + Beob.NO_NOTE, "#tpopOrdnerBeobZugeordnet" + data[0].TPopId, "first");
                            //$("#tree").jstree("move_node", "#beob" + Beob.NO_NOTE, "#tpopOrdnerBeobZugeordnet" + data[0].TPopId, "first");
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
        }).fail(function () {
            melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
        });
    });
};