/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                            = require('jquery'),
    dateFormat                   = require('dateformat'),
    initiiereAp                  = require('./initiiereAp'),
    pruefeSchreibvoraussetzungen = require('./pruefeSchreibvoraussetzungen'),
    zeigeFormular                = require('./zeigeFormular'),
    melde                        = require('./melde');

var initiiereIdealbiotop = function (apId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!localStorage.apId && !apId) {
        // es fehlen benötigte Daten > zurück zum Anfang
        window.apf.initiiereApp();
        return;
    }

    // apId setzen
    localStorage.apId = localStorage.apId || apId;
    apId              = apId || localStorage.apId;

    var $IbErstelldatum  = $("#IbErstelldatum");

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("idealbiotop");

    // Daten für die idealbiotop aus der DB holen
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblIdealbiotop/feld=IbApArtId/wertNumber=' + localStorage.apId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // idealbiotop bereitstellen
            localStorage.idealbiotopId = data.IbApArtId;
            window.apf.idealbiotop     = data;

            // Felder mit Daten beliefern
            if (data.IbErstelldatum) {
                // chrome akzeptiert nur - getrennte Daten. Und zeigt sie dann gemäss Pattern korrekt an
                // die übrigen stellen mit - getrennte Daten leider mit - dar
                if (!!window.chrome) {
                    $("#IbErstelldatum").val(dateFormat(data.IbErstelldatum, 'yyyy-mm-dd'));
                } else {
                    $("#IbErstelldatum").val(dateFormat(data.IbErstelldatum, 'dd.mm.yyyy'));
                }
            }
            $("#IbHoehenlage").val(data.IbHoehenlage);
            $("#IbRegion").val(data.IbRegion);
            $("#IbExposition").val(data.IbExposition);
            $("#IbBesonnung").val(data.IbBesonnung);
            $("#IbHangneigung").val(data.IbHangneigung);
            $("#IbBodenTyp").val(data.IbBodenTyp);
            $("#IbBodenKalkgehalt").val(data.IbBodenKalkgehalt);
            $("#IbBodenDurchlaessigkeit").val(data.IbBodenDurchlaessigkeit);
            $("#IbBodenHumus").val(data.IbBodenHumus);
            $("#IbBodenNaehrstoffgehalt").val(data.IbBodenNaehrstoffgehalt);
            $("#IbWasserhaushalt").val(data.IbWasserhaushalt);
            $("#IbKonkurrenz").val(data.IbKonkurrenz);
            $("#IbMoosschicht").val(data.IbMoosschicht);
            $("#IbKrautschicht").val(data.IbKrautschicht);
            $("#IbStrauchschicht").val(data.IbStrauchschicht);
            $("#IbBaumschicht").val(data.IbBaumschicht);
            $("#IbBemerkungen").val(data.IbBemerkungen);

            // Formulare blenden
            zeigeFormular("idealbiotop");
            history.pushState(null, null, "index.html?ap=" + localStorage.apId + "&idealbiotop=" + localStorage.idealbiotopId);

            // bei neuen Datensätzen Fokus steuern
            if (!$IbErstelldatum.val()) {
                $IbErstelldatum.focus();
            }
        } else {
            // nur aktualisieren, wenn Schreibrechte bestehen
            if (!pruefeSchreibvoraussetzungen()) {
                return;
            }

            // null zurückgekommen > Datensatz schaffen
            $.ajax({
                type: 'post',
                url: '/api/v1/insert/apflora/tabelle=tblIdealbiotop/feld=IbApArtId/wert=' + localStorage.apId + '/user=' + sessionStorage.user
            }).done(function () {
                localStorage.idealbiotopId = localStorage.apId;
                initiiereIdealbiotop();
            }).fail(function () {
                melde("Fehler: Kein Idealbiotop erstellt");
            });
        }
    });
};

module.exports = initiiereIdealbiotop;