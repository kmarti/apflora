/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                      = require('jquery'),
    _                      = require('underscore'),
    limiter                = require('../lib/limiter'),
    initiiereAp            = require('./initiiereAp'),
    initiierePop           = require('./initiierePop'),
    getAdressenHtml        = require('./getAdressenHtml'),
    zeigeFormular          = require('./zeigeFormular'),
    melde                  = require('./melde'),
    leereFelderVonFormular = require('./leereFelderVonFormular');

module.exports = function (apId, popId, tpopId, ohneZuZeigen) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.apId) {
        // Anwendung neu initiieren
        window.apf.initiiereApp();
        return;
    }
    if (!popId && !localStorage.popId && !window.apf.pop && (window.apf.pop && !window.apf.pop.PopId)) {
        // es fehlen benötigte Daten > zwei Ebenen höher
        initiiereAp(apId);
        return;
    }
    if (!tpopId && !localStorage.tpopId) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop(apId, popId);
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId              = apId || localStorage.apId;

    // popId setzen
    if (!localStorage.popId) {
        if (!window.apf.pop || !window.apf.pop.PopId) {
            localStorage.popId = popId;
        } else {
            localStorage.popId = window.apf.pop.PopId;
        }
    }
    if (!popId) {
        if (!window.apf.pop || !window.apf.pop.PopId) {
            popId = localStorage.popId;
        } else {
            popId = window.apf.pop.PopId;
        }
    }

    // tpopId setzen
    localStorage.tpopId = localStorage.tpopId || tpopId;
    tpopId              = tpopId || localStorage.tpopId;

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    var $TPopFlurname = $("#TPopFlurname");

    // Felder zurücksetzen
    leereFelderVonFormular("tpop");

    // Daten für die pop aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTPop/feld=TPopId/wertNumber=' + tpopId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // tpop bereitstellen
            window.apf.tpop = data;

            // Felder mit Daten beliefern
            $TPopFlurname
                .val(data.TPopFlurname)
                .limiter(255, $("#TPopFlurname_limit"));
            $("#TPopNr").val(data.TPopNr);
            $("#TPopHerkunft" + data.TPopHerkunft).prop("checked", true);
            if (data.TPopHerkunftUnklar === 1) {
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

            // Adressen holen, um TPopVerantw zu füllen
            getAdressenHtml(function (html) {
                $("#TPopVerantw")
                    .html(html)
                    .val(window.apf.tpop.TPopVerantw);
            });

            // Formulare blenden
            // nur, wenn ohneZuZeigen nicht true ist (true, um in dialog anzuzeigen)
            if (!ohneZuZeigen) {
                zeigeFormular("tpop");
                history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&tpop=" + tpopId);

                // bei neuen Datensätzen Fokus steuern
                if (!$TPopFlurname.val()) {
                    $('#TPopNr').focus();
                }
            }
        }
    }).fail(function () {
        melde('Fehler: keine Daten für die Teilpopulation erhalten');
    });
};