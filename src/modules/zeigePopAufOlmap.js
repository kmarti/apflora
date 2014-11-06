/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

var returnFunction = function (PopListeMarkiert) {
    // falls noch aus dem Verorten ein Klick-Handler besteht: deaktivieren
    if (window.apf.olmap.LetzterKlickHandler) {
        window.apf.olmap.LetzterKlickHandler.deactivate();
    }

    var markierte_pop = window.apf.olmap.wähleAusschnittFürÜbergebenePop(PopListeMarkiert),
        extent,
        zeigeFormular = require('./zeigeFormular');

    // Grundkarte aufbauen
    $.when(zeigeFormular("GeoAdminKarte"))
        .then(function () {
            // Karte zum richtigen Ausschnitt zoomen
            // aber nur, wenn keine Auswahl aktiv
            if (window.apf.olmap.auswahlPolygonLayer && window.apf.olmap.auswahlPolygonLayer.features.length > 0) {
                // Auswahl aktiv, Zoomstufe belassen
            } else {
                window.apf.olmap.map.updateSize();
                window.apf.olmap.map.getView().fitExtent(markierte_pop.bounds, window.apf.olmap.map.getSize());
            }
            // tpop und pop ergänzen
            // alle tpop holen
            $.ajax({
                type: 'get',
                url: 'api/v1/tpopKarteAlle/apId=' + window.apf.ap.ApArtId
            }).done(function (TPopListe) {
                $.when(
                    // Layer für Symbole und Beschriftung erstellen
                    window.apf.olmap.erstelleTPopLayer(TPopListe),
                    // alle Pop holen, symbole und nr sichtbar schalten, Markierung übergeben
                    window.apf.olmap.zeigePopInTPop(true, true, markierte_pop.popid_markiert)
                )
                .then(function () {
                    var initiiereLayertree = require('./initiiereLayertree');
                    // layertree neu aufbauen
                    initiiereLayertree();
                });
            }).fail(function () {
                window.apf.melde("Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden");
            });
    });
};

module.exports = returnFunction;