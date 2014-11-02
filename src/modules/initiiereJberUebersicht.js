/*jslint node: true, browser: true, nomen: true */
'use strict';

var $              = require('jquery'),
    initiiereApp   = require('./initiiereApp'),
    initiiereAp    = require('./initiiereAp');

var returnFunction = function (apId, uebId) {
    var $JbuJahr = $("#JbuJahr");

    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereApp();
        return;
    }
    if (!uebId && !localStorage.jber_uebersicht_id) {
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

    // uebId setzen
    if (!localStorage.jber_uebersicht_id) {
        localStorage.jber_uebersicht_id = uebId;
    }
    if (!uebId) {
        uebId = localStorage.jber_uebersicht_id;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("jber_uebersicht");

    // Daten für die jber_uebersicht aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblJBerUebersicht/feld=JbuJahr/wertNumber=' + uebId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // jber_uebersicht bereitstellen
            window.apf.jber_übersicht = data;

            // Felder mit Daten beliefern
            $JbuJahr.val(data.JbuJahr);
            $("#JbuBemerkungen").val(data.JbuBemerkungen);
            // window.apf.fitTextareaToContent("Bemerkungen", document.documentElement.clientHeight);

            // Formulare blenden
            window.apf.zeigeFormular("jber_uebersicht");
            history.pushState(null, null, "index.html?ap=" + apId + "&jber_uebersicht=" + uebId);

            // bei neuen Datensätzen Fokus steuern
            if (!$JbuJahr.val()) {
                $JbuJahr.focus();
            }
        }
    }).fail(function () {
        window.apf.melde('Fehler: Keine Daten für die Übersicht erhalten');
    });
};

module.exports = returnFunction;