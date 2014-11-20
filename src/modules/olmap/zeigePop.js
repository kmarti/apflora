/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                  = require('jquery'),
    zeigeFormular      = require('../zeigeFormular'),
    erstelleTPopLayer  = require('./erstelleTPopLayer'),
    initiiereLayertree = require('./initiiereLayertree'),
    zeigePopInTPop     = require('./zeigePopInTPop'),
    melde              = require('../melde'),
    waehleAusschnittFuerUebergebenePop = require('./waehleAusschnittFuerUebergebenePop');

module.exports = function (popListeMarkiert) {
    var markiertePop;

    // falls noch aus dem Verorten ein Klick-Handler besteht: deaktivieren
    if (window.apf.olmap.LetzterKlickHandler) {
        window.apf.olmap.LetzterKlickHandler.deactivate();
    }

    markiertePop = waehleAusschnittFuerUebergebenePop(popListeMarkiert);

    // Grundkarte aufbauen
    $.when(zeigeFormular("GeoAdminKarte")).then(function () {
        // Karte zum richtigen Ausschnitt zoomen
        // aber nur, wenn keine Auswahl aktiv
        if (window.apf.olmap.auswahlPolygonLayer && window.apf.olmap.auswahlPolygonLayer.features.length > 0) {
            // Auswahl aktiv, Zoomstufe belassen
        } else {
            window.apf.olmap.map.updateSize();
            window.apf.olmap.map.getView().fitExtent(markiertePop.bounds, window.apf.olmap.map.getSize());
        }
        // tpop und pop ergänzen
        // alle tpop holen
        $.ajax({
            type: 'get',
            url: 'api/v1/tpopKarteAlle/apId=' + window.apf.ap.ApArtId
        }).done(function (TPopListe) {
            $.when(
                // Layer für Symbole und Beschriftung erstellen
                erstelleTPopLayer(TPopListe),
                // alle Pop holen, symbole und nr sichtbar schalten, Markierung übergeben
                zeigePopInTPop(true, true, markiertePop.popidMarkiert)
            ).then(function () {
                // layertree neu aufbauen
                initiiereLayertree();
            });
        }).fail(function () {
            melde("Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden");
        });
    });
};