/*jslint node: true, browser: true, nomen: true */
'use strict';

var $               = require('jquery'),
    initiiereIndex  = require('./initiiereIndex'),
    initiiereAp     = require('./initiiereAp'),
    initiierePop    = require('./initiierePop');

var returnFunction = function (apId, popId, popberId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereIndex();
        return;
    }
    if (!popId && !localStorage.pop_id && !window.apf.pop && !window.apf.pop.PopId) {
        // es fehlen benötigte Daten > zwei Ebenen höher
        initiiereAp(apId);
        return;
    }
    if (!popberId && !localStorage.popber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop(apId, popId);
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

    // popberId setzen
    if (!localStorage.popber_id) {
        localStorage.popber_id = popberId;
    }
    if (!popberId) {
        popberId = localStorage.popber_id;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("popber");

    // Daten für die popber aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopBericht/feld=PopBerId/wertNumber=' + popberId,
        dataType: 'json'
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
            window.apf.zeigeFormular("popber");
            history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&popber=" + popberId);

            // bei neuen Datensätzen Fokus steuern
            $('#PopBerJahr').focus();
        }
    });
};

module.exports = returnFunction;