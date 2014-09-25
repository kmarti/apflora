'use strict';

var $ = require('jquery'),
    _ = require('underscore');
//require('jquery-ui');

var initiiereAp = function() {
    if (!localStorage.ap_id) {
        // es fehlen benötigte Daten > zurück zum Anfang
        // LIEGT HIER DER WURM BEGRABEN?
        // ACHTUNG, DIESE ZEILE VERURSACHTE STARTABSTÜRZE IN FIREFOX UND ZT OFFENBAR AUCH IN CHROME, DA REKURSIV IMMER WIEDER INITIIERE_INDEX AUFGERUFEN WURDE
        //window.apf.initiiere_index();
        //history.replaceState({ap: "keinap"}, "keinap", "index.html");
        return;
    }
    // Programm-Wahl konfigurieren
    var programm_wahl;
    programm_wahl = $("[name='programm_wahl']:checked").attr("id");
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("ap");
    // Wenn ein ap ausgewählt ist: Seine Daten anzeigen
    if ($("#ap_waehlen").val() && programm_wahl !== "programm_neu") {
        // Daten für den ap aus der DB holen
        var getAp = $.ajax({
            type: 'get',
            url: 'ap=' + localStorage.ap_id,
            dataType: 'json'
        });
        getAp.always(function(data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // ap bereitstellen
                window.apf.ap = data[0];
                // Felder mit Daten beliefern
                $("#ApStatus" + data[0].ApStatus).prop("checked", true);
                $("#ApUmsetzung" + data[0].ApUmsetzung).prop("checked", true);
                $("#ApJahr").val(data[0].ApJahr);
                $("#ApArtwert").val(data[0].ApArtwert);
                $("#Artname").val(data[0].Artname);
                // ApBearb: Daten holen - oder vorhandene nutzen
                if (!window.apf.adressen_html) {
                    var getAdressen = $.ajax({
                        type: 'get',
                        url: 'api/adressen',
                        dataType: 'json'
                    });
                    getAdressen.always(function(data2) {
                        if (data2) {
                            // Feld mit Daten beliefern
                            var html;
                            html = "<option></option>";
                            _.each(data2, function(adresse) {
                                html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                            });
                            window.apf.adressen_html = html;
                            $("#ApBearb")
                                .html(html)
                                .val(window.apf.ApBearb);
                        }
                    });
                } else {
                    $("#ApBearb")
                        .html(window.apf.adressen_html)
                        .val(window.apf.ApBearb);
                }
                // Formulare blenden
                window.apf.zeigeFormular("ap");
                history.replaceState({ap: "ap"}, "ap", "index.html?ap=" + data.ApArtId);
            }
        });
    } else if ($("#ap_waehlen").val() && programm_wahl === "programm_neu") {
        // Formulare blenden
        window.apf.zeigeFormular("ap");
    }
};

module.exports = initiiereAp;