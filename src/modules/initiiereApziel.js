/*jslint node: true, browser: true */
'use strict';

var $              = require('jquery'),
    initiiereIndex = require('./initiiereIndex'),
    initiiereAp    = require('./initiiereAp');

var returnFunction = function (apId, apZielId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereIndex();
        return;
    }
    if (!apZielId && !localStorage.apziel_id) {
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

    // apZielId setzen
    if (!localStorage.apziel_id) {
        localStorage.apziel_id = apZielId;
    }
    if (!apZielId) {
        apZielId = localStorage.apziel_id;
    }

    var $ZielJahr = $("#ZielJahr");

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("apziel");

    // Daten für die apziel aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblZiel/feld=ZielId/wertNumber=' + apZielId,
        dataType: 'json'
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];
            // apziel bereitstellen
            window.apf.apziel = data;
            // Felder mit Daten beliefern
            $ZielJahr.val(data.ZielJahr);
            $("#ZielTyp" + data.ZielTyp).prop("checked", true);
            $("#ZielBezeichnung").val(data.ZielBezeichnung);
            // Formulare blenden
            window.apf.zeigeFormular("apziel");
            history.pushState(null, null, "index.html?ap=" + apId + "&apziel=" + apZielId);
            // bei neuen Datensätzen Fokus steuern
            if (!$ZielJahr.val()) {
                $ZielJahr.focus();
            }
        }
    }).fail(function () {
        window.apf.melde('Fehler: Keine Daten für das AP-Ziel erhalten');
    });
};

module.exports = returnFunction;