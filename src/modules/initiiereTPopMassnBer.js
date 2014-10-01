'use strict';

var $ = require('jquery'),
    initiierePop = require('./initiierePop');
//require('jquery-ui');

var initiiereTPopMassnBer = function() {
    if (!localStorage.tpopmassnber_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("tpopmassnber");
    // Daten für die pop aus der DB holen
    var getTPopMassnBer = $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopMassnBericht/feld=TPopMassnBerId/wertNumber=' + localStorage.tpopmassnber_id,
        dataType: 'json'
    });
    getTPopMassnBer.done(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];
            // tpopmassnber bereitstellen
            window.apf.tpopmassnber = data;
            // Felder mit Daten beliefern
            $("#TPopMassnBerJahr").val(data.TPopMassnBerJahr);
            $("#TPopMassnBerErfolgsbeurteilung" + data.TPopMassnBerErfolgsbeurteilung).prop("checked", true);
            $("#TPopMassnBerTxt").val(data.TPopMassnBerTxt);
            // Formulare blenden
            window.apf.zeigeFormular("tpopmassnber");
            history.replaceState({tpopmassnber: "tpopmassnber"}, "tpopmassnber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopmassnber=" + localStorage.tpopmassnber_id);
            // bei neuen Datensätzen Fokus steuern
            $('#TPopMassnBerJahr').focus();
        }
    });
};

module.exports = initiiereTPopMassnBer;