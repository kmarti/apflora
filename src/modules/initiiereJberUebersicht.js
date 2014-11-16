/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $              = require('jquery'),
    initiiereApp   = require('./initiiereApp'),
    initiiereAp    = require('./initiiereAp'),
    zeigeFormular  = require('./zeigeFormular'),
    melde          = require('./melde');

var returnFunction = function (apId, uebId) {
    var $JbuJahr = $("#JbuJahr");

    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        initiiereApp();
        return;
    }
    if (!uebId && !localStorage.jberUebersichtId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp(apId);
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId              = apId || localStorage.apId;

    // uebId setzen
    if (!localStorage.jberUebersichtId) {
        localStorage.jberUebersichtId = uebId;
    }
    if (!uebId) {
        uebId = localStorage.jberUebersichtId;
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
            zeigeFormular("jber_uebersicht");
            history.pushState(null, null, "index.html?ap=" + apId + "&jber_uebersicht=" + uebId);

            // bei neuen Datensätzen Fokus steuern
            if (!$JbuJahr.val()) {
                $JbuJahr.focus();
            }
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für die Übersicht erhalten');
    });
};

module.exports = returnFunction;