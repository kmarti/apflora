/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                      = require('jquery'),
    initiiereAp            = require('./initiiereAp'),
    initiierePop           = require('./initiierePop'),
    zeigeFormular          = require('./zeigeFormular'),
    leereFelderVonFormular = require('./leereFelderVonFormular');

module.exports = function (apId, popId, popberId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        window.apf.initiiereApp();
        return;
    }
    if (!popId && !localStorage.popId && !window.apf.pop && (window.apf.pop && !window.apf.pop.PopId)) {
        // es fehlen benötigte Daten > zwei Ebenen höher
        initiiereAp(apId);
        return;
    }
    if (!popberId && !localStorage.popberId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop(apId, popId);
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId              = apId || localStorage.apId;

    // popId setzen
    if (!localStorage.popId) {
        if (!window.apf.pop || !window.apf.pop.PopId) {
            localStorage.popId = popId;
        } else {
            localStorage.popId = window.apf.pop.PopId;
        }
    }
    if (!popId) {
        if (!window.apf.pop || !window.apf.pop.PopId) {
            popId = localStorage.popId;
        } else {
            popId = window.apf.pop.PopId;
        }
    }

    // popberId setzen
    localStorage.popberId = localStorage.popberId || popberId;
    popberId              = popberId || localStorage.popberId;

    // Felder zurücksetzen
    leereFelderVonFormular("popber");

    // Daten für die popber aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopBericht/feld=PopBerId/wertNumber=' + popberId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // popber bereitstellen
            window.apf.popber = data;

            // Felder mit Daten beliefern
            $("#PopBerJahr").val(data.PopBerJahr);
            $("#PopBerEntwicklung" + data.PopBerEntwicklung).prop("checked", true);
            $("#PopBerTxt").val(data.PopBerTxt);

            // Formulare blenden
            zeigeFormular("popber");
            history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&popber=" + popberId);

            // bei neuen Datensätzen Fokus steuern
            $('#PopBerJahr').focus();
        }
    });
};