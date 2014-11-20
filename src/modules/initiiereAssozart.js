/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $             = require('jquery'),
    _             = require('underscore'),
    initiiereAp   = require('./initiiereAp'),
    zeigeFormular = require('./zeigeFormular'),
    melde         = require('./melde');

module.exports = function (apId, assozId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        window.apf.initiiereApp();
        return;
    }
    if (!assozId && !localStorage.assozartenId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp(apId);
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId              = apId || localStorage.apId;

    // assozId setzen
    if (!localStorage.assozartenId) {
        localStorage.assozartenId = assozId;
    }
    if (!assozId) {
        assozId = localStorage.assozartenId;
    }

    var $AaSisfNrText = $("#AaSisfNrText"),
        aaSisfNrText;

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("assozarten");

    // Daten für die assozarten aus der DB holen
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblAssozArten/feld=AaId/wertNumber=' + assozId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // assozarten bereitstellen
            window.apf.assozarten = data;

            // Felder mit Daten beliefern
            // autocomplete, d.h. ein Feld für den Text und eines für die nummer
            if (data.AaSisfNr) {
                $("#AaSisfNr").val(data.AaSisfNr);
                aaSisfNrText = _.find(window.apf.artliste, function (art) {
                    return art.id === data.AaSisfNr;
                });
                // falls die erfasste Nummer in der Artliste nicht (mehr) enthalten ist!
                if (aaSisfNrText) {
                    $AaSisfNrText.val(aaSisfNrText.label);
                }
            }
            $("#AaBem").val(data.AaBem);

            // Formulare blenden
            zeigeFormular("assozarten");
            history.pushState(null, null, "index.html?ap=" + apId + "&assozarten=" + assozId);

            // bei neuen Datensätzen Fokus steuern
            if (!$AaSisfNrText.val()) {
                $AaSisfNrText.focus();
            }
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für die assoziierte Art erhalten');
    });
};