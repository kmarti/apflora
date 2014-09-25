'use strict';

var $ = require('jquery'),
    initiierePop = require('./initiierePop');
//require('jquery-ui');

var initiierePopBer = function() {
    if (!localStorage.popber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("popber");
    // Daten für die popber aus der DB holen
    var getPopber = $.ajax({
        type: 'get',
        url: 'php/popber.php',
        dataType: 'json',
        data: {
            "id": localStorage.popber_id
        }
    });
    getPopber.always(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data) {
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

module.exports = initiierePopBer;