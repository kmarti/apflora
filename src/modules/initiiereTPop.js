'use strict';

var $ = require('jquery'),
    _ = require('underscore'),
    initiierePop = require('./initiierePop');
//require('jquery-ui');

var initiiereTPop = function() {
    var $TPopFlurname = $("#TPopFlurname");
    if (!localStorage.tpop_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("tpop");
    // Daten für die pop aus der DB holen
    var getTPop = $.ajax({
        type: 'get',
        url: 'php/tpop.php',
        dataType: 'json',
        data: {
            "id": localStorage.tpop_id
        }
    });
    getTPop.always(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data) {
            // tpop bereitstellen
            window.apf.tpop = data;
            // Felder mit Daten beliefern
            $TPopFlurname
                .val(data.TPopFlurname)
                .limiter(255, $("#TPopFlurname_limit"));
            $("#TPopNr").val(data.TPopNr);
            $("#TPopHerkunft" + data.TPopHerkunft).prop("checked", true);
            if (data.TPopHerkunftUnklar == 1) {
                $("#TPopHerkunftUnklar").prop("checked", true);
            } else {
                $("#TPopHerkunftUnklar").prop("checked", false);
            }
            $("#TPopHerkunftUnklarBegruendung")
                .val(data.TPopHerkunftUnklarBegruendung)
                .limiter(255, $("#TPopHerkunftUnklarBegruendung_limit"));
            $("#TPopApBerichtRelevant" + data.TPopApBerichtRelevant).prop("checked", true);
            $("#TPopBekanntSeit").val(data.TPopBekanntSeit);
            $("#TPopGemeinde")
                .val(data.TPopGemeinde)
                .limiter(255, $("#TPopGemeinde_limit"));
            $("#TPopXKoord").val(data.TPopXKoord);
            $("#TPopYKoord").val(data.TPopYKoord);
            $("#TPopRadius").val(data.TPopRadius);
            $("#TPopHoehe").val(data.TPopHoehe);
            $("#TPopExposition")
                .val(data.TPopExposition)
                .limiter(50, $("#TPopExposition_limit"));
            $("#TPopKlima")
                .val(data.TPopKlima)
                .limiter(50, $("#TPopKlima_limit"));
            $("#TPopNeigung")
                .val(data.TPopNeigung)
                .limiter(50, $("#TPopNeigung_limit"));
            $("#TPopBeschr")
                .val(data.TPopBeschr)
                .limiter(255, $("#TPopBeschr_limit"));
            $("#TPopKatNr")
                .val(data.TPopKatNr)
                .limiter(255, $("#TPopKatNr_limit"));
            $("#TPopEigen")
                .val(data.TPopEigen)
                .limiter(255, $("#TPopEigen_limit"));
            $("#TPopKontakt")
                .val(data.TPopKontakt)
                .limiter(255, $("#TPopKontakt_limit"));
            $("#TPopNutzungszone")
                .val(data.TPopNutzungszone)
                .limiter(255, $("#TPopNutzungszone_limit"));
            $("#TPopBewirtschafterIn")
                .val(data.TPopBewirtschafterIn)
                .limiter(255, $("#TPopBewirtschafterIn_limit"));
            $("#TPopBewirtschaftung")
                .val(data.TPopBewirtschaftung)
                .limiter(255, $("#TPopBewirtschaftung_limit"));
            $("#TPopTxt").val(data.TPopTxt);
            // für select Daten holen - oder vorhandene nutzen
            if (!window.apf.adressen_html) {
                var getAdressen = $.ajax({
                    type: 'get',
                    url: 'api/adressen',
                    dataType: 'json'
                });
                getAdressen.always(function(data2) {
                    if (data2) {
                        // adressen bereitstellen
                        window.apf.adressen = data2;
                        localStorage.adressen = JSON.stringify(data2);
                        // Feld mit Daten beliefern
                        var html;
                        html = "<option></option>";
                        _.each(data2, function(adresse) {
                            html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                        });
                        window.apf.adressen_html = html;
                        $("#TPopVerantw")
                            .html(html)
                            .val(window.apf.tpop.TPopVerantw);
                    }
                });
            } else {
                $("#TPopVerantw")
                    .html(window.apf.adressen_html)
                    .val(window.apf.tpop.TPopVerantw);
            }
            // Formulare blenden
            // nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
            if (!ohne_zu_zeigen) {
                window.apf.zeigeFormular("tpop");
                history.replaceState({tpop: "tpop"}, "tpop", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id);
                // bei neuen Datensätzen Fokus steuern
                if (!$TPopFlurname.val()) {
                    $('#TPopNr').focus();
                }
            }
        }
    });
    getTPop.fail(function() {
        //window.apf.melde('Fehler: keine Daten für die Teilpopulation erhalten');
        console.log('Fehler: keine Daten für die Teilpopulation erhalten');
    });
};

module.exports = initiiereTPop;