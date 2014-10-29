/*jslint node: true, browser: true */
'use strict';

var $               = require('jquery'),
    dateFormat      = require('dateformat'),
    limiter         = require('../lib/limiter'),
    initiiereIndex  = require('./initiiereIndex'),
    initiiereAp     = require('./initiiereAp'),
    getAdressenHtml = require('./getAdressenHtml');

var returnFunction = function (apId, apBerId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereIndex();
        return;
    }
    if (!apBerId && !localStorage.jber_id) {
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

    // apBerId setzen
    if (!localStorage.jber_id) {
        localStorage.jber_id = apBerId;
    }
    if (!apBerId) {
        apBerId = localStorage.jber_id;
    }

    var $JBerJahr = $("#JBerJahr");

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("jber");

    // Daten für die jber aus der DB holen
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblJBer/feld=JBerId/wertNumber=' + localStorage.jber_id,
        dataType: 'json'
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
                $("#JBerDatum").val(dateFormat(data.JBerDatum, 'yyyy.mm.dd'));
            }
            // adressen holen, um JBerBearb zu füllen
            getAdressenHtml(function (html) {
                $("#JBerBearb")
                    .html(html)
                    .val(window.apf.jber.JBerBearb);
            });

            // Formulare blenden
            window.apf.zeigeFormular("jber");
            history.pushState(null, null, "index.html?ap=" + localStorage.ap_id + "&jber=" + localStorage.jber_id);

            // bei neuen Datensätzen Fokus steuern
            if (!$JBerJahr.val()) {
                $JBerJahr.focus();
            }
        }
    }).fail(function () {
        window.apf.melde('Fehler: Keine Daten für den AP-Bericht erhalten');
    });
};

module.exports = returnFunction;