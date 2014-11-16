/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $             = require('jquery'),
    initiiereApp  = require('./initiiereApp'),
    initiiereAp   = require('./initiiereAp'),
    initiierePop  = require('./initiierePop'),
    zeigeFormular = require('./zeigeFormular'),
    melde         = require('./melde');

var returnFunction = function (apId, popId, massnberId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        initiiereApp();
        return;
    }
    if (!popId && !localStorage.popId && !window.apf.pop && (window.apf.pop && !window.apf.pop.PopId)) {
        // es fehlen benötigte Daten > zwei Ebenen höher
        initiiereAp(apId);
        return;
    }
    if (!massnberId && !localStorage.popmassnberId) {
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

    // massnberId setzen
    if (!localStorage.popmassnberId) {
        localStorage.popmassnberId = massnberId;
    }
    if (!massnberId) {
        massnberId = localStorage.popmassnberId;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("popmassnber");

    // Daten für die pop aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopMassnBericht/feld=PopMassnBerId/wertNumber=' + massnberId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // popmassnber bereitstellen
            window.apf.popmassnber = data;

            // Felder mit Daten beliefern
            $("#PopMassnBerJahr").val(data.PopMassnBerJahr);
            $("#PopMassnBerErfolgsbeurteilung" + data.PopMassnBerErfolgsbeurteilung).prop("checked", true);
            $("#PopMassnBerTxt").val(data.PopMassnBerTxt);

            // Formulare blenden
            zeigeFormular("popmassnber");
            history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&popmassnber=" + massnberId);

            // bei neuen Datensätzen Fokus steuern
            $('#PopMassnBerJahr').focus();
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für den Massnahmenbericht erhalten');
    });
};

module.exports = returnFunction;