'use strict';

var $               = require('jquery'),
    initiiereIndex  = require('./initiiereIndex'),
    initiiereAp     = require('./initiiereAp'),
    initiiereApziel = require('./initiiereApziel');

var returnFunction = function (apId, apZielId, zielberId) {
    var $ZielBerJahr = $("#ZielBerJahr");

    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereIndex();
        return;
    }
    if (!apZielId && !localStorage.apziel_id) {
        // es fehlen benötigte Daten > zwei Ebenen höher
        initiiereAp(apId);
        return;
    }
    if (!zielberId && !localStorage.zielber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereApziel(apId, apZielId);
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

    // zielberId setzen
    if (!localStorage.zielber_id) {
        localStorage.zielber_id = zielberId;
    }
    if (!zielberId) {
        zielberId = localStorage.zielber_id;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("zielber");

    // Daten für die zielber aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblZielBericht/feld=ZielBerId/wertString=' + zielberId,
        dataType: 'json'
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
            window.apf.zeigeFormular("zielber");
            history.pushState(null, null, "index.html?ap=" + apId + "&apziel=" + apZielId + "&zielber=" + zielberId);

            // bei neuen Datensätzen Fokus steuern
            if (!$ZielBerJahr.val()) {
                $ZielBerJahr.focus();
            }
        }
    }).fail(function () {
        window.apf.melde('Fehler: Keine Daten für den Zielbericht erhalten');
    });
};

module.exports = returnFunction;