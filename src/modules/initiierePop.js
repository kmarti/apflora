'use strict';

var $ = require('jquery'),
    limiter = require('../lib/limiter'),
    initiiereAp = require('./initiiereAp');

var initiierePop = function() {
    if (!localStorage.pop_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("pop");
    // Daten für die pop aus der DB holen
    var getPop = $.ajax({
            type: 'get',
            url: 'php/pop.php',
            dataType: 'json',
            data: {
                "id": localStorage.pop_id
            }
        }),
        $PopName = $("#PopName"),
        $PopNr = $("#PopNr");
    getPop.always(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data) {
            // pop bereitstellen
            window.apf.pop = data;
            // Felder mit Daten beliefern
            $("#PopHerkunft" + data.PopHerkunft).prop("checked", true);
            if (data.PopHerkunftUnklar == 1) {
                $("#PopHerkunftUnklar").prop("checked", true);
            } else {
                $("#PopHerkunftUnklar").prop("checked", false);
            }
            $("#PopHerkunftUnklarBegruendung")
                .val(data.PopHerkunftUnklarBegruendung)
                .limiter(255, $("#PopHerkunftUnklarBegruendung_limit"));
            $PopName
                .val(data.PopName)
                .limiter(150, $("#PopName_limit"));
            $PopNr.val(data.PopNr);
            $("#PopBekanntSeit").val(data.PopBekanntSeit);
            $("#PopXKoord").val(data.PopXKoord);
            $("#PopYKoord").val(data.PopYKoord);
            // Formulare blenden
            // nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
            if (!ohne_zu_zeigen) {
                window.apf.zeigeFormular("pop");
                history.replaceState({pop: "pop"}, "pop", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id);
                // bei neuen Datensätzen Fokus steuern
                if (!$PopName.val()) {
                    $PopNr.focus();
                }
            }
        }
    });
};

module.exports = initiierePop;