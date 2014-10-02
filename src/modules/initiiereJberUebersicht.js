'use strict';

var $ = require('jquery'),
    initiiereAp = require('./initiiereAp');
//require('jquery-ui');

var returnFunction = function() {
    if (!localStorage.jber_uebersicht_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("jber_uebersicht");
    // Daten für die jber_uebersicht aus der DB holen
    var getJberÜbersicht = $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblJBerUebersicht/feld=JbuJahr/wertNumber=' + localStorage.jber_uebersicht_id,
            dataType: 'json'
        }),
        $JbuJahr = $("#JbuJahr");
    getJberÜbersicht.done(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];
            // jber_uebersicht bereitstellen
            window.apf.jber_übersicht = data;
            // Felder mit Daten beliefern
            $JbuJahr.val(data.JbuJahr);
            $("#JbuBemerkungen").val(data.JbuBemerkungen);
            // window.apf.fitTextareaToContent("Bemerkungen", document.documentElement.clientHeight);
            // Formulare blenden
            window.apf.zeigeFormular("jber_uebersicht");
            history.replaceState({jber_uebersicht: "jber_uebersicht"}, "jber_uebersicht", "index.html?ap=" + localStorage.ap_id + "&jber_uebersicht=" + localStorage.jber_uebersicht_id);
            // bei neuen Datensätzen Fokus steuern
            if (!$JbuJahr.val()) {
                $JbuJahr.focus();
            }
        }
    });
};

module.exports = returnFunction;