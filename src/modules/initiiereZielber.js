'use strict';

var $ = require('jquery'),
    initiiereAp = require('./initiiereAp');
//require('jquery-ui');

var initiiereZielber = function() {
    if (!localStorage.zielber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("zielber");
    // Daten für die zielber aus der DB holen
    var getZielBer = $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblZielBericht/feld=ZielBerId/wertString=' + localStorage.zielber_id,
            dataType: 'json'
        }),
        $ZielBerJahr = $("#ZielBerJahr");
    getZielBer.done(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];
            // zeilber bereitstellen
            window.apf.zielber = data;
            // Felder mit Daten beliefern
            $ZielBerJahr.val(data.ZielBerJahr);
            $("#ZielBerErreichung").val(data.ZielBerErreichung);
            $("#ZielBerTxt").val(data.ZielBerTxt);
            // Formulare blenden
            window.apf.zeigeFormular("zielber");
            history.replaceState({zielber: "zielber"}, "zielber", "index.html?ap=" + localStorage.ap_id + "&apziel=" + localStorage.apziel_id + "&zielber=" + localStorage.zielber_id);
            // bei neuen Datensätzen Fokus steuern
            if (!$ZielBerJahr.val()) {
                $ZielBerJahr.focus();
            }
        }
    });
};

module.exports = initiiereZielber;