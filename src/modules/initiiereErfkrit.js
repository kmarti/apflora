/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $             = require('jquery'),
    initiiereApp  = require('./initiiereApp'),
    initiiereAp   = require('./initiiereAp'),
    limiter       = require('../lib/limiter'),
    zeigeFormular = require('./zeigeFormular'),
    melde         = require('./melde');

var returnFunction = function (apId, erfkritId) {
    var $ErfkritErreichungsgrad = $("#ErfkritErreichungsgrad");

    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        initiiereApp();
        return;
    }
    if (!erfkritId && !localStorage.erfkritId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp(apId);
        return;
    }

    // apId setzen
    if (!localStorage.apId) {
        localStorage.apId = apId;
    }
    if (!apId) {
        apId = localStorage.apId;
    }

    // erfkritId setzen
    if (!localStorage.erfkritId) {
        localStorage.erfkritId = erfkritId;
    }
    if (!erfkritId) {
        erfkritId = localStorage.erfkritId;
    }

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("erfkrit");

    // Daten für die erfkrit aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblErfKrit/feld=ErfkritId/wertString=' + erfkritId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // erfkrit bereitstellen
            window.apf.erfkrit = data;

            // Felder mit Daten beliefern
            $("#ErfkritErreichungsgrad" + data.ErfkritErreichungsgrad).prop("checked", true);
            $("#ErfkritTxt")
                .val(data.ErfkritTxt)
                .limiter(255, $("#ErfkritTxt_limit"));

            // Formulare blenden
            zeigeFormular("erfkrit");
            history.pushState(null, null, "index.html?ap=" + apId + "&erfkrit=" + erfkritId);

            // bei neuen Datensätzen Fokus steuern
            if (!$ErfkritErreichungsgrad.val()) {
                $ErfkritErreichungsgrad.focus();
            }
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für das Erfolgskriterium erhalten');
    });
};

module.exports = returnFunction;