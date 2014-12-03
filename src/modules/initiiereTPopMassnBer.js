/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                      = require('jquery'),
    initiiereAp            = require('./initiiereAp'),
    initiierePop           = require('./initiierePop'),
    initiiereTPop          = require('./initiiereTPop'),
    zeigeFormular          = require('./zeigeFormular'),
    melde                  = require('./melde'),
    leereFelderVonFormular = require('./leereFelderVonFormular');

module.exports = function (apId, popId, tpopId, massnBerId) {
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
    if (!massnBerId && !localStorage.tpopmassnberId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereTPop(apId, popId, tpopId);
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId = apId || localStorage.apId;
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
    tpopId = tpopId || localStorage.tpopId;
    // massnBerId setzen
    localStorage.tpopmassnberId = localStorage.tpopmassnberId || massnBerId;
    massnBerId = massnBerId || localStorage.tpopmassnberId;

    // Felder zurücksetzen
    leereFelderVonFormular("tpopmassnber");

    // Daten für die pop aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTPopMassnBer/feld=TPopMassnBerId/wertNumber=' + massnBerId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // tpopmassnber bereitstellen
            window.apf.tpopmassnber = data;

            // Felder mit Daten beliefern
            $("#TPopMassnBerJahr").val(data.TPopMassnBerJahr);
            $("#TPopMassnBerErfolgsbeurteilung" + data.TPopMassnBerErfolgsbeurteilung).prop("checked", true);
            $("#TPopMassnBerTxt").val(data.TPopMassnBerTxt);

            // Formulare blenden
            zeigeFormular("tpopmassnber");
            history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&tpop=" + tpopId + "&tpopmassnber=" + massnBerId);

            // bei neuen Datensätzen Fokus steuern
            $('#TPopMassnBerJahr').focus();
        }
    }).fail(function () {
        melde('Fehler: keine Daten für den Massnahmen-Bericht erhalten');
    });
};