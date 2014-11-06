/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

var returnFunction = function (TPopListeMarkiert) {
    var zeigeFormular         = require('../zeigeFormular'),
        // wenn layer "Populationen" sichtbar ist, sichtbar behalten
        overlay_pop_visible   = window.apf.olmap.istLayerSichtbarNachName("Populationen"),
        // wenn layer "Populationen Namen" sichtbar ist, sichtbar behalten
        overlay_popnr_visible = window.apf.olmap.istLayerSichtbarNachName("Populationen Nummern"),
        markierte_tpop        = window.apf.olmap.wähleAusschnittFürÜbergebeneTPop(TPopListeMarkiert),
        erstelleTPopLayer     = require('./erstelleTPopLayer'),
        initiiereLayertree    = require('./initiiereLayertree');

    // Grundkarte aufbauen
    $.when(zeigeFormular("GeoAdminKarte"))
        .then(function () {
            // Karte zum richtigen Ausschnitt zoomen
            window.apf.olmap.map.updateSize();
            window.apf.olmap.map.getView().fitExtent(markierte_tpop.bounds, window.apf.olmap.map.getSize());
            // tpop und pop ergänzen
            // alle tpop holen
            var getTPopKarteAlle = $.ajax({
                type: 'get',
                url: 'api/v1/tpopKarteAlle/apId=' + window.apf.ap.ApArtId
            });

            getTPopKarteAlle.done(function (tpop_liste) {
                $.when(
                    // Layer für Symbole und Beschriftung erstellen
                    erstelleTPopLayer(tpop_liste, markierte_tpop.tpopid_markiert, true),
                    // alle Pop holen
                    window.apf.olmap.zeigePopInTPop(overlay_pop_visible, overlay_popnr_visible)
                )
                .then(function () {
                    // layertree neu aufbauen
                    initiiereLayertree();
                });
            });

            getTPopKarteAlle.fail(function () {
                window.apf.melde("Fehler: Es konnten keine Teilpopulationen aus der Datenbank abgerufen werden");
            });
    });
};

module.exports = returnFunction;