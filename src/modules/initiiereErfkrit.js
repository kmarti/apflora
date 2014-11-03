/*jslint node: true, browser: true, nomen: true */
'use strict';

var $             = require('jquery'),
    initiiereApp  = require('./initiiereApp'),
    initiiereAp   = require('./initiiereAp'),
    limiter       = require('../lib/limiter'),
    zeigeFormular = require('./zeigeFormular');

var returnFunction = function (apId, erfkritId) {
    var $ErfkritErreichungsgrad = $("#ErfkritErreichungsgrad");

    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereApp();
        return;
    }
    if (!erfkritId && !localStorage.erfkrit_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp(apId);
        return;
    }

    // apId setzen
    if (!localStorage.ap_id) {
        localStorage.ap_id = apId;
    }
    if (!apId) {
        apId = localStorage.ap_id;
    }

    // erfkritId setzen
    if (!localStorage.erfkrit_id) {
        localStorage.erfkrit_id = erfkritId;
    }
    if (!erfkritId) {
        erfkritId = localStorage.erfkrit_id;
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
        window.apf.melde('Fehler: Keine Daten für das Erfolgskriterium erhalten');
    });
};

module.exports = returnFunction;