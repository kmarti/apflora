'use strict';

var $            = require('jquery'),
    initiierePop = require('./initiierePop');

var returnFunction = function() {
    if (!localStorage.popber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop();
        return;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("popber");

    // Daten für die popber aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopBericht/feld=PopBerId/wertNumber=' + localStorage.popber_id,
        dataType: 'json'
    }).done(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // popber bereitstellen
            window.apf.popber = data;

            // Felder mit Daten beliefern
            $("#PopBerJahr").val(data.PopBerJahr);
            $("#PopBerEntwicklung" + data.PopBerEntwicklung).prop("checked", true);
            $("#PopBerTxt").val(data.PopBerTxt);

            // Formulare blenden
            window.apf.zeigeFormular("popber");
            history.replaceState({tpopber: "popber"}, "popber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&popber=" + localStorage.popber_id);

            // bei neuen Datensätzen Fokus steuern
            $('#PopBerJahr').focus();
        }
    });
};

module.exports = returnFunction;