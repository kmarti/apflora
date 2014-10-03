'use strict';

var $              = require('jquery'),
    initiiereIndex = require('./initiiereIndex'),
    initiiereAp    = require('./initiiereAp');

var returnFunction = function (apId, assozId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        initiiereIndex();
        return;
    }
    if (!assozId && !localStorage.assozarten_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp(apId);
        return;
    }

    // apId setzen
    if (!localStorage.apId) {
        localStorage.apId = apId;
    }
    if (!apId) {
        apId = localStorage.apId;
    }

    // assozId setzen
    if (!localStorage.assozarten_id) {
        localStorage.assozarten_id = assozId;
    }
    if (!assozId) {
        assozId = localStorage.assozarten_id;
    }

    var $AaSisfNr = $("#AaSisfNr");

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("assozarten");

    // Daten für die assozarten aus der DB holen
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblAssozArten/feld=AaId/wertNumber=' + assozId,
        dataType: 'json'
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // assozarten bereitstellen
            window.apf.assozarten = data;

            // Felder mit Daten beliefern
            $AaSisfNr.val(data.AaSisfNr);
            $("#AaBem").val(data.AaBem);

            // Formulare blenden
            window.apf.zeigeFormular("assozarten");
            history.replaceState({assozarten: "assozarten"}, "assozarten", "index.html?ap=" + apId + "&assozarten=" + assozId);

            // bei neuen Datensätzen Fokus steuern
            if (!$AaSisfNr.val()) {
                $AaSisfNr.focus();
            }
        }
    }).fail(function () {
        window.apf.melde('Fehler: Keine Daten für die assoziierte Art erhalten');
    });
};

module.exports = returnFunction;