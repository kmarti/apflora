'use strict';

var $           = require('jquery'),
    initiiereAp = require('./initiiereAp'),
    limiter     = require('../lib/limiter');

var returnFunction = function() {
    var $ErfkritErreichungsgrad = $("#ErfkritErreichungsgrad");

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    if (!localStorage.erfkrit_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("erfkrit");

    // Daten für die erfkrit aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblErfKrit/feld=ErfkritId/wertString=' + localStorage.erfkrit_id,
        dataType: 'json'
    }).done(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // erfkrit bereitstellen
            window.apf.erfkrit = data;

            // Felder mit Daten beliefern
            $("#ErfkritErreichungsgrad" + data.ErfkritErreichungsgrad).prop("checked", true);
            $("#ErfkritTxt")
                .val(data.ErfkritTxt)
                .limiter(255, $("#ErfkritTxt_limit"));

            // Formulare blenden
            window.apf.zeigeFormular("erfkrit");
            history.replaceState({erfkrit: "erfkrit"}, "erfkrit", "index.html?ap=" + localStorage.ap_id + "&erfkrit=" + localStorage.erfkrit_id);

            // bei neuen Datensätzen Fokus steuern
            if (!$ErfkritErreichungsgrad.val()) {
                $ErfkritErreichungsgrad.focus();
            }
        }
    });
};

module.exports = returnFunction;