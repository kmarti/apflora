/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                      = require('jquery'),
    initiiereAp            = require('./initiiereAp'),
    initiierePop           = require('./initiierePop'),
    initiiereTPop          = require('./initiiereTPop'),
    zeigeFormular          = require('./zeigeFormular'),
    melde                  = require('./melde'),
    leereFelderVonFormular = require('./leereFelderVonFormular');

module.exports = function (apId, popId, tpopId, tpopBerId) {
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
    if (!tpopId && !localStorage.tpopId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop(apId, popId);
        return;
    }
    if (!tpopBerId && !localStorage.tpopberId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereTPop(apId, popId, tpopId);
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
    // tpopId setzen
    localStorage.tpopId = localStorage.tpopId || tpopId;
    tpopId              = tpopId || localStorage.tpopId;
    // tpopBerId setzen
    localStorage.tpopberId = localStorage.tpopberId || tpopBerId;
    tpopBerId              = tpopBerId || localStorage.tpopberId;

    // Felder zurücksetzen
    leereFelderVonFormular("tpopber");

    // Daten für die tpopber aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTPopBer/feld=TPopBerId/wertNumber=' + tpopBerId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // tpopber bereitstellen
            window.apf.tpopber = data;

            // Felder mit Daten beliefern
            $("#TPopBerJahr").val(data.TPopBerJahr);
            $("#TPopBerEntwicklung" + data.TPopBerEntwicklung).prop("checked", true);
            $("#TPopBerTxt").val(data.TPopBerTxt);

            // Formulare blenden
            zeigeFormular("tpopber");
            history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&tpop=" + tpopId + "&tpopber=" + tpopBerId);

            // bei neuen Datensätzen Fokus steuern
            $('#TPopBerJahr').focus();
        }
    }).fail(function () {
        melde('Fehler: keine Daten für den Teilpopulations-Bericht erhalten');
    });
};