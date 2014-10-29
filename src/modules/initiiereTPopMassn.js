/*jslint node: true, browser: true */
'use strict';

var $               = require('jquery'),
    dateFormat      = require('dateformat'),
    _               = require('underscore'),
    limiter         = require('../lib/limiter'),
    initiiereIndex  = require('./initiiereIndex'),
    initiiereAp     = require('./initiiereAp'),
    initiierePop    = require('./initiierePop'),
    initiiereTPop   = require('./initiiereTPop'),
    getAdressenHtml = require('./getAdressenHtml'),
    getMassntypHtml = require('./getMassntypHtml');

var returnFunction = function (apId, popId, tpopId, massnId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereIndex();
        return;
    }
    if (!popId && !localStorage.pop_id) {
        // es fehlen benötigte Daten > zwei Ebenen höher
        initiiereAp(apId);
        return;
    }
    if (!tpopId && !localStorage.tpop_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop(apId, popId);
        return;
    }
    if (!massnId && !localStorage.tpopmassn_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereTPop(apId, popId, tpopId);
        return;
    }

    // apId setzen
    if (!localStorage.ap_id) localStorage.ap_id = apId;
    if (!apId) apId = localStorage.ap_id;
    // popId setzen
    if (!localStorage.pop_id) localStorage.pop_id = popId;
    if (!popId) popId = localStorage.pop_id;
    // tpopId setzen
    if (!localStorage.tpop_id) localStorage.tpop_id = tpopId;
    if (!tpopId) tpopId = localStorage.tpop_id;
    // massnId setzen
    if (!localStorage.tpopmassn_id) localStorage.tpopmassn_id = massnId;
    if (!massnId) massnId = localStorage.tpopmassn_id;

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("tpopmassn");

    // Daten für die pop aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/feld=TPopMassnId/wertNumber=' + massnId,
        dataType: 'json'
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // tpopmassn bereitstellen
            window.apf.tpopmassn = data;

            // Felder mit Daten beliefern
            // für select TPopMassnTyp Daten holen - oder vorhandene nutzen
            getMassntypHtml(function (html) {
                $("#TPopMassnTyp")
                    .html(html)
                    .val(window.apf.tpopmassn.TPopMassnTyp);
            });
            $("#TPopMassnTxt")
                .val(data.TPopMassnTxt)
                .limiter(255, $("#TPopMassnTxt_limit"));
            $("#TPopMassnJahr").val(data.TPopMassnJahr);
            if (data.TPopMassnDatum) {
                $("#TPopMassnDatum").val(dateFormat(data.TPopMassnDatum, 'yyyy.mm.dd'));
            }
            // Adressen holen, um TPopMassnBearb zu füllen
            getAdressenHtml(function (html) {
                $("#TPopMassnBearb")
                    .html(html)
                    .val(window.apf.tpopmassn.TPopMassnBearb);
            });
            $("#TPopMassnBemTxt").val(data.TPopMassnBemTxt);
            if (data.TPopMassnPlan === 1) {
                $("#TPopMassnPlan").prop("checked", true);
            } else {
                $("#TPopMassnPlan").prop("checked", false);
            }
            $("#TPopMassnPlanBez")
                .val(data.TPopMassnPlanBez)
                .limiter(255, $("#TPopMassnPlanBez_limit"));
            $("#TPopMassnFlaeche").val(data.TPopMassnFlaeche);
            $("#TPopMassnAnsiedForm")
                .val(data.TPopMassnAnsiedForm)
                .limiter(255, $("#TPopMassnAnsiedForm_limit"));
            $("#TPopMassnAnsiedPflanzanordnung")
                .val(data.TPopMassnAnsiedPflanzanordnung)
                .limiter(255, $("#TPopMassnAnsiedPflanzanordnung_limit"));
            $("#TPopMassnMarkierung")
                .val(data.TPopMassnMarkierung)
                .limiter(255, $("#TPopMassnMarkierung_limit"));
            $("#TPopMassnAnsiedAnzTriebe").val(data.TPopMassnAnsiedAnzTriebe);
            $("#TPopMassnAnsiedAnzPfl").val(data.TPopMassnAnsiedAnzPfl);
            $("#TPopMassnAnzPflanzstellen").val(data.TPopMassnAnzPflanzstellen);
            // für TPopMassnAnsiedWirtspfl wurde die Artliste schon bereitgestellt
            // wenn die Anwendung direkt auf einer TPopMassn geöffnet wird, ist die Liste noch nicht bereit
            // darum hier nochmals holen
            // TODO: kann das optimiert werden? (nicht auf Artlisten warten)
            $.when(window.apf.erstelle_artlisten())
            .then(function () {
                $("#TPopMassnAnsiedWirtspfl").val(data.TPopMassnAnsiedWirtspfl);
                $("#TPopMassnAnsiedHerkunftPop")
                    .val(data.TPopMassnAnsiedHerkunftPop)
                    .limiter(255, $("#TPopMassnAnsiedHerkunftPop_limit"));
                $("#TPopMassnAnsiedDatSamm")
                    .val(data.TPopMassnAnsiedDatSamm)
                    .limiter(50, $("#TPopMassnAnsiedDatSamm_limit"));
                $("#TPopMassnGuid").val(data.TPopMassnGuid);

                // Formulare blenden
                window.apf.zeigeFormular("tpopmassn");
                history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&tpop=" + tpopId + "&tpopmassn=" + massnId);

                // bei neuen Datensätzen Fokus steuern
                $('#TPopMassnJahr').focus();
            });
        }
    }).fail(function () {
        window.apf.melde('Fehler: keine Daten für die Massnahme erhalten');
    });
};

module.exports = returnFunction;