'use strict';

var $ = jQuery  = require('jquery'),
    initiiereAp = require('./initiiereAp'),
    limiter     = require('../lib/limiter');

// damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
// Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
var initiiereBer = function () {
    var $BerAutor = $("#BerAutor"),
        $BerJahr  = $("#BerJahr"),
        $BerTitel = $("#BerTitel"),
        $BerURL   = $("#BerURL");

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    if (!localStorage.ber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp();
        return;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("ber");
    // Daten für die ber aus der DB holen
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblBer/feld=BerId/wertNumber=' + localStorage.ber_id,
        dataType: 'json'
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // ber bereitstellen
            window.apf.ber = data;

            // Felder mit Daten beliefern
            $BerAutor.val(data.BerAutor);
            $BerJahr.val(data.BerJahr);
            $BerTitel
                .val(data.BerTitel)
                .limiter(255, $("#BerTitel_limit"));
            $BerURL
                .val(data.BerURL)
                .limiter(255, $("#BerURL_limit"));

            // URL-Link initialisieren, wird bei Änderung der URL in index.html angepasst
            $('#BerURLHref').attr('onClick', "window.open('" + data.BerURL + "', target='_blank')");

            // Formulare blenden
            window.apf.zeigeFormular("ber");
            history.replaceState({ber: "ber"}, "ber", "index.html?ap=" + localStorage.apId + "&ber=" + localStorage.ber_id);

            // bei neuen Datensätzen Fokus steuern
            if (!$BerAutor.val()) {
                $BerAutor.focus();
            } else if (!$BerJahr.val()) {
                $BerJahr.focus();
            } else if (!$BerTitel.val()) {
                $BerTitel.focus();
            } else if (!$BerURL.val()) {
                $BerURL.focus();
            }
        }
    });
};

module.exports = initiiereBer;