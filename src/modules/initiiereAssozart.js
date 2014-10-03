'use strict';

var $              = require('jquery'),
    initiiereIndex = require('./initiiereIndex'),
    initiiereAp    = require('./initiiereAp');

var returnFunction = function(apId, assozId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
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
    if (!localStorage.ap_id) {
        localStorage.ap_id = apId;
    }
    if (!apId) {
        apId = localStorage.ap_id;
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
    }).done(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data.length > 0) {
            // assozarten bereitstellen
            window.apf.assozarten = data[0];
            // Felder mit Daten beliefern
            $AaSisfNr.val(data[0].AaSisfNr);
            $("#AaBem").val(data[0].AaBem);
            // Formulare blenden
            window.apf.zeigeFormular("assozarten");
            history.replaceState({assozarten: "assozarten"}, "assozarten", "index.html?ap=" + apId + "&assozarten=" + assozId);
            // bei neuen Datensätzen Fokus steuern
            if (!$AaSisfNr.val()) {
                $AaSisfNr.focus();
            }
        }
    });
};

module.exports = returnFunction;