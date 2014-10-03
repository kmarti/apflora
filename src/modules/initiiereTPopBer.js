'use strict';

var $            = require('jquery'),
    initiierePop = require('./initiierePop');

var returnFunction = function () {
    if (!localStorage.tpopber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop();
        return;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("tpopber");

    // Daten für die tpopber aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopBericht/feld=TPopBerId/wertNumber=' + localStorage.tpopber_id,
        dataType: 'json'
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // tpopber bereitstellen
            window.apf.tpopber = data;

            // Felder mit Daten beliefern
            $("#TPopBerJahr").val(data.TPopBerJahr);
            $("#TPopBerEntwicklung" + data.TPopBerEntwicklung).prop("checked", true);
            $("#TPopBerTxt").val(data.TPopBerTxt);

            // Formulare blenden
            window.apf.zeigeFormular("tpopber");
            history.replaceState({tpopber: "tpopber"}, "tpopber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopber=" + localStorage.tpopber_id);

            // bei neuen Datensätzen Fokus steuern
            $('#TPopBerJahr').focus();
        }
    });
};

module.exports = returnFunction;