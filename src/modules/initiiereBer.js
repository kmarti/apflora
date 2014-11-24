/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                      = require('jquery'),
    initiiereAp            = require('./initiiereAp'),
    limiter                = require('../lib/limiter'),
    zeigeFormular          = require('./zeigeFormular'),
    melde                  = require('./melde'),
    leereFelderVonFormular = require('./leereFelderVonFormular');

// damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
// Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
module.exports = function (apId, berId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        window.apf.initiiereApp();
        return;
    }
    if (!berId && !localStorage.berId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp(apId);
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId              = apId || localStorage.apId;

    // berId setzen
    localStorage.berId = localStorage.berId || berId;
    berId              = berId || localStorage.berId;

    var $BerAutor = $("#BerAutor"),
        $BerJahr  = $("#BerJahr"),
        $BerTitel = $("#BerTitel"),
        $berUrl   = $("#berUrl");

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    // Felder zurücksetzen
    leereFelderVonFormular("ber");
    // Daten für die ber aus der DB holen
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblBer/feld=BerId/wertNumber=' + localStorage.berId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // ber bereitstellen
            window.apf.ber = data;

            // Felder mit Daten beliefern
            $BerAutor.val(data.BerAutor);
            $BerJahr.val(data.BerJahr);
            $BerTitel
                .val(data.BerTitel)
                .limiter(255, $("#BerTitel_limit"));
            $berUrl
                .val(data.BerURL)
                .limiter(255, $("#BerURL_limit"));

            // URL-Link initialisieren, wird bei Änderung der URL in index.html angepasst
            $('#BerURLHref').attr('onClick', "window.open('" + data.BerURL + "', target='_blank')");

            // Formulare blenden
            zeigeFormular("ber");
            history.pushState(null, null, "index.html?ap=" + localStorage.apId + "&ber=" + localStorage.berId);

            // bei neuen Datensätzen Fokus steuern
            if (!$BerAutor.val()) {
                $BerAutor.focus();
            } else if (!$BerJahr.val()) {
                $BerJahr.focus();
            } else if (!$BerTitel.val()) {
                $BerTitel.focus();
            } else if (!$berUrl.val()) {
                $berUrl.focus();
            }
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für den Bericht erhalten');
    });
};