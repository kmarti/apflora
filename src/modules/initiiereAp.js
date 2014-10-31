/*jslint node: true, browser: true, nomen: true */
'use strict';

var $               = require('jquery'),
    initiiereApp    = require('./initiiereApp'),
    getAdressenHtml = require('./getAdressenHtml');

var returnFunction = function (apId) {

    // prüfen, ob voraussetzungen gegeben sind
    if (!localStorage.ap_id && !apId) {
        // es fehlen benötigte Daten > zurück zum Anfang
        initiiereApp();
        return;
    }

    // apId setzen
    if (!localStorage.ap_id) {
        localStorage.ap_id = apId;
    }
    if (!apId) {
        apId = localStorage.ap_id;
    }

    console.log('initiiereAp, apid = ', apId);

    // Programm-Wahl konfigurieren
    var programm_wahl = $("[name='programm_wahl']:checked").attr("id");

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("ap");

    // Wenn ein ap ausgewählt ist: Seine Daten anzeigen
    if ($("#ap_waehlen").val() && programm_wahl !== "programm_neu") {
        // Daten für den ap aus der DB holen
        $.ajax({
            type: 'get',
            url: 'api/v1/ap=' + apId,
            dataType: 'json'
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                data = data[0];
                // ap bereitstellen
                window.apf.ap = data;
                // Felder mit Daten beliefern
                $("#ApStatus" + data.ApStatus).prop("checked", true);
                $("#ApUmsetzung" + data.ApUmsetzung).prop("checked", true);
                $("#ApJahr").val(data.ApJahr);
                $("#ApArtwert").val(data.ApArtwert);
                $("#Artname").val(data.Artname);
                // Adressen holen, um ApBearb zu füllen
                getAdressenHtml(function (html) {
                    $("#ApBearb")
                        .html(html)
                        .val(window.apf.ApBearb);
                });
                // Formulare blenden
                window.apf.zeigeFormular("ap");
                history.pushState(null, null, "index.html?ap=" + data.ApArtId);
            }
        }).fail(function () {
            window.apf.melde('Fehler: Keine Daten für den Aktionsplan erhalten');
        });
    } else if ($("#ap_waehlen").val() && programm_wahl === "programm_neu") {
        // Formulare blenden
        window.apf.zeigeFormular("ap");
    }
};

module.exports = returnFunction;