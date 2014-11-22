/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                      = require('jquery'),
    dateFormat             = require('dateformat'),
    limiter                = require('../lib/limiter'),
    initiiereAp            = require('./initiiereAp'),
    getAdressenHtml        = require('./getAdressenHtml'),
    zeigeFormular          = require('./zeigeFormular'),
    melde                  = require('./melde'),
    leereFelderVonFormular = require('./leereFelderVonFormular');

module.exports = function (apId, apBerId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        window.apf.initiiereApp();
        return;
    }
    if (!apBerId && !localStorage.jberId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp(apId);
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId              = apId || localStorage.apId;

    // apBerId setzen
    localStorage.jberId = localStorage.jberId || apBerId;
    apBerId             = apBerId || localStorage.jberId;

    var $JBerJahr = $("#JBerJahr");

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    // Felder zurücksetzen
    leereFelderVonFormular("jber");

    // Daten für die jber aus der DB holen
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblJBer/feld=JBerId/wertNumber=' + localStorage.jberId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // jber bereitstellen
            window.apf.jber = data;

            // Felder mit Daten beliefern
            $JBerJahr.val(data.JBerJahr);
            $("#JBerSituation").val(data.JBerSituation);
            $("#JBerVergleichVorjahrGesamtziel").val(data.JBerVergleichVorjahrGesamtziel);
            $("#JBerBeurteilung" + data.JBerBeurteilung).prop("checked", true);
            // escapen, + und - werden sonst verändert
            $("#JBerVeraenGegenVorjahr\\" + data.JBerVeraenGegenVorjahr).prop("checked", true);
            $("#JBerAnalyse")
                .val(data.JBerAnalyse)
                .limiter(255, $("#JBerAnalyse_limit"));
            $("#JBerUmsetzung").val(data.JBerUmsetzung);
            $("#JBerErfko").val(data.JBerErfko);
            $("#JBerATxt").val(data.JBerATxt);
            $("#JBerBTxt").val(data.JBerBTxt);
            $("#JBerCTxt").val(data.JBerCTxt);
            $("#JBerDTxt").val(data.JBerDTxt);
            if (data.JBerDatum) {
                // chrome akzeptiert nur - getrennte Daten. Und zeigt sie dann gemäss Pattern korrekt an
                // die übrigen stellen mit - getrennte Daten leider mit - dar
                if (!!window.chrome) {
                    $("#JBerDatum").val(dateFormat(data.JBerDatum, 'yyyy-mm-dd'));
                } else {
                    $("#JBerDatum").val(dateFormat(data.JBerDatum, 'dd.mm.yyyy'));
                }
            }
            // adressen holen, um JBerBearb zu füllen
            getAdressenHtml(function (html) {
                $("#JBerBearb")
                    .html(html)
                    .val(window.apf.jber.JBerBearb);
            });

            // Formulare blenden
            zeigeFormular("jber");
            history.pushState(null, null, "index.html?ap=" + localStorage.apId + "&jber=" + localStorage.jberId);

            // bei neuen Datensätzen Fokus steuern
            if (!$JBerJahr.val()) {
                $JBerJahr.focus();
            }
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für den AP-Bericht erhalten');
    });
};