/*jslint node: true, browser: true, nomen: true */
'use strict';

var $             = require('jquery'),
    limiter       = require('../lib/limiter'),
    initiiereApp  = require('./initiiereApp'),
    initiiereAp   = require('./initiiereAp'),
    zeigeFormular = require('./zeigeFormular');

var returnFunction = function (apId, popId, ohne_zu_zeigen) {
    var $PopName = $("#PopName"),
        $PopNr   = $("#PopNr");

    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereApp();
        return;
    }
    if (!popId && !localStorage.pop_id && !window.apf.pop && (window.apf.pop && !window.apf.pop.PopId)) {
        // es fehlen benötigte Daten > zwei Ebenen höher
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

    // popId setzen
    if (!localStorage.pop_id) {
        if (!window.apf.pop || !window.apf.pop.PopId) {
            localStorage.pop_id = popId;
        } else {
            localStorage.pop_id = window.apf.pop.PopId;
        }
    }
    if (!popId) {
        if (!window.apf.pop || !window.apf.pop.PopId) {
            popId = localStorage.pop_id;
        } else {
            popId = window.apf.pop.PopId;
        }
    }

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("pop");

    // Daten für die pop aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopulation/feld=PopId/wertNumber=' + popId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // pop bereitstellen
            window.apf.pop = data;

            // Felder mit Daten beliefern
            $("#PopHerkunft" + data.PopHerkunft).prop("checked", true);
            if (data.PopHerkunftUnklar == 1) {
                $("#PopHerkunftUnklar").prop("checked", true);
            } else {
                $("#PopHerkunftUnklar").prop("checked", false);
            }
            $("#PopHerkunftUnklarBegruendung")
                .val(data.PopHerkunftUnklarBegruendung)
                .limiter(255, $("#PopHerkunftUnklarBegruendung_limit"));
            $PopName
                .val(data.PopName)
                .limiter(150, $("#PopName_limit"));
            $PopNr.val(data.PopNr);
            $("#PopBekanntSeit").val(data.PopBekanntSeit);
            $("#PopXKoord").val(data.PopXKoord);
            $("#PopYKoord").val(data.PopYKoord);

            // Formulare blenden
            // nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
            if (!ohne_zu_zeigen) {
                zeigeFormular("pop");
                history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId);

                // bei neuen Datensätzen Fokus steuern
                if (!$PopName.val()) {
                    $PopNr.focus();
                }
            }
        }
    }).fail(function () {
        window.apf.melde('Fehler: Keine Daten für die Population erhalten');
    });
};

module.exports = returnFunction;