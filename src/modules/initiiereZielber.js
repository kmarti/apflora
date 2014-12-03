/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                      = require('jquery'),
    initiiereAp            = require('./initiiereAp'),
    initiiereApziel        = require('./initiiereApziel'),
    zeigeFormular          = require('./zeigeFormular'),
    melde                  = require('./melde'),
    leereFelderVonFormular = require('./leereFelderVonFormular');

module.exports = function (apId, apZielId, zielberId) {
    var $ZielBerJahr = $("#ZielBerJahr");

    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        window.apf.initiiereApp();
        return;
    }
    if (!apZielId && !localStorage.apzielId) {
        // es fehlen benötigte Daten > zwei Ebenen höher
        initiiereAp(apId);
        return;
    }
    if (!zielberId && !localStorage.zielberId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereApziel(apId, apZielId);
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId              = apId || localStorage.apId;

    // apZielId setzen
    localStorage.apzielId = localStorage.apzielId || apZielId;
    apZielId = apZielId || localStorage.apzielId;

    // zielberId setzen
    localStorage.zielberId = localStorage.zielberId || zielberId;
    zielberId = zielberId || localStorage.zielberId;

    // Felder zurücksetzen
    leereFelderVonFormular("zielber");

    // Daten für die zielber aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblZielBer/feld=ZielBerId/wertString=' + zielberId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // zeilber bereitstellen
            window.apf.zielber = data;

            // Felder mit Daten beliefern
            $ZielBerJahr.val(data.ZielBerJahr);
            $("#ZielBerErreichung").val(data.ZielBerErreichung);
            $("#ZielBerTxt").val(data.ZielBerTxt);

            // Formulare blenden
            zeigeFormular("zielber");
            history.pushState(null, null, "index.html?ap=" + apId + "&apziel=" + apZielId + "&zielber=" + zielberId);

            // bei neuen Datensätzen Fokus steuern
            if (!$ZielBerJahr.val()) {
                $ZielBerJahr.focus();
            }
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für den Zielbericht erhalten');
    });
};