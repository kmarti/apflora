/*jslint node: true, browser: true, nomen: true */
'use strict';

var $               = require('jquery'),
    initiiereIndex  = require('./initiiereIndex'),
    initiiereAp     = require('./initiiereAp'),
    initiierePop    = require('./initiierePop');

var returnFunction = function (apId, popId, massnberId) {
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
    if (!massnberId && !localStorage.popmassnber_id) {
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

    // massnberId setzen
    if (!localStorage.popmassnber_id) {
        localStorage.popmassnber_id = massnberId;
    }
    if (!massnberId) {
        massnberId = localStorage.popmassnber_id;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("popmassnber");

    // Daten für die pop aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopMassnBericht/feld=PopMassnBerId/wertNumber=' + massnberId,
        dataType: 'json'
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
            window.apf.zeigeFormular("popmassnber");
            history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&popmassnber=" + massnberId);

            // bei neuen Datensätzen Fokus steuern
            $('#PopMassnBerJahr').focus();
        }
    }).fail(function () {
        window.apf.melde('Fehler: Keine Daten für den Massnahmenbericht erhalten');
    });
};

module.exports = returnFunction;