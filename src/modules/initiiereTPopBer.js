'use strict';

var $              = require('jquery'),
    initiiereIndex = require('./initiiereIndex'),
    initiiereAp    = require('./initiiereAp'),
    initiierePop   = require('./initiierePop'),
    initiiereTPop  = require('./initiiereTPop');

var returnFunction = function (apId, popId, tpopId, tpopBerId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereIndex();
        return;
    }
    if (!popId && !localStorage.pop_id) {
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
    if (!localStorage.pop_id)         localStorage.pop_id = popId;
    if (!popId)                                     popId = localStorage.pop_id;
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
        url: 'api/v1/apflora/tabelle=tblTeilPopBericht/feld=TPopBerId/wertNumber=' + tpopBerId,
        dataType: 'json'
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
            window.apf.zeigeFormular("tpopber");
            history.replaceState({tpopber: "tpopber"}, "tpopber", "index.html?ap=" + apId + "&pop=" + popId + "&tpop=" + tpopId + "&tpopber=" + tpopBerId);

            // bei neuen Datensätzen Fokus steuern
            $('#TPopBerJahr').focus();
        }
    }).fail(function () {
        window.apf.melde('Fehler: keine Daten für den Teilpopulations-Bericht erhalten');
    });
};

module.exports = returnFunction;