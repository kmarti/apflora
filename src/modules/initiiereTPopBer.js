/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $             = require('jquery'),
    initiiereApp  = require('./initiiereApp'),
    initiiereAp   = require('./initiiereAp'),
    initiierePop  = require('./initiierePop'),
    initiiereTPop = require('./initiiereTPop'),
    zeigeFormular = require('./zeigeFormular');

var returnFunction = function (apId, popId, tpopId, tpopBerId) {
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
    if (!tpopId && !localStorage.tpop_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop(apId, popId);
        return;
    }
    if (!tpopBerId && !localStorage.tpopber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereTPop(apId, popId, tpopId);
        return;
    }

    // apId setzen
    if (!localStorage.ap_id)           localStorage.ap_id = apId;
    if (!apId)                                       apId = localStorage.ap_id;
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
    // tpopId setzen
    if (!localStorage.tpop_id)       localStorage.tpop_id = tpopId;
    if (!tpopId)                                   tpopId = localStorage.tpop_id;
    // tpopBerId setzen
    if (!localStorage.tpopber_id) localStorage.tpopber_id = tpopBerId;
    if (!tpopBerId)                             tpopBerId = localStorage.tpopber_id;

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("tpopber");

    // Daten für die tpopber aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopBericht/feld=TPopBerId/wertNumber=' + tpopBerId
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
        window.apf.melde('Fehler: keine Daten für den Teilpopulations-Bericht erhalten');
    });
};

module.exports = returnFunction;