'use strict';

var $ = require('jquery'),
    initiierePop = require('./initiierePop');
//require('jquery-ui');

var initiierePopMassnBer = function() {
    if (!localStorage.popmassnber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("popmassnber");
    // Daten für die pop aus der DB holen
    var getPopmassnber = $.ajax({
        type: 'get',
        url: 'php/popmassnber.php',
        dataType: 'json',
        data: {
            "id": localStorage.popmassnber_id
        }
    });
    getPopmassnber.always(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data) {
            // popmassnber bereitstellen
            window.apf.popmassnber = data;
            // Felder mit Daten beliefern
            $("#PopMassnBerJahr").val(data.PopMassnBerJahr);
            $("#PopMassnBerErfolgsbeurteilung" + data.PopMassnBerErfolgsbeurteilung).prop("checked", true);
            $("#PopMassnBerTxt").val(data.PopMassnBerTxt);
            // Formulare blenden
            window.apf.zeigeFormular("popmassnber");
            history.replaceState({popmassnber: "popmassnber"}, "popmassnber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&popmassnber=" + localStorage.popmassnber_id);
            // bei neuen Datensätzen Fokus steuern
            $('#PopMassnBerJahr').focus();
        }
    });
};

module.exports = initiierePopMassnBer;