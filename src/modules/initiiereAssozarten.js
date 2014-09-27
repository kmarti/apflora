'use strict';

var $ = require('jquery'),
    initiiereAp = require('./initiiereAp');
//require('jquery-ui');

var initiiereAssozarten = function() {
    if (!localStorage.assozarten_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereAp();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("assozarten");
    // Daten für die assozarten aus der DB holen
    var getAssozarten = $.ajax({
            type: 'get',
            url: '/api/v1/apflora/tabelle=tblAssozArten/feld=AaId/wertNumber=' + localStorage.assozarten_id,
            dataType: 'json'
        }),
        $AaSisfNr = $("#AaSisfNr");
    getAssozarten.done(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data.length > 0) {
            // assozarten bereitstellen
            window.apf.assozarten = data[0];
            // Felder mit Daten beliefern
            $AaSisfNr.val(data[0].AaSisfNr);
            $("#AaBem").val(data[0].AaBem);
            // Formulare blenden
            window.apf.zeigeFormular("assozarten");
            history.replaceState({assozarten: "assozarten"}, "assozarten", "index.html?ap=" + localStorage.ap_id + "&assozarten=" + localStorage.assozarten_id);
            // bei neuen Datensätzen Fokus steuern
            if (!$AaSisfNr.val()) {
                $AaSisfNr.focus();
            }
        }
    });
};

module.exports = initiiereAssozarten;